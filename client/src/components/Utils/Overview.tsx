import React, { useCallback, useEffect, useState } from "react";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import "../../styles/Overview.css";
import axios from "axios";
import { GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import Category from "../Categories/Category";
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";

interface OverviewProps {
    transactions: TransactionData[] | null;
    categories: CategoryData[];
    exchangeRates: { [key: string]: number };
}

function Overview({ transactions, categories, exchangeRates }: OverviewProps) {
    const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);
    const [currentMonthOutcome, setCurrentMonthOutcome] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [recentIncomes, setRecentIncomes] = useState<TransactionData[]>([]);
    const [recentOutcomes, setRecentOutcomes] = useState<TransactionData[]>([]);

    const convertToBGN = (amount: number, currency: string): number => {
        if (currency === 'BGN') return amount;
        const rate = exchangeRates[currency];
        return rate ? (amount / rate) : amount;
    };

    const calculateCurrentMonthStats = useCallback(() => {
        if (transactions && exchangeRates) {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            let income = 0;
            let outcome = 0;

            transactions.forEach((transaction) => {
                const transactionDate = new Date(transaction.date);
                if (transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear) {
                    const amountInBGN = convertToBGN(transaction.amount, transaction.currency);
                    if (transaction.type === 'income') {
                        income += amountInBGN;
                    } else if (transaction.type === 'expense') {
                        outcome += amountInBGN;
                    }
                }
            });

            setCurrentMonthIncome((prev) => (prev === income ? prev : income));
            setCurrentMonthOutcome((prev) => (prev === outcome ? prev : outcome));
        }
    }, [transactions, convertToBGN]);

    const calculateTotalBalance = useCallback(() => {
        if (transactions && exchangeRates) {
            let balance = 0;
            transactions.forEach((transaction) => {
                const amountInBGN = convertToBGN(transaction.amount, transaction.currency);
                if (transaction.type === 'income') {
                    balance += amountInBGN;
                } else if (transaction.type === 'expense') {
                    balance -= amountInBGN;
                }
            });
            setTotalBalance((prev) => (prev === balance ? prev : balance));
        }
    }, [transactions, convertToBGN]);

    const getRecentTransactions = useCallback(() => {
        if (transactions && transactions.length > 0) {
            const sortedTransactions = [...transactions].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const recents = sortedTransactions.slice(0, 4);
            let incomes: TransactionData[] = [];
            let outcomes: TransactionData[] = [];
            recents.forEach((recent) => {
                recent.type === "expense" ? outcomes.push(recent) : incomes.push(recent);
            });
            setRecentIncomes((prev) => (prev === incomes ? prev : incomes));
            setRecentOutcomes((prev) => (prev === outcomes ? prev : outcomes));
        }
    }, [transactions])

    useEffect(() => {
        if (transactions && transactions.length > 0 && Object.keys(exchangeRates).length > 0) {
            calculateCurrentMonthStats();
            calculateTotalBalance();
            getRecentTransactions();
        }
    }, [transactions]);

    return (
        <div id="overview">
            <div id="sum-statistics">
                <div id="current-month-income">
                    <p className="title">Current month:</p>
                    <p className="sum">+ {currentMonthIncome.toFixed(2)} BGN</p>
                </div>
                <div id="total-balance">
                    <p className="title">Total Balance:   </p>
                    <p className="sum">{totalBalance.toFixed(2)} BGN</p>
                </div>
                <div id="current-month-outcome">
                    <p className="title">Current month:</p>
                    <p className="sum">- {currentMonthOutcome.toFixed(2)} BGN</p>
                </div>
            </div>
            <div id="recent-transactions">
                <h4>Recent Transactions</h4>
                <div className="transactions-container">
                    <div className="outcomes">
                        <h5>Expenses</h5>
                        {recentOutcomes.length === 0 ? (
                            <p className="notification">No recent expenses.</p>
                        ) : (recentOutcomes.map((outcome) => (
                            <div className="outcome-transaction">
                                <GiPayMoney className="icon" />
                                <div className="transaction-info">
                                    <p className="location">{outcome.location}</p>
                                    <p className="category">{categories.map((cat) =>
                                        cat.id === outcome.category_id ? cat.name : null)}</p>
                                </div>
                                <div className="transaction-info">
                                    <p className="amount">- {outcome.amount} {outcome.currency}</p>
                                    <p className="date">{new Date(outcome.date).toLocaleString('en-GB', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    })}</p>
                                </div>
                            </div>
                        )
                        ))}
                    </div>
                    <div className="incomes">
                        <h5>Incomes</h5>
                        {recentIncomes.length === 0 ? (
                            <p className="notification">No recent incomes.</p>
                        ) :
                            (recentIncomes.map((income) => (
                                <div className="income-transaction">
                                    <GiReceiveMoney className="icon" />
                                    <div className="transaction-info">
                                        <p className="location">{income.location}</p>
                                        <p className="category">{categories.map((cat) =>
                                            cat.id === income.category_id ? cat.name : null)}</p>
                                    </div>
                                    <div className="transaction-info">
                                        <p className="amount">+ {income.amount} {income.currency}</p>
                                        <p className="date">{new Date(income.date).toLocaleString('en-GB', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}</p>
                                    </div>
                                </div>
                            )
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;