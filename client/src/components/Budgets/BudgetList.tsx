import React from 'react';
import BudgetItem from './BudgetItem';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData';

interface BudgetListProps {
  budgets: BudgetData[];
  onEdit: (budget: BudgetData) => void;
  onDelete: (budgetId: string) => Promise<void>;
  updateBudget: (budgetId: string, newAmountLeft: number) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onEdit, onDelete, updateBudget }) => {
  return (
    <ul className="budgetList">
      {budgets.map((budget) => (
        <BudgetItem
          key={budget.id}
          budget={budget}
          onEdit={onEdit}
          onDelete={onDelete}
          updateBudget={updateBudget}
        />
      ))}
    </ul>
  );
};

export default BudgetList;