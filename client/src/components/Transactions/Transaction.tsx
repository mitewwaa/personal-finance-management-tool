import React, { useEffect, useState } from "react";
import { BiSolidCategory } from "react-icons/bi";
import { MdOutlinePriceChange } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { FaStickyNote } from "react-icons/fa";
import '../../styles/Transaction.css';
import axios from "axios";
import Dropdown from "../Utils/Dropdown";
import { jwtDecode } from "jwt-decode";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";


interface TransactionProps {
    categories: CategoryData[];
    onAddTransaction: (newTransaction: TransactionData) => void;
    transactionToEdit: TransactionData | null;
    onUpdateTransaction: (toUpdateTransaction: TransactionData) => void;
}

function Transaction({ onAddTransaction, categories, transactionToEdit, onUpdateTransaction }: TransactionProps) {
    const [type, setType] = useState<string>("expense"); // Default to expense
    const [category, setCategory] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [currency, setCurrency] = useState<string>("BGN")
    const [location, setLocation] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [timestamp, setTimeStamp] = useState<Date>(new Date());
    const [notification, setNotification] = useState<string>("");

    useEffect(() => {
        if (transactionToEdit !== null) {
            setType(transactionToEdit.type);
            setCategory(categories.find((categ) => categ.id === transactionToEdit.category_id)?.name || "");
            setAmount(transactionToEdit.amount);
            setCurrency(transactionToEdit.currency);
            setLocation(transactionToEdit.location || "");
            setNote(transactionToEdit.notes || "");
            setTimeStamp(new Date(transactionToEdit.date));
        } else {
            resetForm();
        }
    }, [transactionToEdit, categories]);

    const resetForm = () => {
        setType("expense");
        setCategory("");
        setAmount(0);
        setCurrency("BGN");
        setLocation("");
        setNote("");
        setTimeStamp(new Date());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedCategory = categories.find(
            (cat) => cat.name === category
        );

        if (!selectedCategory) {
            setNotification("Invalid category selected!");
            return;
        }
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setNotification('Your session expired, please log in.');
            return;
        }

        if (!amount) {
            setNotification('Please enter a valid amount.');
            return;
        }

        const formattedTimestamp = timestamp.toISOString();

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.userId;

        const newTransaction = {
            type,
            category_id: selectedCategory.id,
            user_id: userId,
            amount,
            currency,
            location,
            notes: note,
            date: formattedTimestamp,
        };
        
        
        try {
            if (transactionToEdit === null) {
                const response = await axios.post('http://localhost:3000/transactions', newTransaction, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("Adding new transaction:", newTransaction);
                setNotification("Successfully added transaction!");
                onAddTransaction(response.data);
            } else {
                const response = await axios.put(`http://localhost:3000/transactions/${transactionToEdit.id}`, newTransaction, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setNotification("Successfully updated transaction!");
                onUpdateTransaction(response.data);
            }

            resetForm();

        } catch (error) {
            setNotification("Can't create or modify transaction. Please try again!");
            console.error("Error creating transaction:", error);
        }
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = new Date(e.target.value);
        const updatedDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            timestamp.getHours(),
            timestamp.getMinutes()
        );
        setTimeStamp(updatedDateTime);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = e.target.value.split(":").map(Number);
        const updatedDateTime = new Date(
            timestamp.getFullYear(),
            timestamp.getMonth(),
            timestamp.getDate(),
            hours,
            minutes
        );
        setTimeStamp(updatedDateTime);
    };

    const filteredCategories = categories.filter((cat) => cat.type === type);

    return (
        <form onSubmit={handleSubmit}>
            <div className="selectors-container">
                <div className="type-selector">
                    <div
                        className={`type-box ${type === "expense" ? "active" : ""}`}
                        onClick={() => setType("expense")}
                    >
                        Expense
                    </div>
                    <div
                        className={`type-box ${type === "income" ? "active" : ""}`}
                        onClick={() => setType("income")}
                    >
                        Income
                    </div>
                </div>

                <div className="category-selector">
                    <label>
                        <BiSolidCategory className="icon" />
                    </label>
                    <Dropdown
                        options={filteredCategories}
                        value={category}
                        onChange={setCategory}
                        placeholder="category"
                    />
                </div>

                <div className="amount-selector">
                    <label>
                        <MdOutlinePriceChange className="icon" />
                    </label>
                    <input
                        type="number"
                        min="1"
                        onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : 0)}
                        placeholder="Enter amount"
                        value={amount}
                        required
                    />
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                    >
                        <option value="">Select Currency</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="BGN">BGN</option>
                    </select>
                </div>

                <div className="location-selector">
                    <label className="icon">
                        <CiLocationOn />
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Enter location"
                    />
                </div>

                <div className="note-selector">
                    <label className="icon">
                        <FaStickyNote />
                    </label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note"
                    />
                </div>

                <div className="date-selector">
                    <input id="date"
                        type="date"
                        value={timestamp.toISOString().split("T")[0]} // Format as YYYY-MM-DD
                        onChange={handleDateChange}
                        required
                    />
                    <input id="time"
                        type="time"
                        value={`${String(timestamp.getHours()).padStart(2, "0")}:${String(
                            timestamp.getMinutes()
                        ).padStart(2, "0")}`} // Format as HH:mm
                        onChange={handleTimeChange}
                        required
                    />
                </div>

            </div>
            <button id="add-transaction-btn" type="submit" onClick={handleSubmit}>{transactionToEdit === null ? `Add Transaction` : `Save`}</button>
            {notification && <div className="notification">{notification}</div>}
        </form>
    );
}


export default Transaction;

