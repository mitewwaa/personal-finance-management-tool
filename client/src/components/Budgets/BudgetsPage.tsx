import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import BudgetList from './BudgetList';
import BudgetFilter from './BudgetFilter';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData';
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData"; 
import Category from '../Categories/Category'; 
import '../../styles/Budgets.css';

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  type FilteredBudgets = {
    active: BudgetData[];
    expired: BudgetData[];
  };
  
  const [filteredBudgets, setFilteredBudgets] = useState<FilteredBudgets>({
    active: [],
    expired: [],
  });
  
  const [filterCriteria, setFilterCriteria] = useState({
    type: '',
    amount: 0,
    amountLeft: 0,
    startDate: '',
    endDate: '',
    categoryId: '',
    showExpired: false,
  });
  const [selectedBudget, setSelectedBudget] = useState<BudgetData | null>(null);

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
          const response = await axios.get(`http://localhost:3000/budgets/users/${userId}`, {
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
    const today = new Date();
    
    const handleFilterChange = budgets.map((budget) => {
      const category = categories.find((cat) => cat.id === budget.category_id);
      const categoryName = category ? category.name : 'Unknown';
      return { ...budget, category_name: categoryName };
    });
  
    const activeBudgets = handleFilterChange.filter((budget) => {
      const isExpired = new Date(budget.end_date) < today;
      const matchesExpired = filterCriteria.showExpired ? isExpired : true;
  
      return !isExpired && matchesExpired;
    });
  
    const expiredBudgets = handleFilterChange.filter((budget) => {
      const isExpired = new Date(budget.end_date) < today;
      return isExpired;
    });
  
    setFilteredBudgets({ active: activeBudgets, expired: expiredBudgets });
  }, [budgets, categories, filterCriteria]);
  
  const handleFilterChange = (criteria: typeof filterCriteria) => {
    setFilterCriteria(criteria);
  };

  const handleAddBudget = () => {
    setSelectedBudget(null); 
    navigate('/create-budget');
  };

  const handleEditBudget = (budget: BudgetData) => {
    setSelectedBudget(budget);
    navigate('/create-budget', { state: { isEdit: true, budget } });
  };
  

  const handleDeleteBudget = async (budgetId: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`http://localhost:3000/budgets/${budgetId}`, {
          headers: { Authorization: `Bearer ${userId}` },
        });
        setBudgets(budgets.filter(budget => budget.id !== budgetId));
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleCategoriesFetched = (fetchedCategories: CategoryData[]) => {
    setCategories(fetchedCategories); 
  };

  const updateBudget = (budgetId: string, newAmountLeft: number) => {
    setBudgets(prevBudgets => 
      prevBudgets.map(budget =>
        budget.id === budgetId ? { ...budget, amount_left: newAmountLeft } : budget
      )
    );
  };
  
  return (
    <div className="budgetsContainer">
      <div className="headerContainer">
        <h1 className="mainTitle">Budgets</h1>
        <button onClick={handleAddBudget} className="buttonSubmit">Add new budget</button>
      </div>
  
      <Category onCategoriesFetched={handleCategoriesFetched} />
      <BudgetFilter onChange={handleFilterChange} categories={categories} />
  
      {filteredBudgets.active && filteredBudgets.active.length > 0 && (
        <div>
          <h2 className='stateTitle'>Active Budgets</h2>
          <BudgetList
            budgets={filteredBudgets.active}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
            updateBudget={updateBudget}
          />
        </div>
      )}

      {filteredBudgets.expired && filteredBudgets.expired.length > 0 && (
        <div>
          <h2 className='stateTitle'>Expired Budgets</h2>
          <BudgetList
            budgets={filteredBudgets.expired}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
            updateBudget={updateBudget}
          />
        </div>
      )}
    </div>
  );
};

export default BudgetPage;