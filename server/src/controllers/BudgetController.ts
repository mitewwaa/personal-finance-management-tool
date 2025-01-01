import { Request, Response } from "express";
import BudgetService from "../services/BudgetService";
import BudgetData from "../shared/interfaces/BudgetData";
import CategoryService from "../services/CategoryService";

class BudgetController {
  static async createBudget(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const budgetData: BudgetData = req.body;
      const newBudget = await BudgetService.createBudget(userId, budgetData);
      if (newBudget) {
        res.status(201).json(newBudget);
      } else {
        res.status(400).json({ message: "Failed to create budget." });
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getAllBudgets(req: Request, res: Response): Promise<void> {
    try {
      const budgets = await BudgetService.getAllBudgets();
      if (budgets) {
        res.status(200).json(budgets);
      } else {
        res.status(404).json({ message: "No budgets found." });
      }
    } catch (error) {
      console.error("Error retrieving all budgets:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getBudgetById(req: Request, res: Response): Promise<void> {
    try {
      const budgetId: string = req.params.budgetId;
      const budget = await BudgetService.getBudgetById(budgetId);
      if (budget) {
        res.status(200).json(budget);
      } else {
        res.status(404).json({ message: "Budget not found." });
      }
    } catch (error) {
      console.error("Error retrieving budget by ID:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getBudgetByCategoryId(req: Request, res: Response): Promise<void> {
    try {
      const categoryId: string = req.params.categoryId;
      const budget = await BudgetService.getBudgetByCategoryId(categoryId);
      if (budget) {
        res.status(200).json(budget);
      } else {
        res.status(404).json({ message: "Budget not found." });
      }
    } catch (error) {
      console.error("Error retrieving budget by ID:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getBudgetsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const budgets = await BudgetService.getBudgetsByUserId(userId);
      if (budgets && budgets.length > 0) {
        res.status(200).json(budgets);
      } else {
        res.status(404).json({ message: "No budgets found for this user." });
      }
    } catch (error) {
      console.error("Error retrieving budgets for user:", error);
      res.status(500).json({ message: "Internal server error." });
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
        res.status(404).json({ message: "Budget not found." });
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async deleteBudget(req: Request, res: Response): Promise<void> {
    try {
      const budgetId: string = req.params.budgetId;
      const isDeleted = await BudgetService.deleteBudget(budgetId);
      if (isDeleted) {
        res.status(200).json({ message: "Budget deleted successfully." });
      } else {
        res.status(404).json({ message: "Budget not found." });
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      res.status(500).json({ message: "Internal server error." });
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
        res.status(404).json({ message: "Budget not found." });
      }
    } catch (error) {
      console.error("Error updating budget amount left:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getBudgetInsights(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const budgets = await BudgetService.getBudgetsByUserId(userId);

      if (budgets && budgets.length > 0) {
        const insights = await Promise.all(
          budgets.map(async (budget) => {
            const totalDays = (new Date(budget.dataValues.end_date).getTime() - new Date(budget.dataValues.start_date).getTime()) / (1000 * 3600 * 24);
            const elapsedDays = (new Date().getTime() - new Date(budget.dataValues.start_date).getTime()) / (1000 * 3600 * 24);
            const remainingDays = totalDays - elapsedDays;
            const spentPercentage = ((budget.dataValues.amount - budget.dataValues.amount_left) / budget.dataValues.amount) * 100;

            const category = budget.dataValues.category_id ? await CategoryService.getCategoryById(budget.dataValues.category_id) : null;

            console.log('Category fetched:', category);

            const categoryName = category?.dataValues.name || "Без категория";

            const insight = {
              budgetId: budget.dataValues.id,
              name: budget.dataValues.name,
              category: categoryName || "Без категория",
              message: "",
            };
            
            if (spentPercentage < 100 && remainingDays <= 0) {
                insight.message = `You can reduce your budget as you spent less than planned.`;
            }
            
            if (spentPercentage >= 50 && remainingDays > 0) {
                insight.message = `You have spent ${spentPercentage.toFixed(1)}% of your budget, with ${remainingDays.toFixed(0)} days remaining. Reduce your expenses.`;
            }
            
            if (spentPercentage >= 100) {
                insight.message = `You have exceeded your budget. Try to compensate for your overspending.`;
            }
            
            if (!insight.message) {
                insight.message = `Your budget is within the expected range.`;
            }            

            console.log(insight);
            return insight;
          })
        );

        res.status(200).json(insights);
      } else {
        res.status(404).json({ message: "You have no budgets." });
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default BudgetController;
