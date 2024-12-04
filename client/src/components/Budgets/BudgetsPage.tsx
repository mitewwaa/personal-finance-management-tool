import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import BudgetList from './BudgetList';
import BudgetFilter from './BudgetFilter';

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
  const [filteredBudgets, setFilteredBudgets] = useState<Budget[]>([]);
  const [filterCriteria, setFilterCriteria] = useState({
    type: '',
    amount: 0,
    amountLeft: 0,
    startDate: '',
    endDate: ''
  });

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

  useEffect(() => {
    if (userId) {
      const fetchBudgets = async () => {
        try {
          const response = await axios.get('http://localhost:3000/budgets/',{
            headers: { Authorization: `Bearer ${userId}` },
        });
          setBudgets(response.data);
          setFilteredBudgets(response.data);
        } catch (error) {
          console.error('Error fetching budgets:', error);
        }
      };
      fetchBudgets();
    }
  }, [userId]);

  useEffect(() => {
    const filtered = budgets.filter((budget) => {
      const matchesType = filterCriteria.type ? budget.type === filterCriteria.type : true;
      const matchesAmount = filterCriteria.amount ? budget.amount === filterCriteria.amount : true;
      const matchesAmountLeft = filterCriteria.amountLeft ? budget.amount_left === filterCriteria.amountLeft : true;

      const getLocalDateString = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA'); // Формат YYYY-MM-DD
      };

      const matchesStartDate = filterCriteria.startDate
        ? getLocalDateString(budget.start_date) >= filterCriteria.startDate
        : true;

      const matchesEndDate = filterCriteria.endDate
        ? getLocalDateString(budget.end_date) <= filterCriteria.endDate
        : true;

      return matchesType && matchesAmount && matchesAmountLeft && matchesStartDate && matchesEndDate;
    });
    setFilteredBudgets(filtered);
  }, [budgets, filterCriteria]);

  const handleFilterChange = (criteria: typeof filterCriteria) => {
    setFilterCriteria(criteria);
  };

  const handleAddBudget = () => {
    navigate('/create-budget');
  };

  return (
    <div className="budgetsContainer">
      <h1 className="mainTitle">Budgets</h1>
      <button onClick={handleAddBudget}>Add new budget</button>
      <BudgetFilter onChange={handleFilterChange} />
      <BudgetList budgets={filteredBudgets} />
    </div>
  );
};

export default BudgetPage;