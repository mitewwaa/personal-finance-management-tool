interface TransactionData {
    id: string;
    amount: number;
    currency: string;
    type: 'income' | 'expense'; 
    user_id: string;  
    category_id: string;
    location?: string;
    notes?: string;
    date: Date;
}

export default TransactionData;