# Authentication Backend

This is the backend server for the visa application authentication system.

## Features

- **Local Authentication**: Register and login with email/password
- **OAuth Integration**: Google and GitHub OAuth authentication
- **Password Reset**: Email-based password reset with secure tokens
- **Password Validation**:
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One special character
  - 8-15 characters long
- **JWT Tokens**: Secure authentication with JWT
- **MongoDB**: User data storage
- **Email Service**: Nodemailer integration for transactional emails

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
- `POST /auth/forgot-password` - Request password reset email
- `POST /auth/reset-password/:token` - Reset password with token

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

## Setting up Email Service

The application uses Nodemailer to send password reset emails. You can use Gmail or any custom SMTP server.

### Using Gmail (Recommended for Development)

1. Enable 2-Factor Authentication on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new App Password for "Mail"
4. Update your `.env` file:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

**Note**: Never use your regular Gmail password. Always use App Passwords.

### Using Custom SMTP

For production, consider using a dedicated email service like SendGrid, AWS SES, or Mailgun:

```env
EMAIL_SERVICE=custom
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-username
SMTP_PASSWORD=your-password
```

### Email Templates

The application includes a professional HTML email template for password reset emails featuring:
- Branded header with logo
- Clear call-to-action button
- Fallback plain text link
- Security warnings
- Responsive design

You can customize the template in `config/email.js`.

## Environment Variables

See `.env.example` for all required environment variables.
