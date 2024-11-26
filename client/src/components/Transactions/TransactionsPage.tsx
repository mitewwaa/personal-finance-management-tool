import React, { useState } from "react";
import Transaction from "./Transaction";
import '../../styles/Transaction.css'
import { IoIosAddCircle } from "react-icons/io";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";

function TransactionPage() {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const addTransaction = (newTransaction: TransactionData) => {
        setTransactions((prev) => [...prev, newTransaction]);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className='page-container'>
            <button onClick={handleOpenModal}><IoIosAddCircle /></button>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <button onClick={handleCloseModal} className="close-button">
                        &times;
                        </button>
                        <Transaction onAddTransaction={addTransaction} />
                    </div>
                </div>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Location</th>
                        <th>Note</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.type}</td>
                            {/* <td>{transaction.category}</td> */}
                            <td>{transaction.amount}</td>
                            <td>{transaction.location}</td>
                            <td>{transaction.notes}</td>
                            <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TransactionPage;
