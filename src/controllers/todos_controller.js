import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todo_db',
    password: process.env.DB_PASSWORD || 'bolt@123',
    port: process.env.DB_PORT || 5435,
});

// GET all todos for the authenticated user
export const get_todos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM todos WHERE user_id = $1', [req.userData.userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// POST a new todo
export const create_todo = async (req, res) => {
    const { task } = req.body;
    if (!task) {
        return res.status(400).json({ error: 'Task is required' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO todos (task, user_id) VALUES ($1, $2) RETURNING *',
            [task, req.userData.userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// PUT (update) a todo
export const update_todo = async (req, res) => {
    const { todoId } = req.params;
    const { task, completed } = req.body;
    try {
        const result = await pool.query(
            'UPDATE todos SET task = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
            [task, completed, todoId, req.userData.userId]
        );
        console.log(result);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

// DELETE a todo
export const delete_todo = async (req, res) => {
    const { todoId } = req.params;
    try {
        const result = await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *', [todoId, req.userData.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        console.error(err.stack);
        res.status(500).json({ error: 'Database error' });
    }
};

export default router; 