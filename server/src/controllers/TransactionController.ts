import { Request, Response } from 'express';
import TransactionService from '../services/TransactionService';
import TransactionData from '../shared/interfaces/TransactionData';
import User from '../models/User';

class TransactionController {

    static async createTransaction(req: Request, res: Response): Promise<void> {
        try {
            const { amount, currency, type, category_id, location, notes, date } = req.body;
            const userId = req.body.user_id; 
    
            if (!userId) {
                res.status(400).json({ message: "User ID not found." });
                return;
            }
    
            const transaction = await TransactionService.createTransaction({ amount, currency, type, category_id, location, notes, date }, userId);
    
            res.status(201).json({ message: "Transaction created successfully", transaction });
        } catch (error) {
            console.error("Error occurred while creating transaction:", error);
            res.status(500).json({ message: "Error creating transaction" });
        }
    }

    static async getTransactionById(req: Request, res: Response): Promise<void> {
        try {
            const transaction = await TransactionService.getTransactionById(req.params.transactionId);
            if (transaction) {
                res.status(200).json(transaction);
            } else {
                res.status(404).json({ message: 'Transaction not found.' });
            }
        } catch (error) {
            console.error('Error retrieving transaction:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async getTransactionsByUserId(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.params.userId);
            const transactions = await TransactionService.getTransactionsByUserId(req.params.userId);
            if (transactions) {
                res.status(200).json(transactions);
            } else {
                res.status(404).json({ message: 'No transactions found for this user.' });
            }
        } catch (error) {
            console.error('Error retrieving transactions for user:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async getTransactionsByCategory(req: Request, res: Response): Promise<void> {
        try {
            const transactions = await TransactionService.getTransactionsByCategory(req.params.categoryId);
            if (transactions) {
                res.status(200).json(transactions);
            } else {
                res.status(404).json({ message: 'No transactions found for this category.' });
            }
        } catch (error) {
            console.error('Error retrieving transactions by category:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async updateTransaction(req: Request, res: Response): Promise<void> {
        try {
            const transactionId: string = req.params.transactionId;
            const transactionData: Partial<TransactionData> = req.body;
            const updatedTransaction = await TransactionService.updateTransaction(transactionId, transactionData);
            if (updatedTransaction) {
                res.status(200).json(updatedTransaction);
            } else {
                res.status(404).json({ message: 'Transaction not found.' });
            }
        } catch (error) {
            console.error('Error updating transaction:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async deleteTransaction(req: Request, res: Response): Promise<void> {
        try {
            const isDeleted = await TransactionService.deleteTransaction(req.params.transactionId);
            if (isDeleted) {
                res.status(200).json({ message: 'Transaction deleted successfully' });
            } else {
                res.status(404).json({ message: 'Transaction not found.' });
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    static async getAllTransactions(req: Request, res: Response): Promise<void> {
        try {
            const transactions = await TransactionService.getAllTransactions();
            if (transactions) {
                res.status(200).json(transactions);
            } else {
                res.status(404).json({ message: 'No transactions found.' });
            }
        } catch (error) {
            console.error('Error retrieving transactions:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }

    // Should send the date range as query parameters like: /transactions/date-range?startDate=2024-01-01&endDate=2024-12-31
    static async getTransactionsByDateRange(req: Request, res: Response): Promise<void> {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            res.status(400).json({ message: 'Missing startDate or endDate in query parameters' });
        }
        try {
            const transactions = await TransactionService.getTransactionsByDateRange(new Date(startDate as string), new Date(endDate as string));
            if (transactions) {
                res.status(200).json(transactions);
            } else {
                res.status(404).json({ message: 'No transactions found for the given date range.' });
            }
        } catch (error) {
            console.error('Error retrieving transactions by date range:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
}

export default TransactionController;
