# Reset Password Functionality Guide

## Overview
The reset password functionality allows users to reset their password via email. The system includes a complete web interface for a seamless user experience.

## How It Works

### 1. User Requests Password Reset
- User visits `http://localhost:3000` (login page)
- Clicks "Forgot Password?" button
- Enters their email address
- System generates a secure reset token and sends an email

### 2. Email with Reset Link
The system generates a reset link like:
```
http://localhost:3000/reset-password/{token}
```

### 3. User Clicks Reset Link
- User clicks the link in their email
- Browser opens the reset password page
- User enters new password and confirms it
- System validates the token and updates the password

## Files Created

### Frontend Pages
- `views/login.html` - Login page with forget password modal
- `views/reset-password.html` - Reset password form

### Backend Updates
- `app.js` - Updated to serve static files and handle routes
- `src/controllers/users_controller.js` - Added forget_password and reset_password functions
- `src/routes/user_routes.js` - Added new API endpoints

## API Endpoints

### Forget Password
```
POST /api/users/forget-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```
POST /api/users/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

## Web Routes

### Login Page
```
GET http://localhost:3000/
```

### Reset Password Page
```
GET http://localhost:3000/reset-password/{token}
```

## Testing the Functionality

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Visit the login page:**
   ```
   http://localhost:3000
   ```

3. **Test forget password:**
   - Click "Forgot Password?"
   - Enter an email address
   - Check the console for the reset token (since email is commented out)

4. **Test reset password:**
   - Copy the token from console
   - Visit: `http://localhost:3000/reset-password/{token}`
   - Enter new password and confirm
   - Submit the form

## Features

### Reset Password Page
- ✅ Modern, responsive design
- ✅ Password visibility toggle
- ✅ Password confirmation validation
- ✅ Loading states and error handling
- ✅ Auto-redirect after successful reset
- ✅ Token validation from URL

### Login Page
- ✅ Clean, modern interface
- ✅ Forget password modal
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

## Security Features
- Reset tokens expire after 1 hour
- Tokens are cryptographically secure (32 bytes random)
- Passwords are hashed using bcrypt
- Tokens are cleared after successful reset
- User can only reset their own password

## Environment Variables Required
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

## Database Schema
The users table now includes:
- `reset_token` - Stores the reset token
- `reset_token_expiry` - Token expiration timestamp

## Troubleshooting

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, use App Password instead of regular password
- Check console logs for email errors

### Reset Link Not Working
- Verify the token in the URL
- Check if token has expired (1 hour limit)
- Ensure the user exists in the database

### Page Not Loading
- Verify the server is running on port 3000
- Check that views folder exists
- Ensure static file serving is enabled in app.js 