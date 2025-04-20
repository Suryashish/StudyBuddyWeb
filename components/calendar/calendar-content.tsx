"use client";

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Search, Filter, Calendar as CalendarIcon, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Import styles
import "react-calendar/dist/Calendar.css";
import "./calendar-styles.css";

// Define interfaces for type safety
interface Task {
  id: number;
  title: string;
  category: "quiz" | "exam" | "assignment" | "project" | "group";
  completed: boolean;
}

type TaskRecord = Record<string, Task[]>;

// Sample task data - in a real app this would come from an API or database
const sampleTasks: TaskRecord = {
  "2025-04-15": [
    { id: 1, title: "Data Structures Quiz", category: "quiz", completed: false },
    { id: 2, title: "Algorithm Study Group", category: "group", completed: true },
  ],
  "2025-04-20": [
    { id: 3, title: "Math Assignment Due", category: "assignment", completed: false },
    { id: 4, title: "Physics Lab Report", category: "assignment", completed: false },
  ],
  "2025-04-22": [
    { id: 5, title: "Programming Project Deadline", category: "project", completed: false },
  ],
  "2025-04-25": [
    { id: 6, title: "Chemistry Exam", category: "exam", completed: false },
    { id: 7, title: "Study Group Session", category: "group", completed: false },
  ],
  "2025-05-01": [
    { id: 8, title: "Term Paper Due", category: "assignment", completed: false },
  ],
};

// Category to color mapping
const categoryColors = {
  quiz: "bg-purple-500",
  exam: "bg-red-500",
  assignment: "bg-blue-500",
  project: "bg-green-500",
  group: "bg-yellow-500",
};

export default function CalendarContent() {
  // Today's date for our application context (April 20, 2025)
  const today = new Date("2025-04-20");
  
  const [value, setValue] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [calView, setCalView] = useState<"month" | "week" | "day">("month");
  const [taskFilter, setTaskFilter] = useState("all");
  
  // Once mounted on client, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Format the date as YYYY-MM-DD for comparing with our task data
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    const dateString = formatDate(date);
    return sampleTasks[dateString] || [];
  };

  // Handler for when a date is clicked
  const handleDateClick = (date: Date): void => {
    setValue(date);
    setSelectedDate(date);
  };

  // Toggle theme between light and dark mode
  const toggleTheme = (): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Tile content for the calendar - displays task indicators
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    // Only add content to month view and dates
    if (view !== "month") return null;

    const dateStr = formatDate(date);
    const tasks = sampleTasks[dateStr];

    if (!tasks || tasks.length === 0) return null;

    return (
      <div className="task-indicators">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`task-dot ${categoryColors[task.category]} ${task.completed ? "opacity-50" : ""}`}
          />
        ))}
      </div>
    );
  };

  // Navigate to today's date
  const goToToday = () => {
    setValue(today);
    setSelectedDate(today);
  };
  
  // Next month/week handler
  const handleNextPeriod = () => {
    const newDate = new Date(value);
    if (calView === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setValue(newDate);
  };
  
  // Previous month/week handler
  const handlePrevPeriod = () => {
    const newDate = new Date(value);
    if (calView === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setValue(newDate);
  };

  // Get tasks for the selected date
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // If not mounted yet, don't render to avoid hydration mismatch
  if (!mounted) {
    return <div className="flex justify-center items-center h-[calc(100vh-200px)]">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-3/5 flex flex-col h-[calc(100vh-200px)]">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" onClick={handlePrevPeriod}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleNextPeriod}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">
                  {value.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={calView} 
                  onValueChange={(val: string) => setCalView(val as "month" | "week" | "day")}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Theme toggle button */}
                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <Calendar
              onChange={handleDateClick}
              value={value}
              tileContent={tileContent}
              className={`${theme === "dark" ? "calendar-dark" : "calendar-light"} h-full`}
              view={calView}
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="md:w-2/5">
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {selectedDate ? (
                  <>Tasks for {selectedDate.toLocaleDateString()}</>
                ) : (
                  <>Tasks</>
                )}
              </CardTitle>
              <Button size="sm" variant="outline" className="gap-1">
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-8" />
              </div>
              <Select 
                value={taskFilter} 
                onValueChange={setTaskFilter}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="quiz">Quizzes</SelectItem>
                  <SelectItem value="exam">Exams</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                  <SelectItem value="project">Projects</SelectItem>
                  <SelectItem value="group">Study Groups</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks
                  .filter(task => taskFilter === "all" || task.category === taskFilter)
                  .map(task => (
                    <div 
                      key={task.id} 
                      className={`p-3 rounded-md border ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      } ${task.completed ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <Badge 
                            className={`mt-1 ${categoryColors[task.category]}`}
                            variant="outline"
                          >
                            {task.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.completed ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {selectedDate ? "No tasks for this date." : "Select a date to view tasks."}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card className="mt-4">
          <CardContent className="p-4">
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-2">
                  {Object.entries(sampleTasks)
                    .filter(([dateStr]) => new Date(dateStr) >= today)
                    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                    .slice(0, 3)
                    .map(([dateStr, tasks]) => {
                      const date = new Date(dateStr);
                      return tasks.filter(task => !task.completed).map(task => (
                        <div 
                          key={task.id}
                          className={`p-2 rounded-md border ${
                            theme === "dark" ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{task.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {date.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ));
                    }).flat()}
                </div>
              </TabsContent>
              
              <TabsContent value="completed">
                <div className="space-y-2">
                  {Object.entries(sampleTasks)
                    .map(([dateStr, tasks]) => {
                      const date = new Date(dateStr);
                      return tasks.filter(task => task.completed).map(task => (
                        <div 
                          key={task.id}
                          className={`p-2 rounded-md border ${
                            theme === "dark" ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{task.title}</span>
                            <span className="text-sm text-muted-foreground">
                              {date.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ));
                    }).flat()}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
