import BudgetData from '../shared/interfaces/BudgetData';
import Budget from '../models/Budget';
import Category from '../models/Category';
import User from '../models/User';


class BudgetService {

    static async createBudget(userId: string, budgetData: BudgetData): Promise<Budget | null> {
        try {
            const { name, type, amount, category_id, start_date, end_date } = budgetData;

            const user = await User.findByPk(userId);
            if (!user) {
                console.error('User not found');
                return null;
            }

            const category = await Category.findByPk(category_id);
            if (!category) {
                console.error('Category not found');
                return null;
            }

            if(amount < 0) {
                console.error('Amount should be a valid positive number')
                return null;
            }

            if(start_date >= end_date) {
                console.error('Start date of a budget can not be greater than end date')
                return null;
            }

            const newBudget = await Budget.create({
                name,
                type,
                amount,
                amount_left: amount,  // Initialize amount_left with amount when creating the budget
                user_id: userId,
                category_id: category_id,
                start_date,
                end_date,
            });

            return newBudget;
        } catch (error) {
            console.error('Error creating budget:', error);
            return null;
        }
    }

    static async getAllBudgets(): Promise<Budget[] | null> {
        try {
            const budgets = await Budget.findAll();
            return budgets;
        } catch (error) {
            console.error('Error retrieving budgets:', error);
            return null;
        }
    }

    static async getBudgetById(budgetId: string): Promise<Budget | null> {
        try {
            return await Budget.findByPk(budgetId);
        } catch (error) {
            console.error('Error getting budget by ID:', error);
            return null;
        }
    }

    static async getBudgetsByUserId(userId: string): Promise<Budget[] | null> {
        try {
            return await Budget.findAll({
                where: { user_id: userId },
                order: [['start_date', 'ASC']],  // Sort by start_date
            });
        } catch (error) {
            console.error('Error getting budgets by user ID:', error);
            return null;
        }
    }

    static async updateBudget(budgetId: string, newData: Partial<BudgetData>): Promise<Budget | null> {
        try {
            const budget = await Budget.findByPk(budgetId);
            if (budget) {
                const { amount } = newData;
                if (amount) {
                    budget.amount_left = amount;
                }
                return await budget.update({
                    ...newData,
                    amount_left: budget.amount_left
                });
            }
            return null;
        } catch (error) {
            console.error('Error updating budget:', error);
            return null;
        }
    }

    static async deleteBudget(budgetId: string): Promise<boolean> {
        try {
            const budget = await Budget.findByPk(budgetId);
            if (budget) {
                await budget.destroy();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting budget:', error);
            return false;
        }
    }

    // Update remaining amount in budget (amount_left) after a transaction
    static async updateAmountLeft(budgetId: string, amount: number): Promise<Budget | null> {
        try {
            const budget = await Budget.findByPk(budgetId);
            if (budget) {
                let amount_left: number = budget.dataValues.amount_left
                amount_left -= amount;
                if (amount_left < 0) amount_left = 0; 
                await budget.save();
                return await budget.update({
                    amount_left: amount_left
                });
            }
            return null;
        } catch (error) {
            console.error('Error updating budget amount left:', error);
            return null;
        }
    }
}

export default BudgetService;
