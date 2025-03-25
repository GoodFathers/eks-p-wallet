import React from "react";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import BalanceCard from "../Dashboard/BalanceCard";
import { useNavigate } from "react-router-dom";

const Balance = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePath="/balance" onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName="John Doe"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
          notificationCount={3}
        />

        {/* Balance Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Balance
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your EKS-P Wallet Balance
            </p>
          </div>

          {/* Balance Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <div className="h-full">
              <BalanceCard
                lockedBalance={1500000}
                automaticBalance={275000}
                growthRate={3.1731}
              />
            </div>

            {/* Transaction History Card (placeholder for future implementation) */}
            <div className="h-full bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Transaction History</h2>
              <p className="text-gray-500">
                No recent transactions to display.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Balance;
