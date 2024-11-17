import { Router } from 'express';
import BudgetController from '../controllers/BudgetController';

const router = Router();

router.post('/users/:userId', BudgetController.createBudget);
router.get('/', BudgetController.getAllBudgets);
router.get('/:budgetId', BudgetController.getBudgetById);
router.get('/users/:userId', BudgetController.getBudgetsByUserId);
router.put('/:budgetId/amount', BudgetController.updateAmountLeft);
router.put('/:budgetId', BudgetController.updateBudget);
router.delete('/:budgetId', BudgetController.deleteBudget);



export default router;
