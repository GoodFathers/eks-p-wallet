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
import { ArrowUpRight, Lock, Wallet, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  const [currentLockedBalance, setCurrentLockedBalance] =
    useState(lockedBalance);
  const [currentGrowthRate, setCurrentGrowthRate] = useState(growthRate);
  const [progressValue, setProgressValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch balance data from Supabase
  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call the update_balance edge function to get the latest balance
      const { data, error } = await supabase.functions.invoke(
        "update_balance",
        {
          method: "POST",
        },
      );

      if (error) {
        console.error("Error fetching balance:", error);
        setError("Gagal mengambil data saldo");
        return;
      }

      if (data && data.data) {
        setCurrentLockedBalance(data.data.locked_balance);
        setCurrentAutomaticBalance(data.data.automatic_balance);
        setCurrentGrowthRate(data.data.growth_rate);
      }
    } catch (err) {
      console.error("Error in fetchBalance:", err);
      setError("Terjadi kesalahan yang tidak terduga");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  // Simulate real-time balance growth
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      setCurrentAutomaticBalance((prev) => {
        const newBalance = prev + currentGrowthRate / 10; // Update every 100ms
        return newBalance;
      });

      // Update progress for visual indicator (resets every 10 seconds)
      setProgressValue((prev) => (prev + 1) % 100);
    }, 100);

    return () => clearInterval(interval);
  }, [currentGrowthRate, isLoading]);

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
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Ikhtisar Saldo
            </CardTitle>
            <CardDescription className="text-gray-500">
              Pemantauan saldo real-time
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchBalance}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Locked Balance */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                Saldo Terkunci
              </span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(currentLockedBalance)}
            </div>
          </div>

          {/* Automatic Balance with Growth Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-medium text-gray-700">
                  Saldo Otomatis
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
                  Bertumbuh {currentGrowthRate} Rp/detik
                </span>
                <span className="flex items-center text-emerald-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Aktif
                </span>
              </div>
              <Progress value={progressValue} className="h-1.5 bg-gray-100" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button variant="outline" className="w-full text-sm">
          Lihat Riwayat Transaksi
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BalanceCard;
