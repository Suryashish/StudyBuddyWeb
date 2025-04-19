'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define type for the cached content
interface TopicContent {
  [topicKey: string]: any; // The structure of your generated content
}

interface TopicContentContextType {
  cachedContent: TopicContent;
  getCachedContent: (topic: string) => any | null;
  setCachedContent: (topic: string, content: any) => void;
  hasCachedContent: (topic: string) => boolean;
}

const TopicContentContext = createContext<TopicContentContextType | undefined>(undefined);

export function TopicContentProvider({ children }: { children: ReactNode }) {
  const [cachedContent, setCachedTopicContent] = useState<TopicContent>({});

  const getCachedContent = (topic: string): any | null => {
    return cachedContent[topic] || null;
  };

  const setCachedContent = (topic: string, content: any) => {
    setCachedTopicContent((prevCache) => ({
      ...prevCache,
      [topic]: content,
    }));
  };

  const hasCachedContent = (topic: string): boolean => {
    return !!cachedContent[topic];
  };

  return (
    <TopicContentContext.Provider
      value={{
        cachedContent,
        getCachedContent,
        setCachedContent,
        hasCachedContent,
      }}
    >
      {children}
    </TopicContentContext.Provider>
  );
}

// Custom hook to use the TopicContent context
export function useTopicContent() {
  const context = useContext(TopicContentContext);
  if (context === undefined) {
    throw new Error('useTopicContent must be used within a TopicContentProvider');
  }
  return context;
}
