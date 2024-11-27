import React, { useCallback, useEffect, useState } from "react";
import Transaction from "./Transaction";
import '../../styles/Transaction.css'
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";
import Category from "../Categories/Category";
import axios from "axios";

function TransactionPage() {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [transactionToEdit, setTransactionToEdit] = useState<TransactionData | null>(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

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

    const handleOpenModal = () => {
        setTransactionToEdit(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setTransactionToEdit(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={`page-container ${isModalOpen ? "blurred" : ""}`}>
                <Category onCategoriesFetched={handleCategoriesFetched} />
                <div className="add-transaction-container">
                    <button id="add-transaction-icon" title="Add Transaction" onClick={handleOpenModal}>
                        <IoIosAddCircle />
                    </button>
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
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.type}</td>
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
                                <div className="update-icons">
                                    <td><CiEdit onClick={() => handleEditTransaction(transaction)} />
                                        <MdDelete onClick={() => handleDeleteTransaction(transaction.id)} />
                                    </td>
                                </div>
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
