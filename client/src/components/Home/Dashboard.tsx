import React, { useCallback, useEffect, useState } from "react";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import Header from "../Utils/Header";
import Overview from "../Utils/Overview";
import axios from "axios";
import "../../styles/Dashboard.css";
import Category from "../Categories/Category";
import CategoryData from "../../../../server/src/shared/interfaces/CategoryData";
import StatisticsChart from "../Utils/StatisticsChart";
import InsightsPreview, {Insight} from "../Insights/InsightsPreview";

interface DashboardProps {
  name: string;
  userId: string;
}

function Dashboard({ name, userId }: DashboardProps) {

  const [userTransactions, setUserTransactions] = useState<TransactionData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      axios
        .get(`http://localhost:3000/transactions/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUserTransactions(response.data))
        .catch((error) => console.error("Error fetching transactions:", error));
      console.log("Dashbard", userTransactions);
    } else {
      console.error("No token found. Please log in.");
    }
  },[userId]);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleCategoriesFetched = useCallback((categories: CategoryData[]) => {
    setCategories(categories);
    console.log("Dashboard", categories);
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/BGN');
      setExchangeRates(response.data.rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');

    const fetchInsights = async () => {
      if (token) {
            axios.get(`http://localhost:3000/budgets/users/${userId}/insights`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            .then(response => {
                setInsights(response.data);
            })
            .catch(error => {
                console.error('Error fetching budget insights:', error);
            });
        } else {
            console.error('JWT token is missing');
        }
      }
    fetchInsights();
  }, []);

  return (
    <div className="page">
      <Category onCategoriesFetched={handleCategoriesFetched} />
      <div className="left-dashboard-container">
        <Header name={name} />
        {userTransactions.length > 0 && categories.length > 0 ? (
          <Overview transactions={userTransactions} categories={categories} exchangeRates={exchangeRates} />) :
          (<p className="loading">No recent transactions...</p>)}
      </div>
      <div className="right-dashboard-container">
        <div className="top">
          {userTransactions.length > 0 && categories.length > 0 ? (
            <StatisticsChart transactions={userTransactions} categories={categories} exchangeRates={exchangeRates} />
          ) : (
            <p className="loading">Loading data...</p>
          )}
        </div>
        <div className="bottom">
          <InsightsPreview insights={insights} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
