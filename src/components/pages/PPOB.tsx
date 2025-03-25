import React from "react";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import ServiceForm from "../PPOB/ServiceForm";
import { useNavigate } from "react-router-dom";

const PPOB = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePath="/ppob" onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName="John Doe"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
          notificationCount={3}
        />

        {/* PPOB Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              PPOB Services
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Pay bills and top up mobile credits securely
            </p>
          </div>

          {/* Service Form */}
          <div className="flex justify-center">
            <ServiceForm />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PPOB;
