import { Router } from 'express';
import TransactionController from '../controllers/TransactionController';

const router = Router();

router.post('/', TransactionController.createTransaction);
router.get('/', TransactionController.getAllTransactions);
router.get('/users/:userId', TransactionController.getTransactionsByUserId);
router.get('/categories/:categoryId', TransactionController.getTransactionsByCategory);
router.put('/:transactionId', TransactionController.updateTransaction);
router.delete('/:transactionId', TransactionController.deleteTransaction);
router.get('/date-range', TransactionController.getTransactionsByDateRange);
router.get('/:transactionId', TransactionController.getTransactionById);

export default router;

