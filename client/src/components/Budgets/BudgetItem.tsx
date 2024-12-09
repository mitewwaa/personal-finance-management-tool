import React from 'react';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData'; 

interface BudgetItemProps {
  budget: BudgetData;
  onEdit: (budget: BudgetData) => void;
  onDelete: (budgetId: string) => Promise<void>;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ budget, onEdit, onDelete }) => {
  return (
    <li className="budgetItem">
      <h3 className="budgetName">{budget.name}</h3>
      <p className="budgetType">Type: {budget.type}</p>
      <p className="categoryName">Category: {budget.category_name}</p>
      <div className="amountContainer">
        <p className="amount">Amount: {budget.amount}</p>
        <p className="amount">Amount left: {budget.amount_left}</p>
      </div>
      <div className="dateContainer">
        <p className="date">Start Date: {new Date(budget.start_date).toLocaleDateString()}</p>
        <p className="date">End Date: {new Date(budget.end_date).toLocaleDateString()}</p>
      </div>
      <button onClick={() => onEdit(budget)}>Edit</button>
      <button onClick={() => onDelete(budget.id)}>Delete</button>
    </li>
  );
};

export default BudgetItem;