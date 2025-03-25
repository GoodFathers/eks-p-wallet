import React from "react";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import NetworkVisualization from "../BinaryNetwork/NetworkVisualization";
import { useNavigate } from "react-router-dom";

const Network = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePath="/network" onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName="John Doe"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
          notificationCount={3}
        />

        {/* Network Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Binary Network
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Visualize and manage your binary network structure
            </p>
          </div>

          {/* Network Visualization */}
          <div className="h-[calc(100vh-220px)]">
            <NetworkVisualization />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Network;
