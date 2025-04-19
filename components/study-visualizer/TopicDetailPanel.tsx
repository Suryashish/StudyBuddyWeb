'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Youtube, BookOpen } from 'lucide-react';

interface TopicDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  nodeData?: any;
}

const TopicDetailPanel: React.FC<TopicDetailPanelProps> = ({
  isOpen,
  onClose,
  nodeData,
}) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen && nodeData) {
      generateContent();
    }
  }, [isOpen, nodeData]);
    const generateContent = async () => {
    if (!nodeData) return;
    
    // If content already exists in the node data, use it
    if (nodeData.content) {
      if (nodeData.content.videoId) {
        setVideoId(nodeData.content.videoId);
      }
      
      if (nodeData.content.description) {
        setDescription(nodeData.content.description);
        setLoading(false);
        return;
      }
    }
    
    setLoading(true);
    try {
      // Call the API to generate content for this topic
      const response = await fetch('/api/generate-topic-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic: nodeData.label })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      
      const data = await response.json();
      
      // Use the generated content or fallback to default values
      const videoId = data.videoId || "9QTXnkLxIGE";
      setVideoId(videoId);
        // Generate description from the data
      const generatedDescription = data.description || `
# ${nodeData.label}

## Overview
${nodeData.label} is a fundamental concept in ${nodeData.type === 'primary' ? 'computer science' : 'this subject'}. 
Understanding this topic thoroughly will help you build a strong foundation.

## Key Points to Remember
- First important point about ${nodeData.label}
- Second key concept related to this topic
- Applications of ${nodeData.label} in real-world scenarios
- Common challenges students face when learning this

## Study Approach
1. Begin with the basic definitions
2. Work through example problems
3. Apply the concepts to practical scenarios
4. Review and test your knowledge

This topic connects with several other areas in your syllabus, so mastering it will help you understand many related concepts.
      `;
        setDescription(generatedDescription);
    } catch (error) {
      console.error("Error generating content:", error);
      // Fallback to a basic description if API call fails
      setDescription(`# ${nodeData.label}\n\nDetails for this topic will be available soon.`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90vw] max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-bold">
              {nodeData?.label || "Topic Details"}
            </SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {/* Video Recommendation Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Youtube className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Recommended Video</h3>
              </div>
              
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                {videoId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Video loading...
                  </div>
                )}
              </div>
            </div>
            
            {/* Topic Description */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Topic Description</h3>
              </div>
              
              <Card className="p-4 prose prose-sm max-w-none">
                <div className="markdown">
                  {description.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-xl font-bold mt-4">{line.substring(2)}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-lg font-semibold mt-4">{line.substring(3)}</h2>;
                    } else if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4">{line.substring(2)}</li>;
                    } else if (line.match(/^\d+\./)) {
                      return <div key={i} className="ml-4 flex gap-2">
                        <span className="font-bold">{line.split('.')[0]}.</span>
                        <span>{line.split('.').slice(1).join('.').trim()}</span>
                      </div>;
                    } else if (line.trim() === '') {
                      return <div key={i} className="h-2" />;
                    } else {
                      return <p key={i}>{line}</p>;
                    }
                  })}
                </div>
              </Card>
            </div>
            
            {/* Related Resources */}
            <div className="space-y-2">
              <h3 className="font-medium">Related Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start">
                  <BookOpen className="h-4 w-4 mr-2" /> Study Notes
                </Button>
                <Button variant="outline" className="justify-start">
                  <Youtube className="h-4 w-4 mr-2" /> More Videos
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TopicDetailPanel;
