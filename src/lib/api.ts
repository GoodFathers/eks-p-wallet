import { supabase } from "./supabase";

// Function to get user balance
export const getUserBalance = async () => {
  try {
    // Call the update_balance edge function to get the latest balance
    const { data, error } = await supabase.functions.invoke("update_balance", {
      method: "POST",
    });

    if (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }

    return (
      data?.data || {
        locked_balance: 1500000,
        automatic_balance: 275000,
        growth_rate: 3.1731,
      }
    );
  } catch (error) {
    console.error("Error in getUserBalance:", error);
    // Return default values if there's an error
    return {
      locked_balance: 1500000,
      automatic_balance: 275000,
      growth_rate: 3.1731,
    };
  }
};

// Function to get user transactions
export const getUserTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserTransactions:", error);
    // Return mock data if there's an error
    return [
      {
        id: "1",
        transaction_type: "deposit",
        amount: 500000,
        description: "Setoran awal",
        status: "completed",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        transaction_type: "withdrawal",
        amount: 100000,
        description: "Penarikan tunai",
        status: "completed",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "3",
        transaction_type: "payment",
        amount: 150000,
        description: "Pembayaran listrik",
        status: "pending",
        created_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }
};

// Function to get training progress
export const getTrainingProgress = async () => {
  try {
    const { data, error } = await supabase
      .from("training_progress")
      .select("*")
      .order("day_number", { ascending: true });

    if (error) {
      console.error("Error fetching training progress:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTrainingProgress:", error);
    // Return mock data if there's an error
    return [];
  }
};

// Function to get PPOB services
export const getPPOBServices = async () => {
  try {
    const { data, error } = await supabase.from("ppob_services").select("*");

    if (error) {
      console.error("Error fetching PPOB services:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getPPOBServices:", error);
    // Return mock data if there's an error
    return [
      {
        id: "1",
        service_type: "electricity",
        name: "Listrik",
        description: "Pembayaran tagihan listrik",
      },
      {
        id: "2",
        service_type: "water",
        name: "Air",
        description: "Pembayaran tagihan air",
      },
      {
        id: "3",
        service_type: "internet",
        name: "Internet",
        description: "Pembayaran tagihan internet",
      },
      {
        id: "4",
        service_type: "mobile",
        name: "Pulsa",
        description: "Isi ulang pulsa",
      },
    ];
  }
};

// Function to get user network
export const getUserNetwork = async () => {
  try {
    const { data, error } = await supabase.from("network_members").select("*");

    if (error) {
      console.error("Error fetching user network:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error in getUserNetwork:", error);
    // Return mock data if there's an error
    return [];
  }
};

// Function to verify user PIN
export const verifyUserPIN = async (pin: string) => {
  try {
    // For demo purposes, always return true for PIN 123456
    return pin === "123456";
  } catch (error) {
    console.error("Error in verifyUserPIN:", error);
    return false;
  }
};
