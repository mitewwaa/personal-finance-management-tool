import Category from "../models/Category";
import User from "../models/User";
import CategoryData from "../shared/interfaces/CategoryData";

class CategoryService {
  static async createDefaultCategories(): Promise<void> {
    try {
      const defaultCategories = [
        { name: "Salary", type: "income" },
        { name: "Investment", type: "income" },
        { name: "Business", type: "income" },
        { name: "Bonus", type: "income" },
        { name: "Food & Drink", type: "expense" },
        { name: "Utilities", type: "expense" },
        { name: "Entertainment", type: "expense" },
        { name: "Lifestyle", type: "expense" },
        { name: "Housing", type: "expense" },
        { name: "Transportation", type: "expense" },
        { name: "Taxes", type: "expense" },
        { name: "Miscellaneous", type: "expense" },
        { name: "Unknown", type: "expense" },
      ];

      for (const category of defaultCategories) {
        await Category.findOrCreate({
          where: { name: category.name, type: category.type, user_id: null },
          defaults: category,
        });
      }

      console.log("Default categories created or already exist.");
    } catch (error) {
      console.error("Error creating default categories:", error);
    }
  }

  static async createCategory(
    categoryData: Omit<CategoryData, 'id'>
  ): Promise<Category | null> {
    try {
      const { name, type, user_id } = categoryData;
  
      const newCategory = await Category.create({
        name,
        type,
        user_id,
      });
  
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      return null;
    }
  }  

  static async getDefaultCategories(): Promise<Category[]> {
    try {
      const defaultCategories = await Category.findAll({
        where: { user_id: null },
        order: [["name", "ASC"]],
      });
      return defaultCategories;
    } catch (error) {
      console.error("Error fetching default categories:", error);
      return [];
    }
  }  

  static async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      return await Category.findByPk(categoryId);
    } catch (error) {
      console.error("Error getting category by ID:", error);
      return null;
    }
  }

  static async assignCategoryToUser(userId: string, categoryId: string) {
    try {
      const user = await User.findByPk(userId);
      const category = await Category.findByPk(categoryId);

      if (!user) {
        console.log(`User with ID ${userId} not found.`);
        return null;
      }

      if (!category) {
        console.log(`Category with ID ${categoryId} not found.`);
        return null;
      }

      return await category.update({
        user_id: userId,
      });
    } catch (error) {
      console.error("Error assigning category to user:", error);
      return null;
    }
  }

  static async getCategoriesByUserId(userId: string): Promise<Category[]> {
    try {
      const categories = await Category.findAll({
        where: { user_id: userId },
        order: [["name", "ASC"]],
      });
      return categories;
    } catch (error) {
      console.error("Error getting categories by user ID:", error);
      return [];
    }
  }  

  static async getAllCategories(userId: string): Promise<Category[]> {
    try {
      const defaultCategories = await this.getDefaultCategories();
      const userCategories = await this.getCategoriesByUserId(userId);
  
      return [...defaultCategories, ...userCategories];
    } catch (error) {
      console.error("Error retrieving all categories:", error);
      return [];
    }
  }
  

  static async updateCategory(
    categoryId: string,
    newData: Partial<CategoryData>
  ): Promise<Category | null> {
    try {
      const category = await Category.findByPk(categoryId);
      if (category) {
        return await category.update({
          name: newData.name,
          type: newData.type,
        });
      }
      return null;
    } catch (error) {
      console.error("Error updating category:", error);
      return null;
    }
  }

  static async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const category = await Category.findByPk(categoryId);
      if (category) {
        await category.destroy();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  }
}

export default CategoryService;
