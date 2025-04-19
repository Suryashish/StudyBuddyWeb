'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { SyllabusData } from './StructuredSyllabusInput';

interface SyllabusSelectionProps {
  syllabusData: SyllabusData;
  onSelect: (subjectIndex: number, chapterIndex: number) => void;
  onCancel: () => void;
}

const SyllabusSelection: React.FC<SyllabusSelectionProps> = ({ 
  syllabusData, 
  onSelect, 
  onCancel 
}) => {
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleSubjectChange = (value: string) => {
    const subjectIndex = parseInt(value);
    setSelectedSubject(subjectIndex);
    setSelectedChapter(null); // Reset chapter selection
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapter(parseInt(value));
  };

  const handleVisualize = () => {
    if (selectedSubject !== null && selectedChapter !== null) {
      onSelect(selectedSubject, selectedChapter);
    }
  };

  return (
    <Card className="w-[550px] mx-auto my-10">
      <CardHeader>
        <CardTitle>Select Content to Visualize</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="subject-select" className="text-sm font-medium">
            Select Subject
          </label>
          <Select 
            onValueChange={handleSubjectChange}
            value={selectedSubject !== null ? selectedSubject.toString() : undefined}
          >
            <SelectTrigger id="subject-select">
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {syllabusData.subjects.map((subject, index) => (
                <SelectItem key={`subject-${index}`} value={index.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSubject !== null && (
          <div className="space-y-2">
            <label htmlFor="chapter-select" className="text-sm font-medium">
              Select Chapter
            </label>
            <Select 
              onValueChange={handleChapterChange}
              value={selectedChapter !== null ? selectedChapter.toString() : undefined}
            >
              <SelectTrigger id="chapter-select">
                <SelectValue placeholder="Choose a chapter" />
              </SelectTrigger>
              <SelectContent>
                {syllabusData.subjects[selectedSubject].chapters.map((chapter, index) => (
                  <SelectItem key={`chapter-${index}`} value={index.toString()}>
                    {chapter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Back
        </Button>
        <Button 
          onClick={handleVisualize}
          disabled={selectedSubject === null || selectedChapter === null}
        >
          Visualize
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SyllabusSelection;
