import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CategoryData from '../../../../server/src/shared/interfaces/CategoryData';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData';

interface AddTransactionToBudgetProps {
  budget: BudgetData;
  onClose: () => void;
  updateBudget: (budgetId: string, newAmountLeft: number) => void;
}

const AddTransactionToBudget: React.FC<AddTransactionToBudgetProps> = ({ budget, onClose, updateBudget }) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(budget.category_id);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [currency, setCurrency] = useState<string>('BGN');
  const [type, setType] = useState<string>('expense');
  const [location, setLocation] = useState<string>('Online');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('jwt_token');
      try {
        const response = await axios.get('http://localhost:3000/categories', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');
    const getUserIdFromToken = (): string | null => {
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.userId || null;
      }
      return null;
    };
    
    const userId = getUserIdFromToken();

    if (!selectedCategory || !userId) {
      alert("Please, choose a category");
      return;
    }

    if (!userId) {
      alert("Session expired! Log in!");
      return;
    }

    const transactionData = {
      amount,
      currency,
      type,
      category_id: selectedCategory,
      location,
      notes,
      date,
      user_id: userId
    };

    try {
      const transactionResponse = await axios.post('http://localhost:3000/transactions', transactionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Transaction added successfully:', transactionResponse.data);

      const budgetResponse = await axios.get(`http://localhost:3000/budgets/${budget.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const updatedBudget = budgetResponse.data;
      const newAmountLeft = updatedBudget.amount_left - amount;

      updateBudget(budget.id, newAmountLeft);

      alert('Expense added and budget amount updated!');

      setAmount(0);
      setDescription('');
      setSelectedCategory('');
      setCurrency('BGN');
      setType('expense');
      setLocation('Online');
      setNotes('');
      setDate(new Date().toISOString());
      onClose();
    } catch (error) {
      console.error('Error adding transaction or updating budget:', error);
      alert('Възникна грешка.');
    }
  };

  return (
    <div className="modal">
      <h2> Add Expense to Budget</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category">Choose category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            required
          >
            <option value="">--Select Category--</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="amount">Expense amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="currency">Currency:</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="BGN">BGN</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="notes">Notes:</label>
          <input
            type="text"
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date.substring(0, 10)}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit">Add Expense</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddTransactionToBudget;