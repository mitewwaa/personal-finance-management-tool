import React from 'react';
import BudgetItem from './BudgetItem';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData';

interface BudgetListProps {
  budgets: BudgetData[];
  onEdit: (budget: BudgetData) => void;
  onDelete: (budgetId: string) => Promise<void>;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onEdit, onDelete }) => {
  return (
    <ul className="budgetList">
      {budgets.map((budget) => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default BudgetList;