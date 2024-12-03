import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import TransactionData from "../../../../server/src/shared/interfaces/TransactionData";
import Header from "../Utils/Header";

interface DashboardProps {
  name: string;
  //transactions: TransactionData[] | null;
}

const Dashboard: React.FC<DashboardProps> = ({ name } : DashboardProps) => {
  return (
    <div className="page">
      <Header name={name} />
      
    </div>
  );
};

export default Dashboard;
