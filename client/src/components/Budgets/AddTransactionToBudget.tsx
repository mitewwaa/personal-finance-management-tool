import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import BudgetData from '../../../../server/src/shared/interfaces/BudgetData';
import { MdOutlineCancel } from 'react-icons/md';
import Modal from 'react-modal';

import "../../styles/CustomModal.css"

interface AddTransactionToBudgetProps {
  budget: BudgetData;
  isOpen: boolean;
  onRequestClose: () => void;
  updateBudget: (budgetId: string, newAmountLeft: number) => void;
}

const AddTransactionToBudget: React.FC<AddTransactionToBudgetProps> = ({ budget, isOpen, onRequestClose, updateBudget }) => {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('BGN');
  const [location, setLocation] = useState<string>('Online');
  const [notes, setNotes] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    setDate(formattedDate);
    setTime(formattedTime);
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
  
    if (!userId) {
      alert('Session expired! Please log in again.');
      return;
    }
  
    const formattedDateTime = `${date}T${time}:00`;  // format 'YYYY-MM-DDTHH:MM:00'
  
    const transactionData = {
      amount,
      currency,
      type: 'expense',
      category_id: budget.category_id,
      location,
      notes,
      date: formattedDateTime,
      user_id: userId,
    };
  
    try {
      const transactionResponse = await axios.post('http://localhost:3000/transactions', transactionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const budgetResponse = await axios.get(`http://localhost:3000/budgets/${budget.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedBudget = budgetResponse.data;
      const newAmountLeft = updatedBudget.amount_left - amount;
  
      await axios.put(
        `http://localhost:3000/budgets/${budget.id}/amount`,{ amount }, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      }
      );
  
      updateBudget(budget.id, newAmountLeft);
      setSuccessMessage('Expense added and budget updated!');
  
      setAmount(0);
      setCurrency('BGN');
      setLocation('Online');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toISOString().split('T')[1].substring(0, 5));
      setError(null);

      setTimeout(() => {
        onRequestClose();
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding transaction or updating budget:', error);
      setError('An error occurred while adding the expense to the budget.');
    }
  };
  
  
  const handleCloseModal = () => {
    setError(null);
    onRequestClose();
  };


  return (
    <Modal isOpen={isOpen} onRequestClose={handleCloseModal} className="customModal" appElement={document.getElementById("root") || undefined}>
      <div className="modalHeader">
        <button className="cancelButton" onClick={handleCloseModal}><MdOutlineCancel /></button>
        <h2 className="mainTitleModal">Add Expense to Budget: {budget.name}</h2>
      </div>
      <div className="modalContent">
        <div className="fieldModal">
          <label className="fieldLabel">Expense Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="editInput"
            required
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="editInput"
          >
            <option value="BGN">BGN</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="editInput"
          />
        </div>
        <div className="fieldModal">
          <label className="fieldLabel">Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="editInput"
          />
        </div>
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button className="saveButton" onClick={handleSubmit}>Add Expense</button>
      </div>
    </Modal>
  );
};
export default AddTransactionToBudget;