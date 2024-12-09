import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import Header from "../Utils/Header";
import Overview from "../Utils/Overview";
import axios from "axios";
import "../../styles/Dashboard.css";

interface DashboardProps {
  name: string;
  userId: string;
}

function Dashboard({ name, userId }: DashboardProps) {

  const [userTransactions, setUserTransactions] = useState<TransactionData[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      axios
        .get(`http://localhost:3000/transactions/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUserTransactions(response.data))
        .catch((error) => console.error("Error fetching transactions:", error));
    } else {
      console.error("No token found. Please log in.");
    }
  }, [userId]);

  return (
    <div className="page">
      <div className="dashboard-container">
        <Header name={name} />
        <Overview transactions={userTransactions} />
      </div>
      <div className="dashboard-container">
      </div>

    </div>
  );
};

export default Dashboard;
