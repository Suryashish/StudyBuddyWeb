'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import RetroNode from './RetroNode';
import TopicDetailPanel from './TopicDetailPanel';
import StructuredSyllabusInput, { SyllabusData } from './StructuredSyllabusInput';
import SyllabusSelection from './SyllabusSelection';
import ContentGenerator from './ContentGenerator';

const nodeTypes: NodeTypes = {
  retro: RetroNode,
};

type AppState = 
  | 'input' // Initial syllabus input state
  | 'selection' // Subject/chapter selection state
  | 'generating' // Content generation loading state
  | 'visualizing'; // Main flow visualization state

export function StudyTopicVisualizer() {
  // Application state
  const [appState, setAppState] = useState<AppState>('input');
  
  // State for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // State for UI controls
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Syllabus data
  const [syllabusData, setSyllabusData] = useState<SyllabusData | null>(null);
  const [selectedContent, setSelectedContent] = useState<{
    subjectIndex: number;
    chapterIndex: number;
    topic: string;
  } | null>(null);
  
  // Refs
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Handle connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  
  // Handle node click to show details and fetch subtopics
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setShowSyllabus(true);
      
      // If this node has children that aren't shown yet and doesn't have an ongoing fetch, expand them
      if (!node.data.expanded && !node.data.loading) {
        // Mark the node as loading
        const newNodes = [...nodes];
        const nodeIndex = newNodes.findIndex((n) => n.id === node.id);
        
        if (nodeIndex !== -1) {
          // Update the node to show it's loading
          newNodes[nodeIndex] = { 
            ...newNodes[nodeIndex], 
            data: { 
              ...newNodes[nodeIndex].data, 
              loading: true 
            } 
          };
          setNodes(newNodes);
          
          // Generate content for this node (This would call your API)
          // For demo purposes, we'll use a timeout to simulate API call
          fetch('/api/generate-topic-content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic: node.data.label })
          })
            .then(response => response.json())
            .then(data => {
              // Process the generated content
              const subtopics = data.subtopics || [];
              
              // Mark the node as expanded with the generated content
              const updatedNodes = [...nodes];
              const updatedNodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
              
              if (updatedNodeIndex !== -1) {
                updatedNodes[updatedNodeIndex] = { 
                  ...updatedNodes[updatedNodeIndex], 
                  data: { 
                    ...updatedNodes[updatedNodeIndex].data, 
                    expanded: true,
                    loading: false,
                    content: data
                  } 
                };
                
                // Create child nodes based on generated subtopics
                const childNodes = subtopics.map((subtopic: any, index: number) => ({
                  id: `${node.id}-${index}`,
                  type: 'retro',
                  position: calculateChildPosition(node, index, subtopics.length),
                  data: {
                    label: subtopic.name,
                    description: subtopic.description,
                    type: 'secondary',
                    expanded: false,
                    content: subtopic
                  }
                }));
                
                // Create edges connecting parent to children
                const newEdges = childNodes.map((childNode: Node) => ({
                  id: `e${node.id}-${childNode.id}`,
                  source: node.id,
                  target: childNode.id,
                  type: 'smoothstep',
                }));
                
                // Update the graph
                setNodes([...updatedNodes, ...childNodes]);
                setEdges(prev => [...prev, ...newEdges]);
              }
            })
            .catch(error => {
              console.error('Error generating subtopics:', error);
              // Mark the node as not loading anymore on error
              const updatedNodes = [...nodes];
              const updatedNodeIndex = updatedNodes.findIndex((n) => n.id === node.id);
              if (updatedNodeIndex !== -1) {
                updatedNodes[updatedNodeIndex] = { 
                  ...updatedNodes[updatedNodeIndex], 
                  data: { 
                    ...updatedNodes[updatedNodeIndex].data, 
                    loading: false,
                    error: true
                  } 
                };
                setNodes(updatedNodes);
              }
            });
        }
      }
    },
    [nodes, edges, setNodes, setEdges]
  );
  
  // Helper function to calculate positions for child nodes in a semi-circle layout
  const calculateChildPosition = (parentNode: Node, index: number, totalChildren: number) => {
    const radius = 300; // Distance from parent
    const angleStep = Math.PI / Math.max(totalChildren - 1, 1);
    const angle = -Math.PI / 2 + angleStep * index;
    
    return {
      x: parentNode.position.x + radius * Math.cos(angle),
      y: parentNode.position.y + radius * Math.sin(angle) + 100
    };
  };
  
  // Handle syllabus input completion
  const handleSyllabusSubmit = (data: SyllabusData) => {
    setSyllabusData(data);
    setAppState('selection');
  };
  
  // Handle subject and chapter selection
  const handleContentSelection = (subjectIndex: number, chapterIndex: number) => {
    if (syllabusData) {
      const subject = syllabusData.subjects[subjectIndex];
      const chapter = subject.chapters[chapterIndex];
      
      setSelectedContent({
        subjectIndex,
        chapterIndex,
        topic: `${subject.name}: ${chapter.name}`
      });
      
      setAppState('generating');
    }
  };
  
  // Handle content generation completion
  const handleContentGenerated = (generatedContent: any) => {
    setAppState('visualizing');
    
    // Create initial topic nodes from the chapter's topics
    if (syllabusData && selectedContent) {
      const subject = syllabusData.subjects[selectedContent.subjectIndex];
      const chapter = subject.chapters[selectedContent.chapterIndex];
      
      const initialNodes = chapter.topics.map((topic, index) => {
        const position = {
          x: 250 * (index - Math.floor(chapter.topics.length / 2)),
          y: 100
        };
        
        return {
          id: `topic-${index}`,
          type: 'retro',
          position: position,
          data: {
            label: topic.name,
            description: `Topic in ${chapter.name}`,
            type: 'primary',
            expanded: false
          }
        };
      });
      
      setNodes(initialNodes);
    }
  };
  
  const closeSidePanel = () => {
    setShowSyllabus(false);
    setSelectedNode(null);
  };
  
  const resetApp = () => {
    setAppState('input');
    setSyllabusData(null);
    setSelectedContent(null);
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className="w-full h-[calc(100vh-80px)]">
      {appState === 'input' && (
        <div className="container mx-auto py-6">
          <h2 className="text-2xl font-bold mb-6">Create Your Study Visualization</h2>
          <StructuredSyllabusInput
            onSubmit={handleSyllabusSubmit}
            onCancel={() => {}}
          />
        </div>
      )}
      
      {appState === 'selection' && syllabusData && (
        <SyllabusSelection
          syllabusData={syllabusData}
          onSelect={handleContentSelection}
          onCancel={resetApp}
        />
      )}
      
      {appState === 'generating' && selectedContent && (
        <ContentGenerator
          topic={selectedContent.topic}
          onGenerated={handleContentGenerated}
          onError={resetApp}
        />
      )}
      
      {appState === 'visualizing' && (
        <div className="w-full h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
            <Panel position="top-left">
              <Button 
                variant="secondary"
                onClick={resetApp}
              >
                Create New Visualization
              </Button>
            </Panel>
          </ReactFlow>
        </div>
      )}
      
      <TopicDetailPanel 
        isOpen={showSyllabus}
        onClose={closeSidePanel}
        nodeData={selectedNode?.data}
      />
    </div>
  );
}

export default StudyTopicVisualizer;
