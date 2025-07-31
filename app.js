// Import required modules using ES Modules
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import todosRouter from './src/routes/todo_routes.js';
import usersRouter from './src/routes/user_routes.js';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and enable CORS
app.use(express.json());
app.use(cors());

// Morgan middleware for logging
app.use(morgan('dev'));

// Serve static files from views folder
app.use(express.static(path.join(__dirname, 'views')));

// PostgreSQL connection configuration
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todo_db',
    password: process.env.DB_PASSWORD || 'bolt@123',
    port: process.env.DB_PORT || 5435,
});

// API routes
app.use('/api/users', usersRouter);
app.use('/api/todos', todosRouter);

// Serve reset password page
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'reset-password.html'));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views', 'login.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});