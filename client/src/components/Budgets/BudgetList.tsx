import React from 'react';
import BudgetItem from './BudgetItem';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData'; 

interface BudgetListProps {
  budgets: BudgetData[]; 
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