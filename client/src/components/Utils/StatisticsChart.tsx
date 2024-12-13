import React, { useEffect, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";
import "../../styles/StatisticsChart.css";

interface StatisticsChartProps {
    transactions: TransactionData[];
    categories: CategoryData[];
    exchangeRates: { [key: string]: number };
}

ChartJS.register(ArcElement, Tooltip, Legend);

function StatisticsChart({ transactions, categories, exchangeRates }: StatisticsChartProps) {
    const [outcomes, setOutcomes] = useState<TransactionData[]>([]);
    const [incomes, setIncomes] = useState<TransactionData[]>([]);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    useEffect(() => {
        if (transactions.length === 0) {
            console.log("No transactions to process yet.");
            return;
        }
        const outcomeTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return (
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear &&
                transaction.type === "expense"
            );
        });

        const incomeTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return (
                transactionDate.getMonth() === currentMonth &&
                transactionDate.getFullYear() === currentYear &&
                transaction.type === "income"
            );
        });

        setOutcomes(outcomeTransactions);
        setIncomes(incomeTransactions);
    }, [transactions]);

    const convertToBGN = (amount: number, currency: string): number => {
        if (currency === 'BGN') return amount;
        const rate = exchangeRates[currency];
        return rate ? (amount / rate) : amount;
    };

    const calculateCategoryCounts = (data: TransactionData[]) =>
        data.reduce<Record<string, number>>((acc, transaction) => {
            const amount = convertToBGN(transaction.amount, transaction.currency);
            acc[transaction.category_id] = (acc[transaction.category_id] || 0) + amount;
            return acc;
        }, {});

    const generateChartData = (counts: Record<string, number>, categories: CategoryData[]) => {
        const labels: string[] = [];
        const data: number[] = [];

        for (const [categoryId, amount] of Object.entries(counts)) {
            const categoryName = categories.find((cat) => cat.id === categoryId)?.name || "Unknown";
            const formattedAmount = `${amount.toFixed(2)} BGN`;
            labels.push(`${categoryName}: ${formattedAmount}`);
            data.push(amount);
        }

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: ["#c94c4c", "#6c2212", "#f7cac9", "#8e6e6e", "#c1946a", "#dac292", "#d51b18", "#800020", "#d62600"],
                    hoverBackgroundColor: ["#7a9f98", "#8c7ea7", "#ad7a8c", "#8d9f7a", "#c3b33d"],
                    borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
                    borderWidth: 2,
                },
            ],
        };
    };

    const categoryCountsOutcome = calculateCategoryCounts(outcomes);
    const categoryCountsIncome = calculateCategoryCounts(incomes);

    const outcomesData = generateChartData(categoryCountsOutcome, categories);
    const incomesData = generateChartData(categoryCountsIncome, categories);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                backgroundColor: "#000",
                titleColor: "#fff",
                bodyColor: "#fff",
                footerColor: "#fff",
            },
            legend: {
                position: "bottom" as const,
                labels: {
                    color: "#233238",
                },
                font: {
                    size: 8,
                },
                boxWidth: 5, // Size of the legend color box
                boxHeight: 4,
                padding: 0, // Padding around each legend item
            },
        },
        hoverOffset: 10,
        rotation: Math.PI / 4,
        animation: {
            animateScale: true,
            animateRotate: true,
        },
        elements: {
            arc: {
                borderWidth: 2,
                borderColor: "#fff",
            },
        },
    };


    return (
        <div className="pie-charts">
            {outcomesData.labels.length > 0 && (
                <React.Fragment>
                    <div className="expenses-chart">
                        <h4>Expenses</h4>
                        <Doughnut data={outcomesData} options={chartOptions} />
                    </div>
                </React.Fragment>
            )}

            {incomesData.labels.length > 0 && (
                <React.Fragment>
                    <div className="incomes-chart">
                        <h4>Incomes</h4>
                        <Doughnut data={incomesData} options={chartOptions}  />
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}

export default StatisticsChart;
