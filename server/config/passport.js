import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

export const configurePassport = () => {
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
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            // Link Google to existing user without blocking local login
            let needsSave = false;
            if (!user.googleId) {
              user.googleId = profile.id;
              needsSave = true;
            }
            // Do not override authProvider if the user already has a password (i.e., local account)
            // Only set authProvider on new account creation below
            const newAvatar = profile.photos[0]?.value;
            if (newAvatar && user.avatar !== newAvatar) {
              user.avatar = newAvatar;
              needsSave = true;
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
            avatar: profile.photos[0]?.value,
          });

          done(null, user);
        } catch (error) {
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
        callbackURL: process.env.GITHUB_CALLBACK_URL,
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

          if (user) {
            // Link GitHub to existing user without blocking local login
            let needsSave = false;
            if (!user.githubId) {
              user.githubId = profile.id;
              needsSave = true;
            }
            // Do not override authProvider for existing local users
            const newAvatar = profile.photos[0]?.value;
            if (newAvatar && user.avatar !== newAvatar) {
              user.avatar = newAvatar;
              needsSave = true;
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
            avatar: profile.photos[0]?.value,
          });

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};
