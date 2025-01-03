import express from 'express';
import CategoryController from '../controllers/CategoryController';

const router = express.Router();

router.post('/:userId', CategoryController.createCategory);
router.get('/:userId', CategoryController.getAllCategories);
router.get('/:categoryId', CategoryController.getCategoryById);
router.put('/users/:userId/:categoryId', CategoryController.assignCategoryToUser);
router.get('/users/:userId', CategoryController.getCategoriesByUserId);
router.put('/:categoryId', CategoryController.updateCategory);
router.delete('/:categoryId', CategoryController.deleteCategory);

export default router;