import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import Header from "../Utils/Header";
import Overview from "../Utils/Overview";
import axios from "axios";

interface DashboardProps {
  name: string;
  userId: string;
}

function Dashboard({ name, userId }: DashboardProps) {

  const [userTransactions, setUserTransactions] = useState<TransactionData[]>([]);

  useEffect(() => {
    fetchTransactions();
  });

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
      setUserTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };


  console.log("Fetched form dashboard", userTransactions);

  return (
    <div className="page">
      <Header name={name} />
      <Overview transactions={userTransactions} />
    </div>
  );
};

export default Dashboard;
