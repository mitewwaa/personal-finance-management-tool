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
  
    // Подготвяме бюджетите с имената на категориите
    const updatedBudgets = budgets.map((budget) => {
      const category = categories.find((cat) => cat.id === budget.category_id);
      const categoryName = category ? category.name : 'Unknown';
      return { ...budget, category_name: categoryName };
    });
  
    // Филтрираме активните бюджети
    const filteredActiveBudgets = updatedBudgets.filter((budget) => {
      const isExpired = new Date(budget.end_date) < today;
      const budgetStartDate = new Date(budget.start_date).setHours(0, 0, 0, 0);
      const budgetEndDate = new Date(budget.end_date).setHours(0, 0, 0, 0);
      const filterStartDate = filterCriteria.startDate ? new Date(filterCriteria.startDate).setHours(0, 0, 0, 0) : '';
      const filterEndDate = filterCriteria.endDate ? new Date(filterCriteria.endDate).setHours(0, 0, 0, 0) : '';
  
      return (
        (filterCriteria.type === '' || budget.type === filterCriteria.type) &&
        (filterCriteria.amount === 0 || budget.amount === filterCriteria.amount) &&
        (filterCriteria.amountLeft === 0 || budget.amount_left === filterCriteria.amountLeft) &&
        (filterStartDate === '' || budgetStartDate === filterStartDate) &&
        (filterEndDate === '' || budgetEndDate === filterEndDate) &&
        (filterCriteria.categoryId === '' || budget.category_id === filterCriteria.categoryId) &&
        !isExpired // Активни бюджети
      );
    });
  
    // Филтрираме изтеклите бюджети
    const filteredExpiredBudgets = updatedBudgets.filter((budget) => {
      const isExpired = new Date(budget.end_date) < today;
      const budgetStartDate = new Date(budget.start_date).setHours(0, 0, 0, 0);
      const budgetEndDate = new Date(budget.end_date).setHours(0, 0, 0, 0);
      const filterStartDate = filterCriteria.startDate ? new Date(filterCriteria.startDate).setHours(0, 0, 0, 0) : '';
      const filterEndDate = filterCriteria.endDate ? new Date(filterCriteria.endDate).setHours(0, 0, 0, 0) : '';
  
      return (
        isExpired && // Изтекли бюджети
        filterCriteria.showExpired && // Показване на изтекли бюджети, ако showExpired е true
        (filterCriteria.type === '' || budget.type === filterCriteria.type) &&
        (filterCriteria.amount === 0 || budget.amount === filterCriteria.amount) &&
        (filterCriteria.amountLeft === 0 || budget.amount_left === filterCriteria.amountLeft) &&
        (filterStartDate === '' || budgetStartDate === filterStartDate) &&
        (filterEndDate === '' || budgetEndDate === filterEndDate) &&
        (filterCriteria.categoryId === '' || budget.category_id === filterCriteria.categoryId)
      );
    });
  
    // Обновяваме филтрираните бюджети
    setFilteredBudgets({
      active: filterCriteria.showExpired ? [] : filteredActiveBudgets, // Ако showExpired е true, не показваме активни бюджети
      expired: filteredExpiredBudgets,
    });
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