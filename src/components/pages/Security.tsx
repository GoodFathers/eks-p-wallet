import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import Header from "../Dashboard/Header";
import PINValidation from "../Security/PINValidation";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Smartphone } from "lucide-react";

const Security = () => {
  const navigate = useNavigate();
  const [showPINDialog, setShowPINDialog] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handlePINValidation = async (pin: string) => {
    // Simulate PIN validation
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(pin === "123456"); // For demo purposes
      }, 1000);
    });
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activePath="/security" onNavigate={handleNavigate} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          userName="John Doe"
          userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
          notificationCount={3}
        />

        {/* Security Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Security Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your account security and authentication methods
            </p>
          </div>

          {/* Security Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  PIN Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Your PIN is used to authorize transactions and access
                  sensitive information.
                </p>
                <Button onClick={() => setShowPINDialog(true)}>
                  Change PIN
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Two-Factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Add an extra layer of security to your account with two-factor
                  authentication.
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </CardContent>
            </Card>
          </div>

          {/* PIN Validation Dialog */}
          {showPINDialog && (
            <PINValidation
              isOpen={showPINDialog}
              onClose={() => setShowPINDialog(false)}
              onValidate={handlePINValidation}
              title="Verify Current PIN"
              description="Please enter your current PIN to continue."
              actionText="Verify PIN"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Security;
