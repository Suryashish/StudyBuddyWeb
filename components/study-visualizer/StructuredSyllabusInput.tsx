'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

export interface Topic {
  name: string;
}

export interface Chapter {
  name: string;
  topics: Topic[];
}

export interface Subject {
  name: string;
  chapters: Chapter[];
}

export interface SyllabusData {
  subjects: Subject[];
}

interface StructuredSyllabusInputProps {
  onSubmit: (data: SyllabusData) => void;
  onCancel: () => void;
}

const StructuredSyllabusInput: React.FC<StructuredSyllabusInputProps> = ({ onSubmit, onCancel }) => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: '', chapters: [{ name: '', topics: [{ name: '' }] }] }
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', chapters: [{ name: '', topics: [{ name: '' }] }] }]);
  };

  const addChapter = (subjectIndex: number) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters.push({ name: '', topics: [{ name: '' }] });
    setSubjects(newSubjects);
  };

  const addTopic = (subjectIndex: number, chapterIndex: number) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters[chapterIndex].topics.push({ name: '' });
    setSubjects(newSubjects);
  };

  const removeSubject = (subjectIndex: number) => {
    const newSubjects = subjects.filter((_, index) => index !== subjectIndex);
    setSubjects(newSubjects.length ? newSubjects : [{ name: '', chapters: [{ name: '', topics: [{ name: '' }] }] }]);
  };

  const removeChapter = (subjectIndex: number, chapterIndex: number) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters = newSubjects[subjectIndex].chapters.filter((_, index) => index !== chapterIndex);
    
    if (newSubjects[subjectIndex].chapters.length === 0) {
      newSubjects[subjectIndex].chapters = [{ name: '', topics: [{ name: '' }] }];
    }
    
    setSubjects(newSubjects);
  };

  const removeTopic = (subjectIndex: number, chapterIndex: number, topicIndex: number) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters[chapterIndex].topics = 
      newSubjects[subjectIndex].chapters[chapterIndex].topics.filter((_, index) => index !== topicIndex);
    
    if (newSubjects[subjectIndex].chapters[chapterIndex].topics.length === 0) {
      newSubjects[subjectIndex].chapters[chapterIndex].topics = [{ name: '' }];
    }
    
    setSubjects(newSubjects);
  };

  const handleSubjectChange = (subjectIndex: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].name = value;
    setSubjects(newSubjects);
  };

  const handleChapterChange = (subjectIndex: number, chapterIndex: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters[chapterIndex].name = value;
    setSubjects(newSubjects);
  };

  const handleTopicChange = (subjectIndex: number, chapterIndex: number, topicIndex: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[subjectIndex].chapters[chapterIndex].topics[topicIndex].name = value;
    setSubjects(newSubjects);
  };

  const handleSubmit = () => {
    // Validate data - ensure no empty fields
    const validSubjects = subjects
      .filter(subject => subject.name.trim() !== '')
      .map(subject => ({
        ...subject,
        chapters: subject.chapters
          .filter(chapter => chapter.name.trim() !== '')
          .map(chapter => ({
            ...chapter,
            topics: chapter.topics.filter(topic => topic.name.trim() !== '')
          }))
          .filter(chapter => chapter.topics.length > 0)
      }))
      .filter(subject => subject.chapters.length > 0);

    if (validSubjects.length === 0) {
      alert('Please add at least one subject with chapters and topics');
      return;
    }

    onSubmit({ subjects: validSubjects });
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6 space-y-6">
        {subjects.map((subject, subjectIndex) => (
          <div key={`subject-${subjectIndex}`} className="border rounded-md p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Label htmlFor={`subject-${subjectIndex}`} className="min-w-24">Subject {subjectIndex + 1}</Label>
              <Input
                id={`subject-${subjectIndex}`}
                value={subject.name}
                onChange={(e) => handleSubjectChange(subjectIndex, e.target.value)}
                placeholder="Subject name"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeSubject(subjectIndex)}
                disabled={subjects.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="ml-8 space-y-4">
              {subject.chapters.map((chapter, chapterIndex) => (
                <div key={`chapter-${subjectIndex}-${chapterIndex}`} className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`chapter-${subjectIndex}-${chapterIndex}`} className="min-w-24">Chapter {chapterIndex + 1}</Label>
                    <Input
                      id={`chapter-${subjectIndex}-${chapterIndex}`}
                      value={chapter.name}
                      onChange={(e) => handleChapterChange(subjectIndex, chapterIndex, e.target.value)}
                      placeholder="Chapter name"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeChapter(subjectIndex, chapterIndex)}
                      disabled={subject.chapters.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="ml-8 space-y-2">
                    {chapter.topics.map((topic, topicIndex) => (
                      <div key={`topic-${subjectIndex}-${chapterIndex}-${topicIndex}`} className="flex items-center gap-2">
                        <Label htmlFor={`topic-${subjectIndex}-${chapterIndex}-${topicIndex}`} className="min-w-24">Topic {topicIndex + 1}</Label>
                        <Input
                          id={`topic-${subjectIndex}-${chapterIndex}-${topicIndex}`}
                          value={topic.name}
                          onChange={(e) => handleTopicChange(subjectIndex, chapterIndex, topicIndex, e.target.value)}
                          placeholder="Topic name"
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeTopic(subjectIndex, chapterIndex, topicIndex)}
                          disabled={chapter.topics.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addTopic(subjectIndex, chapterIndex)}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Topic
                    </Button>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => addChapter(subjectIndex)}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Chapter
              </Button>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={addSubject}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Subject
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Syllabus</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StructuredSyllabusInput;
