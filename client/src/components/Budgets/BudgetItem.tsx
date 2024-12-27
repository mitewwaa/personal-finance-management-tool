import React, { useState } from 'react';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData';
import AddTransactionToBudget from './AddTransactionToBudget';
import { CiEdit } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

interface BudgetItemProps {
  budget: BudgetData;
  onEdit: (budget: BudgetData) => void;
  onDelete: (budgetId: string) => Promise<void>;
  updateBudget: (budgetId: string, newAmountLeft: number) => void;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ budget, onEdit, onDelete, updateBudget }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isExpired = new Date(budget.end_date) < new Date();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const getBudgetTypeText = (type: string) => {
    switch (type) {
      case 'goal':
        return 'Goal';
      case 'category_limit':
        return 'Category limit';
      default:
        return 'Unknown';
    }
  };

  const calculateProgress = () => {
    const usedAmount = budget.amount - budget.amount_left;
    return (usedAmount / budget.amount) * 100;
  };

  const progress = calculateProgress();

  return (
    <li className={`budgetItem ${isExpired ? 'expired' : ''}`}>
      <h3 className="budgetName">{budget.name}</h3>
      <div className="budgetInfo">
        <p className="budgetType">Type: {getBudgetTypeText(budget.type)}</p>
        <p className="categoryName">Category: {budget.category_name}</p>
      </div>
      <div className="progressBarContainer">
        <div className="progressBar">
          <div
            className="progressBarFill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className='txt'>{progress.toFixed(2)}% used</p>
      </div>
      <div className="amountContainer">
        <p className="amount">Amount: {budget.amount}</p>
        <p className="amount">Amount left: {budget.amount_left}</p>
      </div>
      <div className="dateContainer">
        <p className="budgetDate">Start Date: {new Date(budget.start_date).toLocaleDateString()}</p>
        <p className="budgetDate">End Date: {new Date(budget.end_date).toLocaleDateString()}</p>
      </div>
      <div className="buttonsContainer">
        <button onClick={() => onDelete(budget.id)} className="deleteBtn btn">
          <MdDelete className="btnIcon" />
          <p className="text">Delete</p>
        </button>
        <button onClick={() => onEdit(budget)} className="editBtn btn">
          <CiEdit className="btnIcon" /> Edit
        </button>
        <button onClick={toggleModal} className="expenseBtn btn">
          <FaPlus className="btnIcon" /> Add Expense
        </button>
      </div>

      <AddTransactionToBudget
        budget={budget}
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        updateBudget={updateBudget}
      />
    </li>
  );
};

export default BudgetItem;