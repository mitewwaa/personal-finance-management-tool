import express from 'express';
import UserController from '../controllers/UserController';

const router = express.Router();

router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUser);
router.delete('/:userId', UserController.deleteUser);
router.post('/login', UserController.loginUser);

export default router;
