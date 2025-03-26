import React, { useState, useEffect } from "react";
import Sidebar from "./Dashboard/Sidebar";
import Header from "./Dashboard/Header";
import BalanceCard from "./Dashboard/BalanceCard";
import BinaryNetworkPreview from "./Dashboard/BinaryNetworkPreview";
import TrainingProgressCard from "./Dashboard/TrainingProgressCard";
import PPOBServicesCard from "./Dashboard/PPOBServicesCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserBalance,
  getTrainingProgress,
  getPPOBServices,
  getUserNetwork,
} from "@/lib/api";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [balanceData, setBalanceData] = useState({
    lockedBalance: 1500000,
    automaticBalance: 275000,
    growthRate: 3.1731,
  });
  const [trainingData, setTrainingData] = useState({
    completedDays: 35,
    totalDays: 99,
    lastCompletedDate: "2023-06-15",
    nextTrainingDate: "2023-06-16",
  });
  const [networkStats, setNetworkStats] = useState({
    totalMembers: 128,
    leftLegMembers: 75,
    rightLegMembers: 53,
    activeMembers: 98,
    newMembersToday: 5,
    networkDepth: 8,
  });
  const [ppobServices, setPpobServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch balance data
        const balanceResult = await getUserBalance();
        if (balanceResult) {
          setBalanceData({
            lockedBalance: balanceResult.locked_balance,
            automaticBalance: balanceResult.automatic_balance,
            growthRate: balanceResult.growth_rate,
          });
        }

        // Fetch training progress
        const trainingResult = await getTrainingProgress();
        if (trainingResult && trainingResult.length > 0) {
          const completedDays = trainingResult.filter(
            (day) => day.completed,
          ).length;
          const lastCompleted = trainingResult
            .filter((day) => day.completed)
            .sort(
              (a, b) =>
                new Date(b.completion_date).getTime() -
                new Date(a.completion_date).getTime(),
            )[0];

          const nextTraining = trainingResult
            .filter((day) => !day.completed)
            .sort((a, b) => a.day_number - b.day_number)[0];

          setTrainingData({
            completedDays,
            totalDays: trainingResult.length,
            lastCompletedDate:
              lastCompleted?.completion_date || new Date().toISOString(),
            nextTrainingDate: nextTraining ? new Date().toISOString() : null,
          });
        }

        // Fetch PPOB services
        const servicesResult = await getPPOBServices();
        if (servicesResult) {
          const formattedServices = servicesResult.map((service) => ({
            id: service.service_type,
            name: service.name,
            icon: getServiceIcon(service.service_type),
            description: service.description,
          }));
          setPpobServices(formattedServices);
        }

        // Fetch network data
        const networkResult = await getUserNetwork();
        if (networkResult) {
          // Process network data to get stats
          // This is simplified - in a real app you'd have more complex logic
          const leftLeg = networkResult.filter(
            (member) => member.position === "left",
          );
          const rightLeg = networkResult.filter(
            (member) => member.position === "right",
          );
          const active = networkResult.filter(
            (member) => member.status === "active",
          );
          const today = new Date();
          const startOfDay = new Date(today.setHours(0, 0, 0, 0));
          const newToday = networkResult.filter(
            (member) => new Date(member.join_date) >= startOfDay,
          );

          setNetworkStats({
            totalMembers: networkResult.length,
            leftLegMembers: leftLeg.length,
            rightLegMembers: rightLeg.length,
            activeMembers: active.length,
            newMembersToday: newToday.length,
            networkDepth: Math.max(
              ...networkResult.map((member) => member.level),
              0,
            ),
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case "electricity":
        return <span className="text-yellow-500">⚡</span>;
      case "water":
        return <span className="text-blue-500">💧</span>;
      case "internet":
        return <span className="text-purple-500">📶</span>;
      case "mobile":
        return <span className="text-green-500">📱</span>;
      default:
        return <span>🔹</span>;
    }
  };

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
          userName={user?.user_metadata?.full_name || "User"}
          userAvatar={
            user?.user_metadata?.avatar_url ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`
          }
          notificationCount={3}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Dasbor
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Selamat datang di Dasbor Dompet EKS-P Anda
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <div className="h-full">
              <BalanceCard
                lockedBalance={balanceData.lockedBalance}
                automaticBalance={balanceData.automaticBalance}
                growthRate={balanceData.growthRate}
              />
            </div>

            {/* Training Progress Card */}
            <div className="h-full">
              <TrainingProgressCard
                completedDays={trainingData.completedDays}
                totalDays={trainingData.totalDays}
                lastCompletedDate={trainingData.lastCompletedDate}
                nextTrainingDate={trainingData.nextTrainingDate}
                onViewDetails={handleViewTrainingDetails}
              />
            </div>

            {/* Binary Network Preview */}
            <div className="h-full">
              <BinaryNetworkPreview
                totalMembers={networkStats.totalMembers}
                leftLegMembers={networkStats.leftLegMembers}
                rightLegMembers={networkStats.rightLegMembers}
                activeMembers={networkStats.activeMembers}
                newMembersToday={networkStats.newMembersToday}
                networkDepth={networkStats.networkDepth}
                onViewFullNetwork={handleViewFullNetwork}
              />
            </div>

            {/* PPOB Services Card */}
            <div className="h-full">
              <PPOBServicesCard
                services={ppobServices}
                onSelectService={handleSelectPPOBService}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
