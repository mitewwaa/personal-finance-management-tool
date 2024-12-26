import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";

interface BudgetFilterProps {
  onChange: (criteria: { 
    type: string; 
    amount: number; 
    amountLeft: number; 
    startDate: string; 
    endDate: string; 
    categoryId: string; 
  }) => void;
  categories: CategoryData[];
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ onChange, categories }) => {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState<string>('0');
  const [amountLeft, setAmountLeft] = useState<string>('0');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  const handleFilterChange = () => {
    onChange({
      type,
      amount: parseFloat(amount) || 0,
      amountLeft: parseFloat(amountLeft) || 0,
      startDate,
      endDate,
      categoryId,
    });
  };

  useEffect(() => {
    handleFilterChange();
  }, [type, amount, amountLeft, startDate, endDate, categoryId]);

  return (
    <div className="budgetFilter">
      <div className='budgetFilterContainer'>
        <FaFilter className="filterIcon" />
        <div className='filters'>
          <div className="filterLabel">
            <label className="budgetFilterLabel">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All</option>
                <option value="goal">Goal</option>
                <option value="category_limit">Category Limit</option>
            </select>
          </div>
         <div className="filterLabel">
            <label className="budgetFilterLabel">Amount</label>
            <input type="number"value={amount} onChange={(e) => setAmount(e.target.value)}/>
         </div>
         <div className="filterLabel">
            <label className="budgetFilterLabel">Amount Left</label>
            <input type="number" value={amountLeft} onChange={(e) => setAmountLeft(e.target.value)}/>
         </div>
          <div className="filterLabel">
            <label className="budgetFilterLabel">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
          </div>
          <div className="filterLabel">
            <label className="budgetFilterLabel">End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
          </div>
          <div className="filterLabel">
            <label className="budgetFilterLabel">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">All</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default BudgetFilter;