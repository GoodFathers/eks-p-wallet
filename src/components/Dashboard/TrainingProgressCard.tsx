import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Progress } from "../ui/progress";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";

interface TrainingProgressCardProps {
  completedDays?: number;
  totalDays?: number;
  lastCompletedDate?: string;
  nextTrainingDate?: string;
  onClick?: () => void;
}

const TrainingProgressCard: React.FC<TrainingProgressCardProps> = ({
  completedDays = 35,
  totalDays = 99,
  lastCompletedDate = "2023-06-15",
  nextTrainingDate = "2023-06-16",
  onClick = () => {},
}) => {
  const progressPercentage = Math.round((completedDays / totalDays) * 100);
  const remainingDays = totalDays - completedDays;

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Training Progress</CardTitle>
          <button
            onClick={onClick}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Details
          </button>
        </div>
        <CardDescription>99-Day Training Program</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              {progressPercentage}% Complete
            </span>
            <span className="text-sm text-gray-500">
              {completedDays}/{totalDays} Days
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium">Completed</p>
              <p className="text-xl font-bold">{completedDays} Days</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Remaining</p>
              <p className="text-xl font-bold">{remainingDays} Days</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4 flex flex-col items-start">
        <div className="flex items-center gap-2 w-full">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          <div className="flex justify-between w-full">
            <div>
              <p className="text-xs text-gray-500">Last Completed</p>
              <p className="text-sm font-medium">
                {formatDate(lastCompletedDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Next Training</p>
              <p className="text-sm font-medium">
                {formatDate(nextTrainingDate)}
              </p>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrainingProgressCard;
