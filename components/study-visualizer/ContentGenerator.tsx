'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContentGenerationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  generatedContent: any | null;
  error: string | null;
}

interface ContentGeneratorProps {
  topic: string;
  onGenerated: (content: any) => void;
  onError: () => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ topic, onGenerated, onError }) => {
  const [state, setState] = useState<ContentGenerationState>({
    status: 'loading',
    generatedContent: null,
    error: null
  });

  useEffect(() => {
    const generateContent = async () => {
      try {
        setState({ status: 'loading', generatedContent: null, error: null });
        
        // Call the API to generate content
        const response = await fetch('/api/generate-topic-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ topic })
        });

        if (!response.ok) {
          throw new Error('Failed to generate content');
        }

        const data = await response.json();
        setState({ status: 'success', generatedContent: data, error: null });
        onGenerated(data);
      } catch (error) {
        console.error('Error generating content:', error);
        setState({ 
          status: 'error', 
          generatedContent: null, 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        });
        onError();
      }
    };

    generateContent();
  }, [topic, onGenerated, onError]);

  if (state.status === 'loading') {
    return (
      <Card className="w-full max-w-3xl mx-auto my-10">
        <CardHeader>
          <CardTitle>Generating Content</CardTitle>
          <CardDescription>
            Creating an interactive visualization for {topic}...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">
            Our AI is analyzing and generating content for this topic. This may take a moment...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (state.status === 'error') {
    return (
      <Card className="w-full max-w-3xl mx-auto my-10">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Something went wrong while generating content
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-destructive">
          <p>{state.error || 'Unknown error occurred'}</p>
          <button 
            className="mt-4 px-4 py-2 rounded bg-muted hover:bg-muted/80"
            onClick={onError}
          >
            Try Again
          </button>
        </CardContent>
      </Card>
    );
  }

  // We won't render the success state as we'll immediately call onGenerated
  return null;
};

export default ContentGenerator;
