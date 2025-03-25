import React from "react";
import { Bell, Settings, User, Search, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
}

const Header = ({
  userName = "John Doe",
  userAvatar = "",
  notificationCount = 3,
}: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 w-full">
      <div className="flex items-center w-1/3">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Help Button */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
                  variant="destructive"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem className="p-4 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Balance Update</span>
                  <span className="text-sm text-gray-500">
                    Your automatic balance has increased by Rp. 114.23
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    2 minutes ago
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">New Network Member</span>
                  <span className="text-sm text-gray-500">
                    User123 has joined your left network leg
                  </span>
                  <span className="text-xs text-gray-400 mt-1">1 hour ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-4 cursor-pointer">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">Training Reminder</span>
                  <span className="text-sm text-gray-500">
                    Don't forget to complete today's training module
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    3 hours ago
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 cursor-pointer text-center text-primary-600 font-medium">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 rounded-full p-1 pl-1 pr-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
