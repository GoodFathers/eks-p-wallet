import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { ArrowUpRight, Lock, Wallet } from "lucide-react";

interface BalanceCardProps {
  lockedBalance?: number;
  automaticBalance?: number;
  growthRate?: number;
}

const BalanceCard = ({
  lockedBalance = 1500000,
  automaticBalance = 275000,
  growthRate = 3.1731,
}: BalanceCardProps) => {
  const [currentAutomaticBalance, setCurrentAutomaticBalance] =
    useState(automaticBalance);
  const [progressValue, setProgressValue] = useState(0);

  // Simulate real-time balance growth
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAutomaticBalance((prev) => {
        const newBalance = prev + growthRate / 10; // Update every 100ms
        return newBalance;
      });

      // Update progress for visual indicator (resets every 10 seconds)
      setProgressValue((prev) => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, [growthRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="w-full bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Balance Overview
        </CardTitle>
        <CardDescription className="text-gray-500">
          Real-time balance monitoring
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Locked Balance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                Locked Balance
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(lockedBalance)}
            </div>
          </div>

          {/* Automatic Balance with Growth Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">
                  Automatic Balance
                </span>
              </div>
              <div className="text-lg font-bold text-emerald-600">
                {formatCurrency(Math.floor(currentAutomaticBalance))}
              </div>
            </div>

            {/* Growth Indicator */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  Growing at {growthRate} Rp/second
                </span>
                <span className="flex items-center text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Active
                </span>
              </div>
              <Progress value={progressValue} className="h-1.5 bg-gray-100" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full text-sm">
          View Transaction History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BalanceCard;
