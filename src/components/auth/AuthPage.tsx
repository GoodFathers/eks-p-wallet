import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

enum AuthMode {
  LOGIN = "login",
  REGISTER = "register",
}

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate("/");
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">EKS-P Wallet</h1>
        <p className="text-gray-600">
          {mode === AuthMode.LOGIN
            ? "Sign in to access your digital wallet"
            : "Create an account to get started"}
        </p>
      </div>

      {mode === AuthMode.LOGIN ? (
        <LoginForm onSuccess={handleAuthSuccess} onRegisterClick={toggleMode} />
      ) : (
        <RegisterForm onSuccess={handleAuthSuccess} onLoginClick={toggleMode} />
      )}
    </div>
  );
};

export default AuthPage;
