# Environment Variables Setup

Create a `.env` file in your project root with the following variables:

## Database Configuration
```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todo_db
DB_PASSWORD=bolt@123
DB_PORT=5435
```

## JWT Configuration
```
JWT_SECRET=your_jwt_secret_here
```

## Email Configuration (Optional - for password reset)
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Frontend URL (for password reset links)
```
FRONTEND_URL=http://localhost:3000
```

## Email Setup Instructions

### For Gmail (Recommended):
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### Testing Without Email:
If you don't want to set up email for testing:
- Simply omit the `EMAIL_USER` and `EMAIL_PASSWORD` variables
- The system will still generate reset tokens and provide the reset URL in the response
- You can copy the `resetUrl` from the API response and use it to test the reset functionality

## Database Update
Run the following SQL to add reset token columns to your existing database:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
```

## Testing the Reset Password Functionality

1. **Without Email Setup:**
   ```bash
   # Request password reset
   POST /api/users/forget-password
   {
     "email": "user@example.com"
   }
   
   # Response will include resetUrl
   {
     "message": "Password reset token generated. Email service not configured.",
     "resetUrl": "http://localhost:3000/reset-password/token_here",
     "note": "Use the resetUrl to test the password reset functionality"
   }
   ```

2. **With Email Setup:**
   - The system will attempt to send an email
   - If email fails, it will still return the reset URL for testing
   - Check console logs for detailed error messages

## Troubleshooting

### Email Issues:
- **Missing credentials**: System will work without email, just return reset URL
- **Gmail App Password**: Make sure to use App Password, not regular password
- **2FA required**: Gmail requires 2FA to be enabled for App Passwords

### Reset Link Issues:
- **Token not found**: Check if token is copied correctly from console/response
- **Token expired**: Tokens expire after 1 hour
- **User not found**: Ensure the email exists in the database

### Page Loading Issues:
- **Server not running**: Make sure server is running on port 3000
- **Views folder**: Ensure `views/` folder exists with HTML files
- **Static files**: Check that `app.js` serves static files correctly 