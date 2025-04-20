"use client";
import { Sidebar } from '@/components/dashboard/sidebar'; // We'll create this next
import { DashboardContent } from '@/components/dashboard/dashboard-content'; // And this one

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <Sidebar />
      <div className="flex flex-col flex-grow sm:py-4 sm:pl-14 md:pl-64"> {/* Adjust pl based on sidebar width */}
        <DashboardContent />
      </div>
    </div>
  );
}