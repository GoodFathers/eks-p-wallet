import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Wallet,
  Network,
  Calendar,
  CreditCard,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Users,
  LayoutDashboard,
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  hasSubmenu?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({
  icon,
  label,
  href,
  active = false,
  hasSubmenu = false,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
      )}
      onClick={onClick}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="flex-1">{label}</span>
      {hasSubmenu && <ChevronRight className="w-4 h-4" />}
    </Link>
  );
};

interface SidebarProps {
  activePath?: string;
  onNavigate?: (path: string) => void;
}

const Sidebar = ({ activePath = "/", onNavigate }: SidebarProps) => {
  const { userRole, hasPermission } = useAuth();
  const handleNavigation = (path: string) => {
    if (path === "/logout") {
      // Handle logout logic here
      const handleLogout = async () => {
        try {
          // Import dynamically to avoid circular dependencies
          const { supabase } = await import("@/lib/supabase");
          await supabase.auth.signOut();
          // Redirect to auth page after logout
          window.location.href = "/auth";
        } catch (error) {
          console.error("Logout error:", error);
        }
      };
      handleLogout();
    } else if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="w-[280px] h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">EKS-P Wallet</h1>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <SidebarItem
          icon={<Home className="w-full h-full" />}
          label="Dasbor"
          href="/"
          active={activePath === "/"}
          onClick={() => handleNavigation("/")}
        />
        <SidebarItem
          icon={<Wallet className="w-full h-full" />}
          label="Saldo"
          href="/balance"
          active={activePath === "/balance"}
          onClick={() => handleNavigation("/balance")}
        />
        <SidebarItem
          icon={<Network className="w-full h-full" />}
          label="Jaringan Biner"
          href="/network"
          active={activePath === "/network"}
          onClick={() => handleNavigation("/network")}
        />
        <SidebarItem
          icon={<Calendar className="w-full h-full" />}
          label="Pelacak Pelatihan"
          href="/training"
          active={activePath === "/training"}
          onClick={() => handleNavigation("/training")}
        />
        <SidebarItem
          icon={<CreditCard className="w-full h-full" />}
          label="Layanan PPOB"
          href="/ppob"
          active={activePath === "/ppob"}
          onClick={() => handleNavigation("/ppob")}
        />
        <SidebarItem
          icon={<Shield className="w-full h-full" />}
          label="Pengaturan Keamanan"
          href="/security"
          active={activePath === "/security"}
          onClick={() => handleNavigation("/security")}
        />

        {/* Admin-only menu items */}
        {hasPermission(["super_admin", "admin"]) && (
          <>
            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
              Area Admin
            </div>
            <SidebarItem
              icon={<Users className="w-full h-full" />}
              label="Manajemen Pengguna"
              href="/admin/users"
              active={activePath === "/admin/users"}
              onClick={() => handleNavigation("/admin/users")}
            />
          </>
        )}

        {/* Super Admin-only menu items */}
        {hasPermission(["super_admin"]) && (
          <>
            <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase">
              Super Admin
            </div>
            <SidebarItem
              icon={<LayoutDashboard className="w-full h-full" />}
              label="Pengaturan Sistem"
              href="/admin/system"
              active={activePath === "/admin/system"}
              onClick={() => handleNavigation("/admin/system")}
            />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <SidebarItem
          icon={<Settings className="w-full h-full" />}
          label="Pengaturan"
          href="/settings"
          active={activePath === "/settings"}
          onClick={() => handleNavigation("/settings")}
        />
        <SidebarItem
          icon={<LogOut className="w-full h-full" />}
          label="Keluar"
          href="/logout"
          onClick={() => handleNavigation("/logout")}
        />
      </div>
    </div>
  );
};

export default Sidebar;
