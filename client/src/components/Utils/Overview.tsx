import React, { useCallback, useEffect, useState } from "react";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import "../../styles/Overview.css";
import axios from "axios";

interface OverviewProps {
    transactions: TransactionData[] | null;
}

function Overview({ transactions }: OverviewProps) {
    const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);
    const [currentMonthOutcome, setCurrentMonthOutcome] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [recentIncomes, setRecentIncomes] = useState<TransactionData[]>([]);
    const [recentOutcomes, setRecentOutcomes] = useState<TransactionData[]>([]);
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

    // Fetch exchange rates (USD, EUR, GBP to BGN) on component mount
    const fetchExchangeRates = async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/BGN');
            setExchangeRates(response.data.rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

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

            setCurrentMonthIncome(income);
            setCurrentMonthOutcome(outcome);
        }
    }, [transactions, exchangeRates]);

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
            setTotalBalance(balance);
        }
    }, [transactions, exchangeRates]);

    const getRecentTransactions = useCallback(() => {
        if (transactions && transactions.length > 2) {
            const sortedTransactions = [...transactions].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
    
            // Get the last 3 transactions
            const recents = sortedTransactions.slice(0, 4);
            let incomes: TransactionData[] = [];
            let outcomes: TransactionData[] = [];
            recents.forEach((recent) => {
                recent.type === "expense" ? outcomes.push(recent) : incomes.push(recent);
            });
            setRecentIncomes(incomes);
            setRecentOutcomes(outcomes);
        }
    }, [transactions])


    useEffect(() => {
        fetchExchangeRates();
    }, []);

    useEffect(() => {
        if (transactions && transactions.length > 0 && Object.keys(exchangeRates).length > 0) {
            calculateCurrentMonthStats();
            calculateTotalBalance();
            getRecentTransactions();
        }
    }, [transactions, exchangeRates, calculateCurrentMonthStats, calculateTotalBalance, getRecentTransactions]);


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
                <div className="transactions-grid">
                    <div id="outcomes">
                        <h5>Expenses</h5>
                        {recentOutcomes.map((outcome) => (
                            <div className="outcome-transaction">
                                <p>{outcome.location}</p>
                                <p>- {outcome.amount} {outcome.currency}</p>
                                <p>{new Date(outcome.date).toLocaleString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}</p>
                            </div>
                        )
                        )}
                    </div>
                    <div id="incomes">
                        <h5>Incomes</h5>
                        {recentIncomes.map((income) => (
                            <div className="income-transaction">
                                <p>{income.location}</p>
                                <p>+ {income.amount} {income.currency}</p>
                                <p>{new Date(income.date).toLocaleString('en-GB', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}</p>
                            </div>
                        )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Overview;