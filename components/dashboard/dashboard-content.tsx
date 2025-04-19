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

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle'; // <--- Import ThemeToggle

export function DashboardContent() {
  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
         {/* Search Bar */}
         <div className="relative flex-1 md:grow-0">
            {/* ... search input ... */}
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>

        {/* Header Right Icons */}
        <div className="ml-auto flex items-center gap-2 md:gap-4"> {/* Adjusted gap slightly */}
           <ThemeToggle /> {/* <--- Add the toggle button here */}
          <Button variant="outline" size="icon" className="h-8 w-8 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              2
            </span>
            <span className="sr-only">Toggle notifications</span>
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <User className="h-4 w-4" />
            <span className="sr-only">User Profile</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col gap-6 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-semibold leading-none tracking-tight">Welcome, Ricky</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your AI study assistant will prepare today's learning plan
            </p>
          </div>
          {/* Use brand color from theme, falls back to specific color if needed */}
          <Button className="bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white dark:text-primary-foreground">
            <Plus className="mr-2 h-4 w-4" /> Start Studying
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-[500px]">
            {/* Adjusted active state for better dark mode contrast */}
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Overview
            </TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards Grid - Added dark mode styles */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Study Time Today Card */}
              <Card> {/* Default Card styles should adapt */}
                <CardHeader className="pb-2">
                   {/* ... Card Header Content ... */}
                   <div className="flex items-center justify-between">
                     <CardDescription>Study Time Today</CardDescription>
                     <Clock className="h-4 w-4 text-muted-foreground" />
                   </div>
                   <CardTitle className="text-4xl">2.5 hours</CardTitle>
                </CardHeader>                <CardContent>
                  <div className="text-xs text-muted-foreground">+12% from yesterday</div>
                  {/* Progress bar moved inside CardContent and styling adjusted */}
                  <div className="mt-2">
                    <Progress value={60} aria-label="Study time progress" className="h-2"/>
                  </div>
                </CardContent>
              </Card>

              {/* Topics Covered Card */}
              {/* Added dark mode background, text, border, and progress colors */}
              <Card className="bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/60">
                <CardHeader className="pb-2">
                   <div className="flex items-center justify-between">
                      <CardDescription className="text-purple-800 dark:text-purple-200">Topics Covered</CardDescription>
                      <Book className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                    </div>
                   <CardTitle className="text-4xl text-purple-900 dark:text-purple-100">8 topics</CardTitle>
                </CardHeader>                <CardContent>
                  <div className="text-xs text-purple-700 dark:text-purple-300">3 new topics today</div>
                  <div className="mt-2">
                    <Progress value={80} aria-label="Topics covered progress" className="h-2 [&>*]:bg-purple-600 dark:[&>*]:bg-purple-500"/>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Adherence Card */}
               {/* Added dark mode background, text, border, and progress colors */}
               <Card className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800/60">
                 <CardHeader className="pb-2">
                   <div className="flex items-center justify-between">
                      <CardDescription className="text-yellow-800 dark:text-yellow-200">Schedule Adherence</CardDescription>
                      <CalendarDays className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
                    </div>
                   <CardTitle className="text-4xl text-yellow-900 dark:text-yellow-100">87%</CardTitle>
                 </CardHeader>                 <CardContent>
                   <div className="text-xs text-yellow-700 dark:text-yellow-300">+5% from last week</div>
                   <div className="mt-2">
                     <Progress value={87} aria-label="Schedule adherence progress" className="h-2 [&>*]:bg-yellow-600 dark:[&>*]:bg-yellow-500"/>
                   </div>
                 </CardContent>
               </Card>

              {/* Learning Score Card */}
               {/* Slightly adjusted dark mode styles */}
               <Card className="bg-purple-100/70 dark:bg-purple-900/20 border-purple-200/70 dark:border-purple-800/50">
                 <CardHeader className="pb-2">
                   <div className="flex items-center justify-between">
                     <CardDescription className="text-purple-800 dark:text-purple-200">Learning Score</CardDescription>
                     <BarChartBig className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                   </div>
                   <CardTitle className="text-4xl text-purple-900 dark:text-purple-100">92</CardTitle>
                 </CardHeader>                 <CardContent>
                   <div className="text-xs text-purple-700 dark:text-purple-300">+3 points this week</div>
                   <div className="mt-2">
                     <Progress value={92} aria-label="Learning score progress" className="h-2 [&>*]:bg-purple-600 dark:[&>*]:bg-purple-500"/>
                   </div>
                 </CardContent>
               </Card>
            </div>

            {/* Upcoming Tasks Section */}
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <Card> {/* Default Card styles should adapt */}
                <CardHeader>
                  <CardTitle className="text-xl">Upcoming Tasks</CardTitle>
                  <CardDescription>Your AI-optimized study schedule for today.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Placeholder Task Items - Border color adapts via CSS variables */}
                  <div className="border rounded-lg p-4 h-20"></div>
                  <div className="border rounded-lg p-4 h-20"></div>
                  <div className="border rounded-lg p-4 h-20"></div>
                </CardContent>
              </Card>
              <Card className="col-span-1 lg:col-span-1 hidden lg:block"> {/* Default Card styles should adapt */}
                  <CardHeader>
                   <CardTitle className="text-xl">Activity Feed</CardTitle>
                   <CardDescription>Recent activities and achievements.</CardDescription>
                 </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">No recent activity.</p>
                  </CardContent>
                </Card>
            </div>
          </TabsContent>

          {/* Placeholder Content for other tabs */}
           {/* These cards should also adapt automatically */}
           <TabsContent value="schedule" className="mt-6">
             <Card>
                <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
                <CardContent><p>Schedule content goes here...</p></CardContent>
             </Card>
           </TabsContent>
           {/* ... other tabs content ... */}
        </Tabs>
      </main>
    </>
  );
}