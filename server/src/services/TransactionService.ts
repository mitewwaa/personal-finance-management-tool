import { Op } from 'sequelize';
import Transaction from '../models/Transaction';
import User from '../models/User';
import TransactionData from '../shared/interfaces/TransactionData';
import Category from '../models/Category';

class TransactionService {

    static async createTransaction(transactionData: Partial<TransactionData>, user_id: string): Promise<Transaction | null> {
        try {
            const { amount, currency, type, category_id, location, notes, date } = transactionData;
            const user = await User.findByPk(user_id);
            if (!user) {
                console.error('User not found');
                return null;
            }

            const category = await Category.findByPk(category_id);
            if (!category) {
                console.error('Category not found');
                return null;
            }

            if (amount && amount < 0) {
                console.error('Amount should be a valid positive number')
                return null;
            }

            const newTransaction = await Transaction.create({
                amount,
                currency,
                type,
                user_id: user_id,
                category_id: category_id,
                location,
                notes,
                date,
            });

            return newTransaction;
        } catch (error) {
            console.error('Error creating transaction:', error);
            return null;
        }
    }

    static async getTransactionById(transactionId: string): Promise<Transaction | null> {
        try {
            return await Transaction.findByPk(transactionId);
        } catch (error) {
            console.error('Error getting transaction by ID:', error);
            return null;
        }
    }

    static async getTransactionsByUserId(userId: string): Promise<Transaction[] | null> {
        try {
            const transactions = await Transaction.findAll({
                where: { user_id: userId },
                order: [['date', 'DESC']]  // Sort by date, most recent first
            });
            return transactions;
        } catch (error) {
            console.error('Error getting transactions by user ID:', error);
            return null;
        }
    }

    static async getTransactionsByCategory(categoryId: string): Promise<Transaction[] | null> {
        try {
            const transactions = await Transaction.findAll({
                where: { category_id: categoryId },
                order: [['date', 'DESC']] 
            });
            return transactions;
        } catch (error) {
            console.error('Error getting transactions by category:', error);
            return null;
        }
    }

    static async updateTransaction(transactionId: string, newData: Partial<TransactionData>): Promise<Transaction | null> {
        const { amount } = newData;
        try {
            const transaction = await Transaction.findByPk(transactionId);
            if (transaction) {
                if (amount && amount < 0) {
                    throw new Error('Amount should be a valid positive number')
                }
                return await transaction.update(newData);
            }
            return null;
        } catch (error) {
            console.error('Error updating transaction:', error);
            return null;
        }
    }

    static async deleteTransaction(transactionId: string): Promise<boolean> {
        try {
            const transaction = await Transaction.findByPk(transactionId);
            if (transaction) {
                await transaction.destroy();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting transaction:', error);
            return false;
        }
    }

    static async getAllTransactions(): Promise<Transaction[] | null> {
        try {
            return await Transaction.findAll({
                order: [['date', 'DESC']]
            });
        } catch (error) {
            console.error('Error getting all transactions:', error);
            return null;
        }
    }

    static async getTransactionsByDateRange(startDate: Date, endDate: Date): Promise<Transaction[] | null> {
        console.log(startDate, endDate);
        try {
            return await Transaction.findAll({
                where: {
                    date: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                order: [['date', 'DESC']] 
            });
        } catch (error) {
            console.error('Error getting transactions by date range:', error);
            return null;
        }
    }
}

export default TransactionService;
