import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import CategoryRoutes from './routes/CategoryRoutes';
import BudgetRoutes from './routes/BudgetRoutes';
import UserRoutes from './routes/UserRoutes';
import TransactionRoutes from './routes/TransactionRoutes';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


app.use('/categories', CategoryRoutes);  
app.use('/budgets', BudgetRoutes);      
app.use('/users', UserRoutes);      
app.use('/transactions', TransactionRoutes); 

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Personal Finance Management Tool API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
