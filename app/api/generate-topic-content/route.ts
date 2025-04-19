import { NextRequest, NextResponse } from 'next/server';
import Groq from "groq-sdk";

// Initialize Groq client
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

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
      // Fall back to mock data if API key is not configured
      const mockResult = generateMockContent(topic);
      return NextResponse.json(mockResult);
    }
    
    // Generate AI content using Groq
    const result = await generateGroqContent(topic);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating topic content:', error);
    return NextResponse.json(
      { error: 'Failed to generate topic content' }, 
      { status: 500 }
    );
  }
}

function generateMockContent(topic: string) {
  // This function simulates AI-generated content
  // In a real application, you would call an AI service here
  
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  // Generate 4-6 subtopics based on the main topic
  const subtopicCount = 4 + Math.floor(Math.random() * 3);
  const subtopics = [];
  
  for (let i = 1; i <= subtopicCount; i++) {
    // Generate further nested subtopics for each subtopic
    const nestedCount = 2 + Math.floor(Math.random() * 3);
    const nestedSubtopics = [];
    
    for (let j = 1; j <= nestedCount; j++) {
      nestedSubtopics.push({
        id: `${topic}-${i}-${j}`.replace(/\s+/g, '-').toLowerCase(),
        name: `${capitalizedTopic} Subtopic ${i}.${j}`,
        description: `This is a detailed explanation about ${topic} subtopic ${i}.${j}.`,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${capitalizedTopic} is an important concept that includes many aspects including this subtopic.`,
        resources: [
          { type: 'article', title: 'Understanding ' + topic, url: '#' },
          { type: 'video', title: 'Learn ' + topic + ' in 10 minutes', url: '#' }
        ]
      });
    }
    
    subtopics.push({
      id: `${topic}-${i}`.replace(/\s+/g, '-').toLowerCase(),
      name: `${capitalizedTopic} Subtopic ${i}`,
      description: `This is a detailed explanation about ${topic} subtopic ${i}.`,
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${capitalizedTopic} is an important concept that includes many aspects.`,
      subtopics: nestedSubtopics,
      resources: [
        { type: 'article', title: 'Deep dive into ' + topic, url: '#' },
        { type: 'video', title: topic + ' explained', url: '#' }
      ]
    });
  }
  
  return {
    id: topic.replace(/\s+/g, '-').toLowerCase(),
    name: capitalizedTopic,
    description: `This is the main topic about ${topic}.`,
    content: `${capitalizedTopic} is a key concept that encompasses multiple subtopics and areas of study.`,
    subtopics: subtopics,
    resources: [
      { type: 'book', title: 'Complete guide to ' + topic, url: '#' },
      { type: 'course', title: 'Mastering ' + topic, url: '#' }
    ]
  };
}

async function generateGroqContent(topic: string) {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  
  // Create the system prompt for structured topic content
  const systemPrompt = `
  Generate a comprehensive, structured study guide for "${topic}". The response should be formatted as a JSON object with the following structure:
  {
    "id": "unique-id-for-topic",
    "name": "Topic Name",
    "description": "A brief description of the topic",
    "content": "Detailed explanation of the topic",
    "subtopics": [
      {
        "id": "unique-id-for-subtopic",
        "name": "Subtopic Name",
        "description": "Brief description of subtopic",
        "content": "Detailed explanation of this subtopic",
        "subtopics": [
          {
            "id": "unique-id-for-nested-subtopic",
            "name": "Nested Subtopic Name",
            "description": "Brief description of nested subtopic",
            "content": "Detailed explanation of this nested subtopic",
            "resources": [
              {
                "type": "article|video|book|course",
                "title": "Resource Title",
                "url": "#"
              }
            ]
          }
        ],
        "resources": [Array of resources like above]
      }
    ],
    "resources": [Array of resources like above]
  }
  
  Please generate 4-5 main subtopics, each with 2-3 nested subtopics. Make the content educational, informative and accurate.
  `;
  
  try {
    // Make the API call to Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Please generate a structured study guide for "${topic}" following the specified JSON format.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });
    
    // Extract and parse the content
    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error('Error calling Groq API:', error);
    // Fall back to mock data if the API call fails
    return generateMockContent(topic);
  }
}