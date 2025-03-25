import React from "react";
import Sidebar from "./Dashboard/Sidebar";
import Header from "./Dashboard/Header";
import BalanceCard from "./Dashboard/BalanceCard";
import BinaryNetworkPreview from "./Dashboard/BinaryNetworkPreview";
import TrainingProgressCard from "./Dashboard/TrainingProgressCard";
import PPOBServicesCard from "./Dashboard/PPOBServicesCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleViewFullNetwork = () => {
    navigate("/network");
  };

  const handleViewTrainingDetails = () => {
    navigate("/training");
  };

  const handleSelectPPOBService = (serviceId: string) => {
    navigate(`/ppob/${serviceId}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePath="/" onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName="John Doe"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
          notificationCount={3}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome to your EKS-P Wallet Dashboard
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <div className="h-full">
              <BalanceCard
                lockedBalance={1500000}
                automaticBalance={275000}
                growthRate={3.1731}
              />
            </div>

            {/* Training Progress Card */}
            <div className="h-full">
              <TrainingProgressCard
                completedDays={35}
                totalDays={99}
                lastCompletedDate="2023-06-15"
                nextTrainingDate="2023-06-16"
                onClick={handleViewTrainingDetails}
              />
            </div>

            {/* Binary Network Preview */}
            <div className="h-full">
              <BinaryNetworkPreview
                stats={{
                  totalMembers: 128,
                  leftLegMembers: 75,
                  rightLegMembers: 53,
                  activeMembers: 98,
                  newMembersToday: 5,
                  networkDepth: 8,
                }}
                onViewFullNetwork={handleViewFullNetwork}
              />
            </div>

            {/* PPOB Services Card */}
            <div className="h-full">
              <PPOBServicesCard
                services={[
                  {
                    id: "electricity",
                    name: "Electricity",
                    icon: <span className="text-yellow-500">⚡</span>,
                    description: "Pay your electricity bills",
                  },
                  {
                    id: "water",
                    name: "Water",
                    icon: <span className="text-blue-500">💧</span>,
                    description: "Pay your water bills",
                  },
                  {
                    id: "internet",
                    name: "Internet",
                    icon: <span className="text-purple-500">📶</span>,
                    description: "Pay your internet bills",
                  },
                  {
                    id: "mobile",
                    name: "Mobile Credits",
                    icon: <span className="text-green-500">📱</span>,
                    description: "Top up your mobile credits",
                  },
                ]}
                onSelectService={handleSelectPPOBService}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
