import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle, Clock, Info } from "lucide-react";

interface TrainingDay {
  day: number;
  date: Date;
  completed: boolean;
  title: string;
  description: string;
}

interface TrainingCalendarProps {
  completedDays?: number;
  totalDays?: number;
  trainingDays?: TrainingDay[];
}

const TrainingCalendar = ({
  completedDays = 35,
  totalDays = 99,
  trainingDays = Array.from({ length: 99 }, (_, i) => ({
    day: i + 1,
    date: new Date(Date.now() + (i - 34) * 24 * 60 * 60 * 1000),
    completed: i < 35,
    title: `Training Day ${i + 1}`,
    description: `Complete your training activities for day ${i + 1} to earn rewards.`,
  })),
}: TrainingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const progress = Math.round((completedDays / totalDays) * 100);
  const remainingDays = totalDays - completedDays;

  // Function to find if a date has a training day
  const findTrainingDay = (date: Date): TrainingDay | undefined => {
    return trainingDays.find((day) => {
      const dayDate = new Date(day.date);
      return (
        dayDate.getDate() === date.getDate() &&
        dayDate.getMonth() === date.getMonth() &&
        dayDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Handle date selection in calendar
  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const day = findTrainingDay(date);
      setSelectedDay(day || null);
    } else {
      setSelectedDay(null);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">
              99-Day Training Program
            </CardTitle>
            <CardDescription className="text-blue-100 mt-1">
              Complete daily training activities to unlock rewards
            </CardDescription>
          </div>
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "calendar" | "list")}
            className="w-[200px]"
          >
            <TabsList className="bg-blue-800/40">
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700"
              >
                <Clock className="mr-2 h-4 w-4" />
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Training Progress
            </span>
            <span className="text-sm font-medium text-gray-600">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span>{completedDays} days completed</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-orange-500 mr-1" />
              <span>{remainingDays} days remaining</span>
            </div>
          </div>
        </div>

        <Tabs value={view} className="w-full">
          <TabsContent value="calendar" className="mt-0">
            <div className="grid md:grid-cols-7 gap-6">
              <div className="md:col-span-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelect}
                  className="rounded-md border"
                  modifiers={{
                    completed: trainingDays
                      .filter((day) => day.completed)
                      .map((day) => day.date),
                    upcoming: trainingDays
                      .filter((day) => !day.completed)
                      .map((day) => day.date),
                  }}
                  modifiersClassNames={{
                    completed: "bg-green-100 text-green-800 font-bold",
                    upcoming: "bg-blue-50 text-blue-800",
                  }}
                  components={{
                    DayContent: ({ date, ...props }) => {
                      const trainingDay = findTrainingDay(date);
                      return (
                        <div
                          {...props}
                          className={cn(
                            "relative flex h-9 w-9 items-center justify-center",
                            trainingDay?.completed &&
                              "after:absolute after:bottom-1 after:right-1 after:h-1.5 after:w-1.5 after:rounded-full after:bg-green-500",
                          )}
                        >
                          {date.getDate()}
                        </div>
                      );
                    },
                  }}
                />
              </div>
              <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
                {selectedDay ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {selectedDay.title}
                      </h3>
                      <Badge
                        variant={selectedDay.completed ? "success" : "outline"}
                        className={
                          selectedDay.completed
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {selectedDay.completed ? "Completed" : "Upcoming"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {selectedDay.description}
                    </p>
                    {selectedDay.completed ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span>You've completed this training day!</span>
                      </div>
                    ) : (
                      <Button
                        disabled={new Date(selectedDay.date) > new Date()}
                        className="w-full"
                      >
                        Start Training
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <Info className="h-12 w-12 text-blue-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">
                      Select a Training Day
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Click on a date in the calendar to view training details
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {trainingDays.slice(0, 10).map((day) => (
                <div
                  key={day.day}
                  className={cn(
                    "p-4 rounded-lg border flex justify-between items-center cursor-pointer hover:bg-gray-50",
                    day.completed
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200",
                  )}
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedDay(day);
                    setView("calendar");
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center mr-4",
                        day.completed
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800",
                      )}
                    >
                      {day.day}
                    </div>
                    <div>
                      <h4 className="font-medium">{day.title}</h4>
                      <p className="text-sm text-gray-500">
                        {day.date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={day.completed ? "success" : "outline"}
                    className={
                      day.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {day.completed ? "Completed" : "Upcoming"}
                  </Badge>
                </div>
              ))}
              {trainingDays.length > 10 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-2">
                      View All {totalDays} Training Days
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>All Training Days</DialogTitle>
                      <DialogDescription>
                        Complete all {totalDays} days to unlock your rewards
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      {trainingDays.map((day) => (
                        <div
                          key={day.day}
                          className={cn(
                            "p-3 rounded-lg border flex justify-between items-center",
                            day.completed
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200",
                          )}
                        >
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center mr-3 text-sm",
                                day.completed
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800",
                              )}
                            >
                              {day.day}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">
                                {day.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {day.date.toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={day.completed ? "success" : "outline"}
                            className={
                              day.completed
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {day.completed ? "Completed" : "Upcoming"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrainingCalendar;
