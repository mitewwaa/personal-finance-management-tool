interface TransactionData {
    name: string;
    amount: number;
    type: 'income' | 'expense'; 
    user_id: string;  
    category_id: string;
    location?: string;
    notes?: string;
    date: Date;
}

export default TransactionData;