import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

// Set reasonable timeout in milliseconds (e.g., 25 seconds)
const TIMEOUT_MS = 25000;

// Create a promise that rejects after a timeout
function timeoutPromise(ms: number) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;
    
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' }, 
        { status: 400 }
      );
    }
    
    if (!process.env.GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not found, falling back to mock data');
      const mockResult = generateGroqContent(topic);
      return NextResponse.json(mockResult);
    }
    
    try {
      // Race the API call against a timeout
      const result = await Promise.race([
        generateGroqContent(topic),
        timeoutPromise(TIMEOUT_MS)
      ]);
      
      return NextResponse.json(result);
    } catch (error) {
      console.warn('Groq API call timed out or failed, falling back to mock data:', error);
      const mockResult = generateGroqContent(topic);
      return NextResponse.json(mockResult);
    }
  } catch (error) {
    console.error('Error generating topic content:', error);
    return NextResponse.json(
      { error: 'Failed to generate topic content' }, 
      { status: 500 }
    );
  }
}

// Keep your existing generateMockContent function here

async function generateGroqContent(topic: string) {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  const systemPrompt = `
  Generate a structured study guide for "${topic}" as a JSON object with:
  - id (slug of topic)
  - name (capitalized topic)
  - description (brief overview)
  - content (main explanation)
  - subtopics (array of 4-5 subtopics)
    - Each subtopic has: id, name, description, content, resources, and 2-3 nested subtopics
    - Each nested subtopic has: id, name, description, content, resources
  - resources (array of learning materials)

  Keep explanations concise but informative.
  `;
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a structured study guide for "${topic}".` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });
    
    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error('Error calling Groq API:', error);
    return generateGroqContent(topic);
  }
}
