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
                src="/landingimages/Transhumans - Mask 1.svg"
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

            {/* Content based on playing state */}
            {isPlaying ? (
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/9kuynHcM3UA?si=J6BHtynCH2J3XzjD&autoplay=1" // Added autoplay=1 to start playing on render
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              // Ensure iframe fills the container and is visible
              className="absolute inset-0 w-full h-full z-10" 
            ></iframe>
            ) : (
            <>
              {/* Placeholder/Overlay shown when not playing */}
              {/* Optional: Add a thumbnail image here */}
              {/* <img src="/path/to/thumbnail.jpg" alt="Video Thumbnail" className="absolute inset-0 w-full h-full object-cover" /> */}
              
              {/* Dark overlay - shown only when not playing */}
              <div className="absolute inset-0 bg-black/30 transition-opacity duration-300 group-hover:opacity-75"></div> 
              
              {/* Play Button - Centered, shown only when not playing */}
              {/* This button is now rendered by the code outside the selection, so it's removed from here */}
            </>
            )}
            {/* The play button is handled by the div outside this conditional logic */}
            
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