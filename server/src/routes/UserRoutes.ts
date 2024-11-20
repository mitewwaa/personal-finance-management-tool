import express from 'express';
import UserController from '../controllers/UserController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);
router.post('/login', UserController.loginUser);
router.get("/:userId", authenticateToken, UserController.getUserById);

export default router;
