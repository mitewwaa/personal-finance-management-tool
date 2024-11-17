import { sequelize } from '../database';
import User from './User';
import Transaction from './Transaction';
import Category from './Category';
import Budget from './Budget';

User.hasMany(Transaction, {
    foreignKey: 'user_id',
    as: 'transactions',
});

User.hasMany(Budget, {
    foreignKey: 'user_id',
    as: 'budgets',
});

User.hasMany(Category, {
    foreignKey: 'user_id',
    as: 'categories',
});

Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

Transaction.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
});

Category.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

Budget.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
});

Budget.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category',
});

export { sequelize, User, Transaction, Category, Budget };

