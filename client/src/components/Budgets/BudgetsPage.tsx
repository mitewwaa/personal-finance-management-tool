import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface Budget {
  id: string;
  name: string;
  type: 'goal' | 'category_limit';
  amount: number;
  amount_left: number;
  start_date: string;
  end_date: string;
}

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const navigate = useNavigate();

  const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decoded: any = jwtDecode(token); 
      return decoded.userId || null;
    }
    return null;
  };

  const userId = getUserIdFromToken();

  // Render all budgets
  useEffect(() => {
    if (userId) {
      const fetchBudgets = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/budgets/`);
          setBudgets(response.data);
          console.log('Fetched budgets:', budgets);

        } catch (error) {
          console.error('Error fetching budgets:', error);
        }
      };
      fetchBudgets();
    }
  }, [userId]);

  const handleAddBudget = () => {
    navigate('/create-budget');
  };

  return (
    <div>
      <h1>Budgets</h1>
      <button onClick={handleAddBudget}>Add new budget</button>
      <div>
        {budgets.length > 0 ? (
          <ul>
            {budgets.map((budget) => (
              <li key={budget.id}>
                <h3>{budget.name}</h3>
                <p>Type: {budget.type}</p>
                <p>Amount: {budget.amount}</p>
                <p>Amount left: {budget.amount_left}</p>
                <p>Start Date: {new Date(budget.start_date).toLocaleDateString()}</p>
                <p>End Date: {new Date(budget.end_date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You don't have budgets.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
