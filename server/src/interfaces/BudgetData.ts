interface BudgetData {
    name: string;
    type: 'goal' | 'category_limit';
    amount: number;
    amount_left: number;
    user_id: string;
    category_id: string;
    start_date: Date;
    end_date: Date;
  }

  export default BudgetData;