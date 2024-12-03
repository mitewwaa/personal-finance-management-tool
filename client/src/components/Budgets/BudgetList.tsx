import React from 'react';
import BudgetItem from './BudgetItem';

interface Budget {
  id: string;
  name: string;
  type: 'goal' | 'category_limit';
  amount: number;
  amount_left: number;
  start_date: string;
  end_date: string;
}

interface BudgetListProps {
  budgets: Budget[];
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets }) => {
  if (budgets.length === 0) {
    return <p>You don't have budgets.</p>;
  }

  return (
    <ul className='budgetList'>
      {budgets.map((budget) => (
        <BudgetItem key={budget.id} budget={budget} />
      ))}
    </ul>
  );
};

export default BudgetList;
