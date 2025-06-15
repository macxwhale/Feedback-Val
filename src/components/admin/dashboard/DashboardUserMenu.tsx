
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthWrapper";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

export const DashboardUserMenu: React.FC = () => {
  const { user, isAdmin, isOrgAdmin, signOut } = useAuth();

  let role = "Member";
  if (isAdmin) role = "Admin";
  else if (isOrgAdmin) role = "Org Admin";

  const handleLogout = async () => {
    await signOut();
    toast.success("Successfully signed out.");
  };

  return (
    <div className="flex items-center gap-3 ml-3">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-sunset-50 dark:bg-sunset-900/30 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
        <User className="w-4 h-4 text-orange-500" />
        <div className="flex flex-col text-xs text-right">
          <span className="font-semibold text-gray-800 dark:text-white">
            {user?.email || "—"}
          </span>
          <span className="text-gray-500 dark:text-gray-400 capitalize">
            {role}
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        title="Sign out"
        onClick={handleLogout}
        className="rounded-full"
      >
        <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </Button>
    </div>
  );
};
