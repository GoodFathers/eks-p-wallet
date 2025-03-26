import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to IDR
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to Indonesian format
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Hash PIN (simple hash for demo purposes)
export function hashPIN(pin: string): string {
  // In a real app, use a proper hashing algorithm
  // This is just for demonstration
  return btoa(pin + "salt");
}

// Validate PIN format
export function validatePIN(pin: string): boolean {
  // PIN must be 6 digits
  return /^\d{6}$/.test(pin);
}

// Get status badge variant
export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
}

// Translate transaction type to Indonesian
export function translateTransactionType(type: string): string {
  const translations: Record<string, string> = {
    deposit: "Setoran",
    withdrawal: "Penarikan",
    transfer: "Transfer",
    payment: "Pembayaran",
    reward: "Hadiah",
  };

  return translations[type] || type;
}

// Translate status to Indonesian
export function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    completed: "Selesai",
    pending: "Tertunda",
    failed: "Gagal",
  };

  return translations[status] || status;
}
