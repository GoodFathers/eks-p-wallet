import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, UserPlus, BarChart3 } from "lucide-react";

interface NetworkStats {
  totalMembers: number;
  leftLegMembers: number;
  rightLegMembers: number;
  activeMembers: number;
  newMembersToday: number;
  networkDepth: number;
}

interface BinaryNetworkPreviewProps {
  stats?: NetworkStats;
  onViewFullNetwork?: () => void;
}

const BinaryNetworkPreview = ({
  stats = {
    totalMembers: 128,
    leftLegMembers: 75,
    rightLegMembers: 53,
    activeMembers: 98,
    newMembersToday: 5,
    networkDepth: 8,
  },
  onViewFullNetwork = () => console.log("View full network clicked"),
}: BinaryNetworkPreviewProps) => {
  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Binary Network
        </CardTitle>
        <CardDescription>
          Your network structure with left and right legs
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* Network Visualization Preview */}
          <div className="relative h-32 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold z-10">
              You
            </div>
            <div className="absolute w-full top-20">
              <div className="flex justify-between px-8">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gray-300 mb-2"></div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-xs font-medium">
                    {stats.leftLegMembers}
                  </div>
                  <div className="text-xs mt-1 font-medium">Left</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-8 bg-gray-300 mb-2"></div>
                  <div className="w-10 h-10 rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-xs font-medium">
                    {stats.rightLegMembers}
                  </div>
                  <div className="text-xs mt-1 font-medium">Right</div>
                </div>
              </div>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Total Members</div>
                <div className="text-lg font-bold">{stats.totalMembers}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <UserPlus className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">New Today</div>
                <div className="text-lg font-bold">{stats.newMembersToday}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm font-medium">Active Members</div>
                <div className="text-lg font-bold">{stats.activeMembers}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
              <ChevronRight className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm font-medium">Network Depth</div>
                <div className="text-lg font-bold">
                  {stats.networkDepth} levels
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button onClick={onViewFullNetwork} className="w-full">
          View Full Network
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BinaryNetworkPreview;
