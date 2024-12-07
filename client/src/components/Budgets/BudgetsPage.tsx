import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BudgetList from './BudgetList';
import BudgetFilter from './BudgetFilter';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData';
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData"; 
import Category from '../Categories/Category'; 

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<BudgetData[]>([]);
  const [filterCriteria, setFilterCriteria] = useState({
    type: '',
    amount: 0,
    amountLeft: 0,
    startDate: '',
    endDate: '',
    categoryId: '',
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
          const response = await axios.get('http://localhost:3000/budgets/', {
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
    const filtered = budgets.map((budget) => {
      const category = categories.find(cat => cat.id === budget.category_id);
      const categoryName = category ? category.name : 'Unknown';
      return { ...budget, category_name: categoryName };
    }).filter((budget) => {
      const matchesType = filterCriteria.type ? budget.type === filterCriteria.type : true;
      const matchesAmount = filterCriteria.amount ? budget.amount === filterCriteria.amount : true;
      const matchesAmountLeft = filterCriteria.amountLeft ? budget.amount_left === filterCriteria.amountLeft : true;

      const getLocalDateString = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
      };

      const matchesStartDate = filterCriteria.startDate
        ? getLocalDateString(budget.start_date.toString()) >= filterCriteria.startDate
        : true;

      const matchesEndDate = filterCriteria.endDate
        ? getLocalDateString(budget.end_date.toString()) <= filterCriteria.endDate
        : true;

      const matchesCategory = filterCriteria.categoryId 
        ? budget.category_id === filterCriteria.categoryId 
        : true;

      return matchesType && matchesAmount && matchesAmountLeft && matchesStartDate && matchesEndDate && matchesCategory;
    });
    setFilteredBudgets(filtered);
  }, [budgets, categories, filterCriteria]);

  const handleFilterChange = (criteria: typeof filterCriteria) => {
    setFilterCriteria(criteria);
  };

  const handleAddBudget = () => {
    navigate('/create-budget');
  };

  const handleCategoriesFetched = (fetchedCategories: CategoryData[]) => {
    setCategories(fetchedCategories); 
  };

  return (
    <div className="budgetsContainer">
      <h1 className="mainTitle">Budgets</h1>
      <button onClick={handleAddBudget}>Add new budget</button>
      <Category onCategoriesFetched={handleCategoriesFetched} />
      <BudgetFilter 
        onChange={handleFilterChange} 
        categories={categories} 
      />
      <BudgetList budgets={filteredBudgets} />
    </div>
  );
};

export default BudgetPage;