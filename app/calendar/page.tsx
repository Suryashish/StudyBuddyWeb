"use client";

import React from "react";
import CalendarContent from "@/components/calendar/calendar-content";

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Study Calendar</h1>
      <CalendarContent />
    </div>
  );
}
