import { Request, Response } from 'express';
import BudgetService from '../services/BudgetService';
import BudgetData from '../interfaces/BudgetData';

class BudgetController {

    static async createBudget(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.params.userId;
            const budgetData: BudgetData = req.body;
            const newBudget = await BudgetService.createBudget(userId, budgetData);
            if (newBudget) {
                res.status(201).json(newBudget);
            } else {
                res.status(400).json({ message: 'Failed to create budget.' });
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async getAllBudgets(req: Request, res: Response): Promise<void> {
        try {
            const budgets = await BudgetService.getAllBudgets();
            if (budgets) {
                res.status(200).json(budgets);
            } else {
                res.status(404).json({ message: 'No budgets found.' });
            }
        } catch (error) {
            console.error('Error retrieving all budgets:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async getBudgetById(req: Request, res: Response): Promise<void> {
        try {
            const budgetId: string = req.params.budgetId;
            const budget = await BudgetService.getBudgetById(budgetId);
            if (budget) {
                res.status(200).json(budget);
            } else {
                res.status(404).json({ message: 'Budget not found.' });
            }
        } catch (error) {
            console.error('Error retrieving budget by ID:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async getBudgetsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.params.userId;
            const budgets = await BudgetService.getBudgetsByUserId(userId);
            if (budgets && budgets.length > 0) {
                res.status(200).json(budgets);
            } else {
                res.status(404).json({ message: 'No budgets found for this user.' });
            }
        } catch (error) {
            console.error('Error retrieving budgets for user:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async updateBudget(req: Request, res: Response): Promise<void> {
        try {
            const budgetId: string = req.params.budgetId;
            console.log(budgetId);
            const newData: Partial<BudgetData> = req.body;
            const updatedBudget = await BudgetService.updateBudget(budgetId, newData);
            if (updatedBudget) {
                res.status(200).json(updatedBudget);
            } else {
                res.status(404).json({ message: 'Budget not found.' });
            }
        } catch (error) {
            console.error('Error updating budget:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async deleteBudget(req: Request, res: Response): Promise<void> {
        try {
            const budgetId: string = req.params.budgetId;
            const isDeleted = await BudgetService.deleteBudget(budgetId);
            if (isDeleted) {
                res.status(200).json({ message: 'Budget deleted successfully.' });
            } else {
                res.status(404).json({ message: 'Budget not found.' });
            }
        } catch (error) {
            console.error('Error deleting budget:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async updateAmountLeft(req: Request, res: Response): Promise<void> {
        try {
            const budgetId: string = req.params.budgetId;
            const { amount } = req.body;
            console.log(amount);
            const updatedBudget = await BudgetService.updateAmountLeft(budgetId, amount);
            if (updatedBudget) {
                res.status(200).json(updatedBudget);
            } else {
                res.status(404).json({ message: 'Budget not found.' });
            }
        } catch (error) {
            console.error('Error updating budget amount left:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
}

export default BudgetController;
