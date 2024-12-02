import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';

interface BudgetFilterProps {
  onChange: (criteria: { type: string; amount: number; amountLeft: number; startDate: string; endDate: string }) => void;
}

const BudgetFilter: React.FC<BudgetFilterProps> = ({ onChange }) => {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState<string>('0');
  const [amountLeft, setAmountLeft] = useState<string>('0');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    onChange({
      type,
      amount: parseFloat(amount) || 0,
      amountLeft: parseFloat(amountLeft) || 0,
      startDate,
      endDate
    });
  }, [type, amount, amountLeft, startDate, endDate, onChange]);

  return (
    <div className="budgetFilter">
      <FaFilter className="filterIcon" />
      <label className='filterLabel'>
        Type
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="goal">Goal</option>
          <option value="category_limit">Category Limit</option>
        </select>
      </label>

      <label className='filterLabel'>
        Amount
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label className='filterLabel'>
        Amount Left
        <input
          type="number"
          value={amountLeft}
          onChange={(e) => setAmountLeft(e.target.value)}
        />
      </label>

      <label className='filterLabel'>
        Start Date
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      <label className='filterLabel'>
        End Date
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
    </div>
  );
};

export default BudgetFilter;