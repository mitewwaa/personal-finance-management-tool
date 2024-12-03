import React, { useEffect, useState } from "react";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";

interface OverviewProps {
    transactions: TransactionData[] | null;
}

function Overview({ transactions }: OverviewProps) {
    const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);
    const [currentMonthOutcome, setCurrentMonthOutcome] = useState<number>(0);
    const [totalBalance, setTotalBalance] = useState<number>(0);
    const [recentTransactions, setRecentTransactions] = useState<TransactionData | null>(null);
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

    // Fetch exchange rates (USD, EUR, GBP to BGN) on component mount
    const fetchExchangeRates = async () => {
        try {
            // Assuming you're using an API to fetch exchange rates
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/BGN');
            const data = await response.json();
            setExchangeRates(data.rates);
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    };

    const convertToBGN = (amount: number, currency: string): number => {
        if (currency === 'BGN') return amount;
        const rate = exchangeRates[currency];
        return rate ? amount * rate : amount;
    };
    const calculateCurrentMonthStats = () => {
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
    };

    // Helper function to calculate total balance
    const calculateTotalBalance = () => {
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
    };

    useEffect(() => {
        if (transactions && exchangeRates) {
          calculateCurrentMonthStats();
          calculateTotalBalance();
        //   setRecentTransactionsList();
        }
      }, [transactions, exchangeRates]);
    

    return (
        <div className="overview">
            <div className="sum-statistics">
                <div id="current-month-income">
                    <p>Current month:</p>
                    <p>+{currentMonthIncome}</p>
                </div>
                <div id="total-balance">
                    <p>Total Balance:</p>
                    <p>{totalBalance}</p>
                </div>
                <div id="current-month-outcome">
                    <p>Current month:</p>
                    <p>-{currentMonthOutcome}</p>
                </div>
            </div>
        </div>
    );
}

export default Overview;