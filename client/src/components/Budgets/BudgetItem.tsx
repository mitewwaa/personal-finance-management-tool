import React from 'react';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData'; 

interface BudgetItemProps {
  budget: BudgetData; 
}

const BudgetItem: React.FC<BudgetItemProps> = ({ budget }) => {
  return (
    <li className='budgetItem'>
      <h3 className='budgetName'>{budget.name}</h3>
      <p className='budgetType'>Type: {budget.type}</p>
      <div className='amountContainer'>
        <p className='amount'>Amount: {budget.amount}</p>
        <p className='amount'>Amount left: {budget.amount_left}</p>
      </div>
      
      <div className='dateContainer'>
        <p className='date'>Start Date: {new Date(budget.start_date).toLocaleDateString()}</p>
        <p className='date'>End Date: {new Date(budget.end_date).toLocaleDateString()}</p> 
      </div>
    </li>
  );
};

export default BudgetItem;