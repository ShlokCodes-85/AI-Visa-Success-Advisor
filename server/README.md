# Authentication Backend

This is the backend server for the visa application authentication system.

## Features

- **Local Authentication**: Register and login with email/password
- **OAuth Integration**: Google and GitHub OAuth authentication
- **Password Validation**:
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One special character
  - 8-15 characters long
- **JWT Tokens**: Secure authentication with JWT
- **MongoDB**: User data storage

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

3. Update the `.env` file with your credentials:

   - Set MongoDB connection string
   - Generate JWT secret
   - Add Google OAuth credentials (from Google Cloud Console)
   - Add GitHub OAuth credentials (from GitHub Developer Settings)

4. Start MongoDB (if running locally):

```bash
mongod
```

5. Start the server:

```bash
npm run dev
```

## API Endpoints

### Authentication Routes

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/password
- `GET /auth/me` - Get current user (requires JWT token)

### OAuth Routes

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback

## Setting up OAuth

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret to `.env`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set callback URL: `http://localhost:5000/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

## Environment Variables

See `.env.example` for all required environment variables.
