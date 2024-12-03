interface TransactionData {
    id: string;
    amount: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'BGN';
    type: 'income' | 'expense'; 
    user_id: string;  
    category_id: string;
    location?: string;
    notes?: string;
    date: Date;
}

export default TransactionData;