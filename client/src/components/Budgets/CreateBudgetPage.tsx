import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Category from '../Categories/Category'; 

import '../../styles/Budgets.css';

const CreateBudgetPage: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'goal' | 'category_limit'>('goal');
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.userId || null;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return null;
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    if (!userId) {
      setError('You are not logged in!');
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleCreateBudget = async () => {
    if (!userId) {
      setError('You are not logged in!');
      return;
    }

    if (!name || !type || !amount || !categoryId || !startDate || !endDate) {
      setError('Please fill all the fields');
      return;
    }

    const budgetData = {
      name,
      type,
      amount,
      category_id: categoryId,
      start_date: new Date(startDate).toISOString(),
      end_date: new Date(endDate).toISOString(),
    };

    try {
      const response = await axios.post(`http://localhost:3000/budgets/users/${userId}`, budgetData,{
        headers: { Authorization: `Bearer ${userId}` },
      });
      
      if (response.status === 201) {
        navigate('/budgets');
      }
    } catch (error: any) {
      console.error('Error creating budget:', error);
      setError('Something went wrong when creating budget.');
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  return (
    <div className="budgetsContainer">
      <h1>Add new budget</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'goal' | 'category_limit')}
          >
            <option value="goal">Goal</option>
            <option value="category_limit">Category limit</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endDate">End Date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleCreateBudget}>
          Create Budget
        </button>
      </form>
      <Category onCategoriesFetched={setCategories} />
    </div>
  );
};

export default CreateBudgetPage;
