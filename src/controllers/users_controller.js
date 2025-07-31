import express from 'express';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todo_db',
    password: process.env.DB_PASSWORD || 'bolt@123',
    port: process.env.DB_PORT || 5435,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Email transporter configuration
const createTransporter = () => {
    // Check if email credentials are provided
    if (!"8be532001@smtp-brevo.com" || !"LOI5GZTdJ4g8hUCv") {
        console.log('Email credentials not provided. Email sending will be disabled.');
        return null;
    }

    // Try to create transporter with Brevo
    try {
        return nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: "8be532001@smtp-brevo.com",
                pass: "LOI5GZTdJ4g8hUCv"
            }
        });
    } catch (error) {
        console.log('Failed to create email transporter:', error.message);
        return null;
    }
};

const transporter = createTransporter();

// Register
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    try {
        const hash = await bcrypt.hash(password, 10);
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        const result = await pool.query(
            'INSERT INTO users (name, email, password, token) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
            [name, email, hash, token]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// Login
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log(user);
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        // Update token in database
        await pool.query('UPDATE users SET token = $1 WHERE id = $2', [token, user.id]);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get All Users
export const get_users = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json({ users: result.rows });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get current user profile
export const get_user = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.userData.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete User
export const delete_user = async (req, res) => {
    const { userId } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// Logout - invalidate token
export const logout = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ error: 'No token provided' });
    }

    try {
        // Clear the token in database
        await pool.query('UPDATE users SET token = NULL WHERE token = $1', [token]);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// Forget Password
export const forget_password = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // Check if user exists
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate OTP (4-digit code)
        const otp = crypto.randomInt(1000, 9999).toString();
        const otpExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save OTP to database
        await pool.query(
            'UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3',
            [otp, otpExpiry, email]
        );

        // Create reset URL with OTP as query parameter
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?otp=${otp}`;

        console.log('OTP generated:', otp);
        console.log('Reset URL:', resetUrl);

        // Try to send email if transporter is available
        if (transporter) {
            try {
                const mailOptions = {
                    from: "musab@digitechinfra.com",
                    to: email,
                    subject: 'Password Reset Request',
                    html: `
                        <h2>Password Reset Request</h2>
                        <p>You requested a password reset for your account.</p>
                        <p>Your OTP code is: <strong>${otp}</strong></p>
                        <p>Click the link below to reset your password:</p>
                        <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
                        <p>This OTP will expire in 1 hour.</p>
                        <p>If you didn't request this, please ignore this email.</p>
                    `
                };
                console.log(mailOptions);

                await transporter.sendMail(mailOptions);
                console.log('Password reset email sent successfully to:', email);
                res.json({ 
                    message: 'Password reset email sent successfully',
                    resetUrl: resetUrl,
                    otp: otp // Include OTP for testing
                });
            } catch (emailError) {
                console.error('Email sending failed:', emailError.message);
                res.json({ 
                    message: 'OTP generated. Email sending failed, but you can use the reset URL.',
                    resetUrl: resetUrl,
                    otp: otp,
                    error: 'Email sending failed'
                });
            }
        } else {
            // Email service not configured, return the reset URL for testing
            res.json({ 
                message: 'OTP generated. Email service not configured.',
                resetUrl: resetUrl,
                otp: otp,
                note: 'Use the resetUrl or OTP to test the password reset functionality'
            });
        }
    } catch (err) {
        console.error('Forget password error:', err.stack);
        res.status(500).json({ error: 'Error processing password reset request' });
    }
};

// Reset Password
export const reset_password = async (req, res) => {
    const { otp, newPassword } = req.body;
    
    if (!otp || !newPassword) {
        return res.status(400).json({ error: 'OTP and new password are required' });
    }

    try {
        // Find user with valid OTP
        const userResult = await pool.query(
            'SELECT * FROM users WHERE otp = $1 AND otp_expiry > NOW()',
            [otp]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const user = userResult.rows[0];

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP
        await pool.query(
            'UPDATE users SET password = $1, otp = NULL, otp_expiry = NULL WHERE id = $2',
            [hashedPassword, user.id]
        );

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Error resetting password' });
    }
};

export default router;