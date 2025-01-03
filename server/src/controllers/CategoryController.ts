import { Request, Response } from "express";
import CategoryService from "../services/CategoryService";
import CategoryData from "../shared/interfaces/CategoryData";
import Category from "../models/Category";

class CategoryController {
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, type } = req.body;
      const userId: string = req.params.userId;
  
      if (!userId) {
        res.status(401).json({ message: "You are not authenticated." });
        return;
      }
  
      if (!name || !type) {
        res.status(400).json({ message: "Name and type are required." });
        return;
      }
  
      const categoryData = {
        name,
        type,
        user_id: userId,
      };
  
      const newCategory = await CategoryService.createCategory(categoryData);
  
      if (newCategory) {
        res.status(201).json(newCategory);
      } else {
        res.status(400).json({ message: "Category creation failed." });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Server error." });
    }
  }  

  static async assignCategoryToUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const categoryId: string = req.params.categoryId;
      const newUserCategory = await CategoryService.assignCategoryToUser(
        userId,
        categoryId
      );
      if (newUserCategory) {
        res.status(200).json(newUserCategory);
      } else {
        res.status(400).json({ message: "Failed to assign category to user." });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getDefaultCategories(req: Request, res: Response): Promise<void> {
    try {
      const defaultCategories = await CategoryService.getDefaultCategories();
      if (defaultCategories && defaultCategories.length > 0) {
        res.status(200).json(defaultCategories);
      } else {
        res.status(404).json({ message: "No default categories found." });
      }
    } catch (error) {
      console.error("Error retrieving default categories:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getCategoriesByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.params.userId;
      const userCategories = await CategoryService.getCategoriesByUserId(userId);
  
      if (userCategories) {
        res.status(200).json(userCategories);
      } else {
        res.status(404).json({ message: "No user categories found." });
      }
    } catch (error) {
      console.error("Error retrieving user categories:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const categoryId: string = req.params.categoryId;
      console.log(categoryId);
      const category = await CategoryService.getCategoryById(categoryId);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: "Category not found." });
      }
    } catch (error) {
      console.error("Error retrieving category by ID:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      console.log("Headers received:", req.headers.authorization);
    console.log("User ID from params:", req.params.userId);
    
      const userId: string = req.params.userId;
  
      if (!userId) {
        res.status(401).json({ message: "You are not authenticated." });
        return;
      }
  
      const defaultCategories = await CategoryService.getDefaultCategories();
      const userCategories = await CategoryService.getCategoriesByUserId(userId);
  
      const allCategories = [...defaultCategories, ...userCategories];
  
      if (allCategories.length > 0) {
        res.status(200).json(allCategories);
      } else {
        res.status(404).json({ message: "No categories found." });
      }
    } catch (error) {
      console.error("Error retrieving categories:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId: string = req.params.categoryId;
      const categoryData: Partial<CategoryData> = req.body;
      const updatedCategory = await CategoryService.updateCategory(
        categoryId,
        categoryData
      );
      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: "Category not found." });
      }
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId: string = req.params.categoryId;
      const isDeleted = await CategoryService.deleteCategory(categoryId);
      if (isDeleted) {
        res.status(200).json({ message: "Category deleted successfully." });
      } else {
        res.status(404).json({ message: "There is a budget associated with this category or the category was not found." });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
}

export default CategoryController;
