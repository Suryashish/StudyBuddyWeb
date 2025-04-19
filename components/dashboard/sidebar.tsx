'use client';
import Link from 'next/link';
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpenText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  BookCopy,
  Home,
  CalendarDays,
  BookMarked,
  LineChart,
  Cog,
  DoorOpen
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// ... (navItems and minimalNavIcons definitions remain the same) ...
const navItems = [
  { href: '#', label: 'Dashboard', icon: LayoutDashboard, active: true },
  { href: '#', label: 'Study Planner', icon: CalendarCheck, active: false },
  { href: '#', label: 'Learning Space', icon: BookOpenText, active: false },
  { href: '#', label: 'Analytics', icon: BarChart3, active: false },
  { href: '#', label: 'Settings', icon: Settings, active: false },
];
const minimalNavIcons = [
    { icon: Home },
    { icon: CalendarDays },
    { icon: BookMarked },
    { icon: LineChart },
    { icon: Cog },
    { icon: DoorOpen },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex h-full w-14 flex-col border-r bg-background sm:flex md:w-64">
      {/* Minimal Icon Strip */}
       <div className="flex flex-col items-center border-r bg-background h-full py-4 w-14 fixed">
         {/* Adjusted active button styles */}
         <Button variant="ghost" size="icon" className="mb-4 rounded-lg bg-orange-500 text-primary-foreground hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700">
            <Home className="h-5 w-5" />
            <span className="sr-only">Dashboard</span>
         </Button>
        {minimalNavIcons.slice(1).map((item, index) => (
          // Default ghost variant should adapt well
          <Button key={index} variant="ghost" size="icon" className="rounded-lg mb-2 text-muted-foreground hover:text-foreground">
             <item.icon className="h-5 w-5" />
             <span className="sr-only">{navItems[index+1]?.label ?? 'Icon'}</span>
          </Button>
        ))}
       </div>

      {/* Expanded Sidebar Content */}
      <div className="hidden md:flex md:flex-col md:h-full md:ml-14">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="#" className="flex items-center gap-2 font-semibold text-lg text-foreground"> {/* Ensure text uses foreground */}
             <span className="">StudyBuddy</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-auto py-4 px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} passHref>
              <Button
                variant={item.active ? 'default' : 'ghost'}
                className={`w-full justify-start mb-2 ${
                  item.active
                    // Adjusted active button styles for dark mode
                    ? 'bg-orange-500 text-primary-foreground hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700'
                    // Ghost variant adapts automatically, but added explicit hover for clarity
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4">
          <Separator className="my-4" /> {/* Separator adapts automatically */}
          {/* Ghost variant adapts automatically */}
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent">
            <LogOut className="mr-3 h-5 w-5" />
            LogOut
          </Button>
        </div>
      </div>
    </aside>
  );
}
