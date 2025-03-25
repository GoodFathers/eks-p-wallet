import React from "react";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import TrainingCalendar from "../Training/TrainingCalendar";
import { useNavigate } from "react-router-dom";

const Training = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePath="/training" onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName="John Doe"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
          notificationCount={3}
        />

        {/* Training Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              99-Day Training Program
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your progress through the training program
            </p>
          </div>

          {/* Training Calendar */}
          <div className="h-full">
            <TrainingCalendar />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Training;
