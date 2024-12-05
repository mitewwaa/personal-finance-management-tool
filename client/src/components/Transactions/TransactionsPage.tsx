import React, { useCallback, useEffect, useState } from "react";
import Transaction from "./Transaction";
import '../../styles/Transaction.css'
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaFilter } from "react-icons/fa";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";
import Category from "../Categories/Category";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface TransactionPageProps {
    userId: string;
}

function TransactionPage({ userId }: TransactionPageProps) {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [transactionToEdit, setTransactionToEdit] = useState<TransactionData | null>(null);
    const [filterType, setFilterType] = useState<string>('daily');
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            axios
                .get(`http://localhost:3000/transactions/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => setTransactions(response.data))
                .catch((error) => console.error("Error fetching transactions:", error));
        } else {
            console.error("No token found. Please log in.");
        }
    },[userId]);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                console.error("No token found. Please log in.");
                return;
            }

            const response = await axios.get("http://localhost:3000/transactions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const addTransaction = (newTransaction: TransactionData) => {
        setTransactions((prev) => [...prev, newTransaction]);
        fetchTransactions();
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/transactions/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction.id !== transactionId)
            );
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    const handleEditTransaction = (toUpdateTransaction: TransactionData) => {
        setTransactionToEdit(toUpdateTransaction);
        setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
                transaction.id === toUpdateTransaction.id ? toUpdateTransaction : transaction
            )
        );
        setIsModalOpen(true);
    };

    const handleCategoriesFetched = useCallback((categories: CategoryData[]) => {
        setCategories(categories);
    }, []);;

    const filterTransactions = (transactions: TransactionData[]) => {
        const today = new Date();
        if (!selectedDate || selectedDate === today) return transactions;

        const userSelectedDate = new Date(selectedDate);

        return transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);

            switch (filterType) {
                case 'daily':
                    return transactionDate.toDateString() === userSelectedDate.toDateString();

                case 'weekly':
                    const startOfSelectedWeek = new Date(userSelectedDate);
                    // Get the start of the week (Sunday)
                    startOfSelectedWeek.setDate(userSelectedDate.getDate() - userSelectedDate.getDay());
                    startOfSelectedWeek.setHours(0, 0, 0, 0); // Reset time to 00:00:00

                    const endOfSelectedWeek = new Date(startOfSelectedWeek);
                    // Set end of the week (Saturday)
                    endOfSelectedWeek.setDate(startOfSelectedWeek.getDate() + 6);
                    endOfSelectedWeek.setHours(23, 59, 59, 999); // Set time to 23:59:59

                    // Check if the transaction date falls within the week range
                    return transactionDate >= startOfSelectedWeek && transactionDate <= endOfSelectedWeek;

                case 'monthly':
                    return (
                        transactionDate.getMonth() === userSelectedDate.getMonth() &&
                        transactionDate.getFullYear() === userSelectedDate.getFullYear()
                    );

                case 'yearly':
                    return transactionDate.getFullYear() === userSelectedDate.getFullYear();

                default:
                    return transactionDate.toDateString() === userSelectedDate.toDateString();
            }
        });
    };


    const handleOpenModal = () => {
        setTransactionToEdit(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setTransactionToEdit(null);
        setIsModalOpen(false);
    };

    const displayedTransactions = filterTransactions(transactions);

    return (
        <>
            <div className={`page-container ${isModalOpen ? "blurred" : ""}`}>
                <Category onCategoriesFetched={handleCategoriesFetched} />
                <div className="add-transaction-container">
                    <button id="add-transaction-icon" title="Add Transaction" onClick={handleOpenModal}>
                        <IoIosAddCircle />
                    </button>
                </div>

                <div className="filter-container">
                    <FaFilter id="filter-icon" />
                    <div className="date-picker-container">
                        <select
                            id="filter"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        <DatePicker id="datepicker"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat={
                                filterType === "daily" ? "dd/MM/yyyy" :
                                    filterType === "monthly" ? "MM/yyyy" :
                                        filterType === "yearly" ? "yyyy" :
                                            "dd/MM/yyyy"
                            }

                            showMonthYearPicker={filterType === "monthly"}
                            showYearPicker={filterType === "yearly"}

                        />
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Location</th>
                            <th>Note</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.type.toUpperCase()}</td>
                                <td>
                                    {categories.map((cat) =>
                                        cat.id === transaction.category_id ? cat.name : null)}
                                </td>
                                <td>{transaction.amount} {transaction.currency}</td>
                                <td>{transaction.location || ""}</td>
                                <td>{transaction.notes || ""}</td>
                                <td>{new Date(transaction.date).toLocaleString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}</td>
                                <td>
                                    <div className="update-icons">
                                        <CiEdit onClick={() => handleEditTransaction(transaction)} />
                                        <MdDelete onClick={() => handleDeleteTransaction(transaction.id)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button onClick={handleCloseModal} className="close-button">
                            &times;
                        </button>
                        <Transaction
                            onAddTransaction={addTransaction}
                            onUpdateTransaction={handleEditTransaction}
                            categories={categories}
                            transactionToEdit={transactionToEdit}
                        />
                    </div>
                </div>
            )}
        </>
    );
}


export default TransactionPage;
