import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import Header from "../Utils/Header";
import Overview from "../Utils/Overview";

interface DashboardProps {
  name: string;
  transactions: TransactionData[] | null;
}

function Dashboard ({ name, transactions } : DashboardProps) {
  return (
    <div className="page">
      <Header name={name} />
      {/* <Overview transactions={transactions} /> */}
    </div>
  );
};

export default Dashboard;
