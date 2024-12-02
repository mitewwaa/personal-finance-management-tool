import React, { useState, useEffect } from 'react';

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
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="goal">Goal</option>
          <option value="category_limit">Category Limit</option>
        </select>
      </label>

      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <label>
        Amount Left:
        <input
          type="number"
          value={amountLeft}
          onChange={(e) => setAmountLeft(e.target.value)}
        />
      </label>

      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>

      <label>
        End Date:
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