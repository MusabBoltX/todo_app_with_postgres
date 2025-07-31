import { Router } from 'express';
import verify from '../middlewares/auth.js';
import { create_todo, get_todos, update_todo, delete_todo } from '../controllers/todos_controller.js';
const router = Router();

router.post('/create', verify, create_todo);

router.get('/list', verify, get_todos);

router.put('/:todoId', verify, update_todo);

router.delete('/:todoId', verify, delete_todo);

export default router;