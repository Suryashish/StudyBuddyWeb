// components/dashboard-content.tsx
import {
  Search,
  Bell,
  User,
  Plus,
  Clock,
  Book,
  CalendarDays,
  BarChartBig,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from '@radix-ui/react-progress';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" //Ensure it is imported

interface Task {
  dateofthetask: string;
  starttimeforslotstart: string;
  endtimeforslotend: string;
  taskname: string;
  taskId: string;
  status?: string;
}
export function DashboardContent() {
  const URL = process.env.NEXT_PUBLIC_VITE_BE_URL;

  const [examDate, setExamDate] = useState('');
  const [subjects, setSubjects] = useState([{ name: '', syllabus: '' }]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshTasks, setRefreshTasks] = useState(false);

  const [learningScore, setLearningScore] = useState(0);
  const [scheduleAdherence, setScheduleAdherence] = useState(0);
  const [topicsCovered, setTopicsCovered] = useState(0);
  const [studyTimeToday, setStudyTimeToday] = useState(0);
  const [userName, setUserName] = useState("User"); // Default name

  useEffect(() => {
    const fetchTasks = async () => {
      if (id) {
        try {
          const response = await axios.get(`${URL}/get/${id}`);
          console.log(response.data)
          if (response.data) {
            // Sort the tasks here
            const sortedTasks = [...response.data.taskSchedule].sort((a, b) => {
              if (a.status === "completed" && b.status !== "completed") {
                return 1; // Move 'a' (completed) to the bottom
              } else if (a.status !== "completed" && b.status === "completed") {
                return -1; // Move 'b' (completed) to the bottom
              } else {
                return 0; // Keep original order if statuses are the same
              }
            });
            setTasks(sortedTasks);
            setUserName(response.data.username || "User"); // Set username
          }
        } catch (error) {
          console.error("Error fetching tasks:", error);
          toast.error("Failed to load tasks.");
        }
      }
    };

    fetchTasks();
  }, [id, refreshTasks]);

  useEffect(() => {
    // Calculate Statistics
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === "completed");

    // Calculate Learning Score (example: percentage of completed tasks)
    const newLearningScore = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
    setLearningScore(newLearningScore);

    // Calculate Schedule Adherence (Schedule Completion Percentage)
    let newScheduleAdherence = 0;
    if (totalTasks > 0) {
      newScheduleAdherence = Math.round((completedTasks.length / totalTasks) * 100);
    }
    setScheduleAdherence(newScheduleAdherence);

    // Calculate Topics Covered (example: number of completed tasks)
    setTopicsCovered(completedTasks.length);

    const newStudyTimeToday = completedTasks.reduce((total, task) => {
      // Ensure starttimeforslotstart and endtimeforslotend are defined and valid strings before using them
      const startTimeStr = task.starttimeforslotstart || "00:00"; // Use a default value if undefined
      const endTimeStr = task.endtimeforslotend || "00:00"; // Use a default value if undefined

      // Create Date objects using a consistent format. We are using a dummy date since only time is important
      const startTime = new Date(`2024-01-01 ${startTimeStr}`); // Using a valid date format for parsing
      const endTime = new Date(`2024-01-01 ${endTimeStr}`); // Using a valid date format for parsing

      // Check if the Date objects are valid before calculating the duration
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error("Invalid start or end time:", task.starttimeforslotstart, task.endtimeforslotend);
        return total; // Skip this task if start or end time is invalid
      }

      // Calculate duration in minutes
      const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

      console.log(`Task: ${task.taskname}, Duration: ${durationMinutes}`);  // Log each task and its duration
      return total + durationMinutes; // Add up the durations
    }, 0); // Start at 0, total is in minutes and not hours

    // Convert study time to hours by dividing by 60
    const studyTimeInHours = (newStudyTimeToday / 60).toFixed(2); //to fixed is to make it 2 decimal value

    console.log("Calculated study time:", studyTimeInHours);  // See the final result
    setStudyTimeToday(Number(studyTimeInHours));

  }, [tasks]);

  const handleSubjectChange = (index: number, field: string, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index][field as keyof typeof newSubjects[number]] = value;
    setSubjects(newSubjects);
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', syllabus: '' }]);
  };

  const handleFileChange = (e: any) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // const formData = new FormData();
      // formData.append("examDate", examDate);
      // formData.append("subjects", JSON.stringify(subjects));
      // // if (pdfFile) {
      // //   formData.append("pdfFile", pdfFile);
      // // }
      const SubjectsArray = JSON.stringify(subjects)
      console.log(JSON.stringify(subjects))
      setLoading(true); // Show loader

      const response = await axios.post(`${URL}/query/${id}`, {examDate, SubjectsArray}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Server Response:", response.data);

      let aiResponse = response.data;

      // Check if response is a string and parse it to an array
      if (typeof aiResponse === "string") {
        try {
          // Parse the JSON string
          aiResponse = JSON.parse(aiResponse);
          console.log("Parsed AI Response:", aiResponse);
        } catch (err) {
          console.error("Error parsing AI response:", err);
          toast.error("Error parsing timetable data. Please try again later.");
          return;
        }
      }

      // Step 3: Ensure the AI response is an array of objects
      if (!Array.isArray(aiResponse)) {
        toast.error("Invalid timetable format received. Please try again later.");
        setLoading(false); // Hide loader
        return;
      }

      const tasksWithIds = aiResponse.map((task: any) => ({
        ...task,
        taskId: Math.random().toString(36).substring(2, 15), // Generate a unique ID
        status: "pending", // Set default status
      }));


      const saveResponse = await axios.post(`${URL}/save/${id}`, { taskSchedule: tasksWithIds, subjects });
      console.log("Saved Task Schedule:", saveResponse.data.taskSchedule);
      toast.success("Timetable successfully saved!");
      setRefreshTasks(prev => !prev); // Trigger task refresh after saving
      window.location.reload()

    } catch (error: any) {
      console.error("Error submitting query:", error);
      toast.error(`Failed to fetch timetable. ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    try {
      await axios.put(`${URL}/update-task-status/${id}`, {
        taskId: taskId,
        status: "completed",
      });
      toast.success("Task completed!");
      setRefreshTasks(prev => !prev); // Refresh tasks after status update
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status.");
    }
  };

  const userNameInitial = userName ? userName.charAt(0).toUpperCase() : "?";

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        {/* Search Bar */}
        <div className="relative flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>

        {/* Header Right Icons */}
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              2
            </span>
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>{userNameInitial}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-semibold leading-none tracking-tight">Welcome, {userName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your AI study assistant will prepare today's learning plan
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white dark:text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" /> Start Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Build your study plan</DialogTitle>
                <DialogDescription>
                  Create a personalized plan based on your needs.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Exam Date
                    </Label>
                    <Input id="name" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="col-span-3" />
                  </div>

                  {subjects.map((subject, index) => (
                    <div key={index} className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor={`subject-${index}`} className="text-right">
                        Subject {index + 1}
                      </Label>
                      <div className="col-span-3 space-y-2">
                        <Input
                          type="text"
                          id={`subject-${index}-name`}
                          placeholder="Subject Name"
                          value={subject.name}
                          onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        />
                        <Textarea
                          id={`subject-${index}-syllabus`}
                          placeholder="Topics to cover..."
                          value={subject.syllabus}
                          onChange={(e) => handleSubjectChange(index, 'syllabus', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addSubject}>
                    Add Subject
                  </Button>
                  {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="pdf" className="text-right">
                      Upload PDF
                    </Label>
                    <Input type="file" id="pdf" onChange={handleFileChange} className="col-span-3" />
                  </div> */}
                </div>
                <Button type="submit" disabled={isLoading}> {isLoading ? "Submitting..." : "Submit"}</Button>

              </form>

            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          {/* <TabsList className="grid w-full grid-cols-4 md:w-[500px]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
          </TabsList> */}

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards Grid - Added dark mode styles */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Study Time Today Card */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription>Study Time Today</CardDescription>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-4xl">{studyTimeToday} hours</CardTitle>
                </CardHeader> <CardContent>
                  <div className="text-xs text-muted-foreground">+12% from yesterday</div>
                  <div className="mt-2">
                    <Progress value={60} aria-label="Study time progress" className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Topics Covered Card */}
              <Card className="bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/60">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-purple-800 dark:text-purple-200">Topics Covered</CardDescription>
                    <Book className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                  </div>
                  <CardTitle className="text-4xl text-purple-900 dark:text-purple-100">{topicsCovered} topics</CardTitle>
                </CardHeader> <CardContent>
                  <div className="text-xs text-purple-700 dark:text-purple-300">3 new topics today</div>
                  <div className="mt-2">
                    <Progress value={80} aria-label="Topics covered progress" className="h-2 [&>*]:bg-purple-600 dark:[&>*]:bg-purple-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Adherence Card */}
              <Card className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/60">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-yellow-800 dark:text-yellow-200">Schedule Adherence</CardDescription>
                    <CalendarDays className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                  </div>
                  <CardTitle className="text-4xl text-yellow-900 dark:text-yellow-100">{scheduleAdherence}%</CardTitle>
                </CardHeader> <CardContent>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">+5% from last week</div>
                  <div className="mt-2">
                    <Progress value={scheduleAdherence} aria-label="Schedule adherence progress" className="h-2 [&>*]:bg-yellow-600 dark:[&>*]:bg-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Learning Score Card */}
              <Card className="bg-purple-100/70 dark:bg-purple-900/20 border-purple-200/70 dark:border-purple-800/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-purple-800 dark:text-purple-200">Learning Score</CardDescription>
                    <BarChartBig className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                  </div>
                  <CardTitle className="text-4xl text-purple-900 dark:text-purple-100">{learningScore}</CardTitle>
                </CardHeader> <CardContent>
                  <div className="text-xs text-purple-700 dark:text-purple-300">+3 points this week</div>
                  <div className="mt-2">
                    <Progress value={learningScore} aria-label="Learning score progress" className="h-2 [&>*]:bg-purple-600 dark:[&>*]:bg-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Tasks Section */}
            <div className="mt-8 grid gap-4 ">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Upcoming Tasks</CardTitle>
                  <CardDescription>Your AI-optimized study schedule for today.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{task.taskname}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.dateofthetask} - {task.starttimeforslotstart} - {task.endtimeforslotend}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: {task.status}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTaskComplete(task.taskId)}
                          disabled={task.status === "completed"}
                        >
                          {task.status === "completed" ? "Completed" : "Complete"}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No tasks scheduled yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Placeholder Content for other tabs */}
          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
              <CardContent><p>Schedule content goes here...</p></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}