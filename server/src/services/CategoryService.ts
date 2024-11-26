import Category from "../models/Category";
import User from "../models/User";
import CategoryData from "../shared/interfaces/CategoryData";

class CategoryService {
  static async createCategory(
    categoryData: CategoryData
  ): Promise<Category | null> {
    try {
      const { name, type } = categoryData;

      const newCategory = await Category.create({
        name,
        type,
      });

      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      return null;
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

  static async getCategoriesByUserId(
    userId: string
  ): Promise<Category[] | null> {
    try {
      const categories = await Category.findAll({
        where: { user_id: userId },
        order: [["name", "ASC"]], // Sort alphabetically by name
      });
      return categories;
    } catch (error) {
      console.error("Error getting categories by user ID:", error);
      return null;
    }
  }

  static async getAllCategories(): Promise<Category[] | null> {
    try {
        const categories = await Category.findAll();
        return categories;
    } catch (error) {
        console.error('Error fetching all categories:', error);
        return null;
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
