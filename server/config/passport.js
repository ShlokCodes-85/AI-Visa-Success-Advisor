import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

// Helper function to extract avatar from various OAuth profiles
const getAvatarUrl = (profile) => {
  // Check multiple possible locations for avatar
  if (profile.photos && profile.photos[0] && profile.photos[0].value) {
    return profile.photos[0].value;
  }
  if (profile._json && profile._json.avatar_url) {
    return profile._json.avatar_url;
  }
  if (profile._json && profile._json.picture) {
    return profile._json.picture;
  }
  return null;
};

export const configurePassport = () => {
  // Validate required env vars
  const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error("[PASSPORT ERROR] Missing environment variables:", missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    console.log("Serializing user:", user._id);
    done(null, user._id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      console.log("Deserializing user:", id);
      const user = await User.findById(id);
      console.log("User found:", user ? "yes" : "no");
      done(null, user);
    } catch (error) {
      console.error("Deserialization error:", error);
      done(error, null);
    }
  });

  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "production" ? process.env.GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL_LOCAL || "http://localhost:5000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });
          const avatarUrl = getAvatarUrl(profile);

          if (user) {
            // Link Google to existing user without blocking local login
            let needsSave = false;
            if (!user.googleId) {
              user.googleId = profile.id;
              needsSave = true;
            }
            // Do not override authProvider if the user already has a password (i.e., local account)
            // Only set authProvider on new account creation below
            if (avatarUrl && user.avatar !== avatarUrl) {
              user.avatar = avatarUrl;
              needsSave = true;
              console.log("[GOOGLE AUTH] Updated avatar for existing user:", user.email);
            }
            if (needsSave) await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            fullName: profile.displayName,
            email: profile.emails[0].value,
            authProvider: "google",
            googleId: profile.id,
            avatar: avatarUrl,
          });

          console.log("[GOOGLE AUTH] Created new user with avatar:", user.email, !!avatarUrl);
          done(null, user);
        } catch (error) {
          console.error("[GOOGLE AUTH] Error:", error);
          done(error, null);
        }
      }
    )
  );

  // GitHub OAuth Strategy
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.NODE_ENV === "production" ? process.env.GITHUB_CALLBACK_URL : process.env.GITHUB_CALLBACK_URL_LOCAL || "http://localhost:5000/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Get primary email from GitHub
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("No email found from GitHub"), null);
          }

          // Check if user already exists
          let user = await User.findOne({ email });
          const avatarUrl = getAvatarUrl(profile);

          if (user) {
            // Link GitHub to existing user without blocking local login
            let needsSave = false;
            if (!user.githubId) {
              user.githubId = profile.id;
              needsSave = true;
            }
            // Do not override authProvider for existing local users
            if (avatarUrl && user.avatar !== avatarUrl) {
              user.avatar = avatarUrl;
              needsSave = true;
              console.log("[GITHUB AUTH] Updated avatar for existing user:", user.email);
            }
            if (needsSave) await user.save();
            return done(null, user);
          }

          // Create new user
          user = await User.create({
            fullName: profile.displayName || profile.username,
            email,
            authProvider: "github",
            githubId: profile.id,
            avatar: avatarUrl,
          });

          console.log("[GITHUB AUTH] Created new user with avatar:", user.email, !!avatarUrl);
          done(null, user);
        } catch (error) {
          console.error("[GITHUB AUTH] Error:", error);
          done(error, null);
        }
      }
    )
  );
};
