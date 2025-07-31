import { Router } from 'express';
import verify from '../middlewares/auth.js';
import { signup, login, delete_user, get_users, get_user, forget_password, reset_password } from '../controllers/users_controller.js';
const router = Router();

router.post('/register', signup);

router.post('/login', login);

router.post('/forget-password', forget_password);

router.post('/reset-password', reset_password);

router.delete('/:userId', verify, delete_user);

router.get('/list', verify, get_users);

router.get('/profile', verify, get_user);

export default router;