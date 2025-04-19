'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, File } from 'lucide-react';

interface SyllabusUploaderProps {
  onSyllabusProcessed: (data: any) => void;
}

const SyllabusUploader: React.FC<SyllabusUploaderProps> = ({ onSyllabusProcessed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploaderState, setUploaderState] = useState<'initial' | 'processing' | 'manual'>('initial');
  const [manualSyllabus, setManualSyllabus] = useState({
    subjectName: '',
    chapters: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setUploaderState('processing');
    
    try {
      // In a real implementation, you would send the file to an API endpoint
      // that uses pdf-parse to extract text and then uses Groq AI to structure it
      
      // For now, we'll simulate processing with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock processed data
      const mockSyllabusData = {
        subjects: [
          {
            name: "Computer Science",
            chapters: [
              {
                name: "Data Structures",
                topics: [
                  {
                    name: "Arrays",
                    subtopics: [
                      { name: "1D Arrays" },
                      { name: "2D Arrays" },
                      { name: "Dynamic Arrays" }
                    ]
                  },
                  {
                    name: "Linked Lists",
                    subtopics: [
                      { name: "Singly Linked Lists" },
                      { name: "Doubly Linked Lists" },
                      { name: "Circular Linked Lists" }
                    ]
                  }
                ]
              },
              {
                name: "Algorithms",
                topics: [
                  {
                    name: "Sorting",
                    subtopics: [
                      { name: "Bubble Sort" },
                      { name: "Quick Sort" },
                      { name: "Merge Sort" }
                    ]
                  },
                  {
                    name: "Searching",
                    subtopics: [
                      { name: "Linear Search" },
                      { name: "Binary Search" },
                      { name: "Hash-based Search" }
                    ]
                  }
                ]
              }
            ]
          },
          {
            name: "Mathematics",
            chapters: [
              {
                name: "Calculus",
                topics: [
                  {
                    name: "Limits",
                    subtopics: [
                      { name: "Definition of Limits" },
                      { name: "Properties of Limits" },
                      { name: "L'Hôpital's Rule" }
                    ]
                  },
                  {
                    name: "Derivatives",
                    subtopics: [
                      { name: "Definition of Derivative" },
                      { name: "Rules of Differentiation" },
                      { name: "Applications of Derivatives" }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };
      
      onSyllabusProcessed(mockSyllabusData);
    } catch (error) {
      console.error("Error processing syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    setLoading(true);
    
    try {
      // Parse manually entered syllabus
      const subject = {
        name: manualSyllabus.subjectName,
        chapters: manualSyllabus.chapters
          .split(/\n/)
          .filter(line => line.trim().length > 0)
          .map((chapter, idx) => ({
            name: chapter,
            topics: [
              {
                name: `Topic ${idx + 1}`,
                subtopics: [
                  { name: `Subtopic ${idx + 1}.1` },
                  { name: `Subtopic ${idx + 1}.2` }
                ]
              }
            ]
          }))
      };
      
      onSyllabusProcessed({ subjects: [subject] });
    } catch (error) {
      console.error("Error parsing manual syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  const switchToManualEntry = () => {
    setUploaderState('manual');
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualSyllabus(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (uploaderState === 'processing') {
    return (
      <Card className="w-[550px] mx-auto my-10">
        <CardHeader>
          <CardTitle>Processing Your Syllabus</CardTitle>
          <CardDescription>
            We're analyzing your syllabus to create an interactive visualization.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-sm text-muted-foreground">This may take a few moments...</p>
        </CardContent>
      </Card>
    );
  }

  if (uploaderState === 'manual') {
    return (
      <Card className="w-[550px] mx-auto my-10">
        <CardHeader>
          <CardTitle>Manual Syllabus Entry</CardTitle>
          <CardDescription>
            Enter your syllabus information manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subjectName">Subject Name</Label>
            <Input 
              id="subjectName" 
              name="subjectName"
              placeholder="e.g. Computer Science, Mathematics" 
              value={manualSyllabus.subjectName}
              onChange={handleManualInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chapters">Chapters (one per line)</Label>
            <textarea 
              id="chapters"
              name="chapters"
              className="w-full min-h-[150px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Data Structures
Algorithms
Database Management
..."
              value={manualSyllabus.chapters}
              onChange={handleManualInputChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setUploaderState('initial')}>Back</Button>
          <Button onClick={handleManualSubmit} disabled={!manualSyllabus.subjectName || !manualSyllabus.chapters}>
            Create Visualization
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-[550px] mx-auto my-10">
      <CardHeader>
        <CardTitle>Upload Your Syllabus</CardTitle>
        <CardDescription>
          Upload your syllabus file or enter the details manually to create an interactive visualization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors relative" onClick={() => document.getElementById('file-upload')?.click()}>
          <Input 
            id="file-upload" 
            type="file" 
            accept=".pdf,.docx,.txt" 
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-sm mt-2 font-medium">
            {file ? file.name : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports PDF, Word, and text files
          </p>
        </div>

        {file && (
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium flex-1 truncate">{file.name}</span>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setFile(null)}
            >
              Remove
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={switchToManualEntry}>Enter Manually</Button>
        <Button 
          onClick={handleUpload}
          disabled={!file || loading}
        >
          Process Syllabus
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SyllabusUploader;
