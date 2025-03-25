import React, { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Users,
  User,
  Search,
  RefreshCw,
} from "lucide-react";

interface NetworkMember {
  id: string;
  name: string;
  avatar: string;
  level: number;
  position: "left" | "right";
  joinDate: string;
  status: "active" | "inactive";
  children: NetworkMember[];
}

interface NetworkVisualizationProps {
  rootMember?: NetworkMember;
  maxLevels?: number;
  onMemberClick?: (member: NetworkMember) => void;
}

const generateMockNetworkData = (
  levels: number = 5,
  maxChildren: number = 2,
): NetworkMember => {
  const positions: ("left" | "right")[] = ["left", "right"];
  const statuses: ("active" | "inactive")[] = ["active", "inactive"];

  const generateMember = (
    currentLevel: number,
    position: "left" | "right",
  ): NetworkMember => {
    const id = Math.random().toString(36).substring(2, 9);
    return {
      id,
      name: `Member ${id.substring(0, 4).toUpperCase()}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
      level: currentLevel,
      position,
      joinDate: new Date(Date.now() - Math.random() * 10000000000)
        .toISOString()
        .split("T")[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      children:
        currentLevel < levels
          ? Array(Math.floor(Math.random() * maxChildren) + 1)
              .fill(null)
              .map((_, i) =>
                generateMember(
                  currentLevel + 1,
                  positions[i % positions.length],
                ),
              )
          : [],
    };
  };

  return {
    id: "root",
    name: "You",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=root`,
    level: 0,
    position: "left", // Root position doesn't matter
    joinDate: new Date().toISOString().split("T")[0],
    status: "active",
    children: [generateMember(1, "left"), generateMember(1, "right")],
  };
};

const NetworkNode: React.FC<{
  member: NetworkMember;
  isRoot?: boolean;
  onClick: (member: NetworkMember) => void;
}> = ({ member, isRoot = false, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex flex-col items-center cursor-pointer transition-transform hover:scale-105",
              isRoot ? "bg-primary/10 p-2 rounded-full" : "",
            )}
            onClick={() => onClick(member)}
          >
            <div
              className={cn(
                "relative w-12 h-12 rounded-full overflow-hidden border-2",
                member.status === "active"
                  ? "border-green-500"
                  : "border-gray-400",
                isRoot ? "w-16 h-16" : "",
              )}
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium mt-1 max-w-[80px] truncate text-center">
              {member.name}
            </span>
            {!isRoot && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full",
                  member.position === "left"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700",
                )}
              >
                {member.position}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-bold">{member.name}</p>
            <p>Level: {member.level}</p>
            <p>Position: {member.position}</p>
            <p>Joined: {member.joinDate}</p>
            <p>Status: {member.status}</p>
            <p>Downlines: {member.children.length}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const NetworkBranch: React.FC<{
  members: NetworkMember[];
  level: number;
  maxLevel: number;
  onMemberClick: (member: NetworkMember) => void;
}> = ({ members, level, maxLevel, onMemberClick }) => {
  if (level > maxLevel || members.length === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="w-px h-8 bg-gray-300"></div>
      <div className="flex gap-8">
        {members.map((member, index) => (
          <div key={member.id} className="flex flex-col items-center">
            <NetworkNode member={member} onClick={onMemberClick} />
            {member.children.length > 0 && (
              <NetworkBranch
                members={member.children}
                level={level + 1}
                maxLevel={maxLevel}
                onMemberClick={onMemberClick}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MemberDetailsDialog: React.FC<{
  member: NetworkMember | null;
  open: boolean;
  onClose: () => void;
}> = ({ member, open, onClose }) => {
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Member Details</DialogTitle>
          <DialogDescription>
            Detailed information about this network member.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">
                Level {member.level} • {member.position} position
              </p>
              <div
                className={cn(
                  "inline-block px-2 py-1 text-xs rounded-full mt-1",
                  member.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700",
                )}
              >
                {member.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Join Date</Label>
              <p className="text-sm font-medium">{member.joinDate}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Downlines</Label>
              <p className="text-sm font-medium">{member.children.length}</p>
            </div>
          </div>

          {member.children.length > 0 && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                Direct Downlines
              </Label>
              <div className="flex flex-wrap gap-2">
                {member.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center space-x-2 bg-muted p-2 rounded-md"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={child.avatar}
                        alt={child.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{child.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {child.position} • {child.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>View Full Profile</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  rootMember = generateMockNetworkData(5),
  maxLevels = 25,
  onMemberClick,
}) => {
  const [selectedMember, setSelectedMember] = useState<NetworkMember | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visibleLevels, setVisibleLevels] = useState(3);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("visualization");

  const networkRef = useRef<HTMLDivElement>(null);

  const handleMemberClick = useCallback(
    (member: NetworkMember) => {
      setSelectedMember(member);
      setDialogOpen(true);
      if (onMemberClick) onMemberClick(member);
    },
    [onMemberClick],
  );

  const handleZoomChange = useCallback((value: number[]) => {
    setZoomLevel(value[0]);
  }, []);

  const handleLevelChange = useCallback((value: number[]) => {
    setVisibleLevels(value[0]);
  }, []);

  const resetView = useCallback(() => {
    setVisibleLevels(3);
    setZoomLevel(100);
    setSearchQuery("");
  }, []);

  useEffect(() => {
    // This would be where you'd implement search functionality
    // For now, we'll just log the search query
    console.log("Searching for:", searchQuery);
  }, [searchQuery]);

  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Binary Network Visualization
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetView}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset View
          </Button>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <div className="px-4 pt-2 border-b">
          <TabsList>
            <TabsTrigger value="visualization">
              Network Visualization
            </TabsTrigger>
            <TabsTrigger value="list">Member List</TabsTrigger>
            <TabsTrigger value="stats">Network Stats</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="visualization"
          className="flex-1 flex flex-col p-0 m-0"
        >
          <div className="p-4 border-b flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="level-slider" className="whitespace-nowrap">
                Visible Levels:
              </Label>
              <Slider
                id="level-slider"
                min={1}
                max={Math.min(10, maxLevels)}
                step={1}
                value={[visibleLevels]}
                onValueChange={handleLevelChange}
                className="w-32"
              />
              <span className="text-sm font-medium">{visibleLevels}</span>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="zoom-slider" className="whitespace-nowrap">
                Zoom:
              </Label>
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
              <Slider
                id="zoom-slider"
                min={50}
                max={150}
                step={10}
                value={[zoomLevel]}
                onValueChange={handleZoomChange}
                className="w-32"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{zoomLevel}%</span>
            </div>

            <div className="flex-1 flex justify-end">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div
              ref={networkRef}
              className="flex justify-center min-w-max min-h-[500px] py-8"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: "top center",
              }}
            >
              <div className="flex flex-col items-center">
                <NetworkNode
                  member={rootMember}
                  isRoot={true}
                  onClick={handleMemberClick}
                />
                <NetworkBranch
                  members={rootMember.children}
                  level={1}
                  maxLevel={visibleLevels}
                  onMemberClick={handleMemberClick}
                />
              </div>
            </div>
          </ScrollArea>

          <div className="p-3 border-t bg-muted/50 text-sm text-muted-foreground">
            <div className="flex justify-between items-center">
              <div>
                Showing {visibleLevels} of {maxLevels} maximum levels
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span>Inactive</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="flex-1 p-0 m-0">
          <div className="p-4 text-center">
            <p className="text-muted-foreground">
              Member list view would be implemented here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="flex-1 p-0 m-0">
          <div className="p-4 text-center">
            <p className="text-muted-foreground">
              Network statistics would be displayed here
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <MemberDetailsDialog
        member={selectedMember}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </Card>
  );
};

export default NetworkVisualization;
