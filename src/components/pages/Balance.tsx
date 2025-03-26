import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import BalanceCard from "../Dashboard/BalanceCard";
import TransactionHistory from "../transactions/TransactionHistory";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getUserBalance } from "@/lib/api";

const Balance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balanceData, setBalanceData] = useState({
    lockedBalance: 1500000,
    automaticBalance: 275000,
    growthRate: 3.1731,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const data = await getUserBalance();
        if (data) {
          setBalanceData({
            lockedBalance: data.locked_balance,
            automaticBalance: data.automatic_balance,
            growthRate: data.growth_rate,
          });
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalanceData();
  }, []);

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
          userName={user?.user_metadata?.full_name || "User"}
          userAvatar={
            user?.user_metadata?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
          }
          notificationCount={3}
        />

        {/* Balance Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Saldo
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kelola Saldo Dompet EKS-P Anda
            </p>
          </div>

          {/* Balance Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <div className="h-full">
              <BalanceCard
                lockedBalance={balanceData.lockedBalance}
                automaticBalance={balanceData.automaticBalance}
                growthRate={balanceData.growthRate}
              />
            </div>

            {/* Transaction History */}
            <div className="h-full">
              <TransactionHistory />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Balance;
