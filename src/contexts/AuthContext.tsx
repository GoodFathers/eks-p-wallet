import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

type UserRole = "super_admin" | "admin" | "visitor";

type UserWithRole = User & {
  role?: UserRole;
  roleId?: string;
};

type AuthContextType = {
  session: Session | null;
  user: UserWithRole | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);

      if (session?.user) {
        const currentUser = session.user as UserWithRole;
        setUser(currentUser);

        // Fetch user role from database
        await fetchUserRole(currentUser.id);
      } else {
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session?.user) {
        const currentUser = session.user as UserWithRole;
        setUser(currentUser);

        // Fetch user role from database
        await fetchUserRole(currentUser.id);
      } else {
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role_id, roles:role_id(id, name)")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
        return;
      }

      if (data && data.roles) {
        const roleName = data.roles.name as UserRole;
        setUserRole(roleName);

        // Update user object with role information
        setUser((prevUser) => {
          if (prevUser) {
            return {
              ...prevUser,
              role: roleName,
              roleId: data.role_id,
            };
          }
          return prevUser;
        });
      } else {
        // Default to visitor if no role is assigned
        setUserRole("visitor");
      }
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      setUserRole(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check if email and password are provided
      if (!email || !password) {
        throw new Error("Email dan password diperlukan");
      }

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase auth error:", error);

        // Provide more user-friendly error messages
        if (error.message.includes("Invalid login credentials")) {
          throw new Error(
            "Email atau password salah. Silakan coba lagi atau buat pengguna uji coba terlebih dahulu.",
          );
        } else {
          throw error;
        }
      }

      // Fetch user role immediately after successful login
      if (data.user) {
        await fetchUserRole(data.user.id);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (signUpError) throw signUpError;

    // After signup, create a user record in the users table
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      // Get the visitor role ID
      const { data: roleData } = await supabase
        .from("roles")
        .select("id")
        .eq("name", userData.role || "visitor")
        .single();

      const roleId = roleData?.id;

      const { error: profileError } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        full_name: userData.full_name || "",
        avatar_url: userData.avatar_url || "",
        role_id: roleId,
      });
      if (profileError) throw profileError;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  // Function to check if user has required role permissions
  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!userRole) return false;

    // Super admin has access to everything
    if (userRole === "super_admin") return true;

    // Check if user's role is in the required roles list
    return requiredRoles.includes(userRole);
  };

  const value = {
    session,
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
