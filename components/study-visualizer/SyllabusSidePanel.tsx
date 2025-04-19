'use client';

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SyllabusSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  syllabusData?: any;
}

const SyllabusSidePanel: React.FC<SyllabusSidePanelProps> = ({
  isOpen,
  onClose,
  syllabusData,
}) => {
  // Mock data structure if no data is provided
  const data = syllabusData || {
    subjects: [
      { name: "Sample Subject", chapters: [{ name: "Sample Chapter" }] }
    ]
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>Syllabus Overview</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            View and manage your uploaded syllabus
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {data.subjects?.map((subject: any, sIndex: number) => (
            <div key={`subject-${sIndex}`} className="border rounded-lg p-4 bg-card">
              <h3 className="text-lg font-bold mb-3">{subject.name}</h3>
              
              <div className="space-y-3">
                {subject.chapters?.map((chapter: any, cIndex: number) => (
                  <div key={`chapter-${sIndex}-${cIndex}`} className="border rounded-md p-3 bg-background">
                    <h4 className="font-medium">{chapter.name}</h4>
                    
                    {chapter.topics?.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {chapter.topics.map((topic: any, tIndex: number) => (
                          <div key={`topic-${sIndex}-${cIndex}-${tIndex}`} className="pl-4 border-l-2 border-violet-300">
                            <p className="text-sm">{topic.name}</p>
                            
                            {topic.subtopics?.length > 0 && (
                              <div className="mt-1 ml-3 space-y-1">
                                {topic.subtopics.map((subtopic: any, stIndex: number) => (
                                  <p key={`subtopic-${sIndex}-${cIndex}-${tIndex}-${stIndex}`} className="text-xs text-muted-foreground">
                                    • {subtopic.name}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SyllabusSidePanel;
