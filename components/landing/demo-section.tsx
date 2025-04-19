'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { Button } from '../ui/button';

export function DemoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control an actual video
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Intro / Demo</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg text-muted-foreground">
              Here's a breakdown of what a full landing page should contain for your AI Study Planner website — both in terms of content and sections. Think of it like a well-structured funnel guiding users from curiosity to conversion (signup).
            </p>
            
            <div className="mt-8">
              <img
                src="/placeholder-student-walking.png"
                alt="Student walking"
                className="max-w-xs mx-auto lg:mx-0"
              />
            </div>
          </div>

          <div
            ref={videoRef}
            className={cn(
              "aspect-video rounded-2xl overflow-hidden bg-yellow-400/20 border border-yellow-500/30 relative flex items-center justify-center cursor-pointer group transition-all duration-300",
              isPlaying ? "ring-4 ring-yellow-500/50" : ""
            )}
            onClick={handlePlayClick}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl font-bold text-background">
                <h3 className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-600">
                  HOW TO MAKE AN ANIMATED EXPLAINER VIDEO
                </h3>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Button 
                size="icon" 
                className="w-16 h-16 rounded-full bg-yellow-500 hover:bg-yellow-600 group-hover:scale-110 transition-transform duration-300"
              >
                <Play className="h-8 w-8 text-background" fill="white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}