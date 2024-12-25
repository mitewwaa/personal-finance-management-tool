import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Category from '../Categories/Category';
import { FaPlus } from 'react-icons/fa';
import { IoArrowBackCircle } from "react-icons/io5";
import '../../styles/BudgetForm.css';
import CategoryDropdown from '../Categories/CategoryDropdown';
import CategoryModal from '../Categories/CategoryModal';

const CreateBudgetPage: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'goal' | 'category_limit'>('goal');
  const [amount, setAmount] = useState(0);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const budgetToEdit = location.state?.budget || null;

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
    if (budgetToEdit && isEdit) {
      setName(budgetToEdit.name);
      setType(budgetToEdit.type);
      setAmount(budgetToEdit.amount);
      setCategoryId(budgetToEdit.category_id);
      setStartDate(new Date(budgetToEdit.start_date).toISOString().slice(0, 10));
      setEndDate(new Date(budgetToEdit.end_date).toISOString().slice(0, 10));
    }
  }, [budgetToEdit, isEdit]);

  useEffect(() => {
    if (!userId) {
      setError('You are not logged in!');
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleCreateOrUpdateBudget = async () => {
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
      if (isEdit && budgetToEdit) {
        await axios.put(`http://localhost:3000/budgets/${budgetToEdit.id}`, budgetData, {
          headers: { Authorization: `Bearer ${userId}` },
        });
      } else {
        await axios.post(`http://localhost:3000/budgets/users/${userId}`, budgetData, {
          headers: { Authorization: `Bearer ${userId}` },
        });
      }
      navigate('/budgets');
    } catch (error) {
      console.error('Error saving budget:', error);
      setError('Something went wrong when saving the budget.');
    }
  };

  const handleCategoryCreated = (newCategory: { id: string; name: string }) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const goBack = () => {
    navigate('/budgets');
  };

  return (
    <div className="budgetFormContainer">
      <div className='budgetHeader'>
        <button type='button' onClick={goBack} className='goBackButton'><IoArrowBackCircle className='backIcon' /></button>
        <h1 className='mainTitle'>{isEdit ? 'Edit Budget' : 'Add new budget'}</h1>
      </div>

      {error && <div className="error">{error}</div>}
      <form onSubmit={(e) => e.preventDefault()} className='budgetForm'>
        <div className='inputContainer'>
          <label htmlFor="name" className='label'>Name</label>
          <input
            id="name"
            className='inputField'
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='inputContainer'>
          <label htmlFor="type" className='label'>Type</label>
          <select
            id="type"
            className='inputField'
            value={type}
            onChange={(e) => setType(e.target.value as 'goal' | 'category_limit')}
          >
            <option value="goal" className='option'>Goal</option>
            <option value="category_limit" className='option'>Category limit</option>
          </select>
        </div>
        <div className='inputContainer'>
          <label htmlFor="amount" className='label'>Amount</label>
          <input
            id="amount"
            className='inputField'
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <div className='categoryGroup'>
          <CategoryDropdown
            categories={categories}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
          <button type="button" className='addCategoryButton' onClick={() => setIsModalOpen(true)}>
            <FaPlus className='plus' />
            <p className='text'>Add New Category</p>
          </button>
        </div>
        <div className='inputContainer'>
          <label htmlFor="startDate" className='label'>Start Date</label>
          <input
            id="startDate"
            className='inputField'
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className='inputContainer'>
          <label htmlFor="endDate" className='label'>End Date</label>
          <input
            id="endDate"
            className='inputField'
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleCreateOrUpdateBudget} className='buttonSubmit'>
          {isEdit ? 'Update Budget' : 'Create Budget'}
        </button>
      </form>
      <Category onCategoriesFetched={setCategories} />

      <CategoryModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
};

export default CreateBudgetPage;
