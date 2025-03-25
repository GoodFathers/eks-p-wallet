import React, { useState } from "react";
import { LockIcon, ShieldCheckIcon, XIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PINValidationProps {
  isOpen?: boolean;
  onClose?: () => void;
  onValidate?: (pin: string) => Promise<boolean>;
  title?: string;
  description?: string;
  actionText?: string;
}

const PINValidation = ({
  isOpen = true,
  onClose = () => {},
  onValidate = async () => true,
  title = "PIN Validation Required",
  description = "Please enter your PIN to continue with this transaction.",
  actionText = "Validate",
}: PINValidationProps) => {
  const [pin, setPin] = useState<string>("");
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setPin(value);
      setError("");
    }
  };

  const handleValidate = async () => {
    if (pin.length < 6) {
      setError("PIN must be 6 digits");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const isValid = await onValidate(pin);
      if (isValid) {
        onClose();
      } else {
        setError("Invalid PIN. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleValidate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="relative">
            <Input
              type={showPin ? "text" : "password"}
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={handlePinChange}
              onKeyDown={handleKeyDown}
              className="pr-10 text-center text-lg tracking-widest"
              maxLength={6}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <LockIcon className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <div className="mt-2 flex items-center text-sm text-red-500">
              <XIcon className="mr-1 h-4 w-4" />
              {error}
            </div>
          )}

          <div className="mt-4 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-3 w-3 rounded-full ${pin.length > index ? "bg-blue-500" : "bg-gray-200"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleValidate}
            disabled={isValidating || pin.length < 6}
            className="w-full sm:w-auto"
          >
            {isValidating ? "Validating..." : actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PINValidation;
