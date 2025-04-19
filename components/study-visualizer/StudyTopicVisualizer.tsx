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
    // Handle node click to show details only
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setShowSyllabus(true);
    },
    []
  );  // Handle node expansion with fixed closure issues
  const handleExpandNode = useCallback((nodeId: string) => {
    console.log("Expanding node:", nodeId); // Debug log
    
    // First, mark the node as loading and get the node data
    let nodeLabel = "";
    
    setNodes(currentNodes => {
      const nodeIndex = currentNodes.findIndex((n) => n.id === nodeId);
      if (nodeIndex === -1) return currentNodes;
      
      const node = currentNodes[nodeIndex];
      if (node.data.expanded || node.data.loading) return currentNodes;
      
      // Store the node label for use in the API call
      nodeLabel = node.data.label;
      
      // Create a new array with the updated node
      const newNodes = [...currentNodes];
      newNodes[nodeIndex] = {
        ...newNodes[nodeIndex],
        data: {
          ...newNodes[nodeIndex].data,
          loading: true,
          onExpand: () => handleExpandNode(nodeId),
          onCollapse: () => handleCollapseNode(nodeId)
        }
      };
      
      return newNodes;
    });
    
    // Then fetch the content
    setTimeout(() => {
      // Use the stored nodeLabel instead of trying to find the node again
      if (!nodeLabel) {
        console.error("No node label found for node ID:", nodeId);
        return;
      }
      
      fetch('/api/generate-topic-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic: nodeLabel })
      })
        .then(response => response.json())
        .then(data => {
          // Process the generated content
          const subtopics = data.subtopics || [];
          
          // Create child nodes based on generated subtopics
          const childNodes = subtopics.map((subtopic, index) => {
            const childId = `${nodeId}-${index}`;
            return {
              id: childId,
              type: 'retro',
              position: { x: 0, y: 0 }, // Will be positioned correctly by adjustNodePositions
              data: {
                label: subtopic.name,
                description: subtopic.description,
                type: 'secondary',
                expanded: false,
                content: subtopic
              }
            };
          });
          
          // Create edges connecting parent to children
          const newEdges = childNodes.map(childNode => ({
            id: `e-${nodeId}-${childNode.id}`,
            source: nodeId,
            target: childNode.id,
            type: 'smoothstep',
          }));
            // Update the parent node and add children nodes
          setNodes(currentNodes => {
            // Find the node in the current state
            const nodeIndex = currentNodes.findIndex(n => n.id === nodeId);
            if (nodeIndex === -1) return currentNodes;
            
            // Clone and update the nodes array
            const updatedNodes = [...currentNodes];
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              data: {
                ...updatedNodes[nodeIndex].data,
                expanded: true,
                loading: false,
                content: data,
                onExpand: () => handleExpandNode(nodeId),
                onCollapse: () => handleCollapseNode(nodeId)
              }
            };
            
            // Prepare child nodes with proper event handlers
            const childNodesWithHandlers = childNodes.map((childNode) => {
              const childId = childNode.id;
              return {
                ...childNode,
                data: {
                  ...childNode.data,
                  onExpand: () => handleExpandNode(childId),
                  onCollapse: () => handleCollapseNode(childId)
                }
              };
            });
            
            // Add all child nodes with proper calculated positions
            const allNodes = [...updatedNodes, ...childNodesWithHandlers];
            
            // Position child nodes below their parent
            const parent = updatedNodes[nodeIndex];
            childNodesWithHandlers.forEach((childNode, index) => {
              const childIndex = updatedNodes.length + index;
              allNodes[childIndex].position = calculateChildPosition(
                parent, 
                index, 
                childNodesWithHandlers.length
              );
            });
            
            // Apply node position adjustment to prevent overlaps
            return adjustNodePositions(allNodes);
          });
          
          // Update edges
          setEdges(currentEdges => [...currentEdges, ...newEdges]);
        })
        .catch(error => {
          console.error('Error generating subtopics:', error);
          // Mark the node as not loading anymore on error
          const updatedNodes = [...nodes];
          const updatedNodeIndex = updatedNodes.findIndex((n) => n.id === nodeId);
          if (updatedNodeIndex !== -1) {
            updatedNodes[updatedNodeIndex] = { 
              ...updatedNodes[updatedNodeIndex], 
              data: { 
                ...updatedNodes[updatedNodeIndex].data, 
                loading: false,
                error: true,
                onExpand: () => handleExpandNode(nodeId),
                onCollapse: () => handleCollapseNode(nodeId)
              } 
            };
            setNodes(updatedNodes);          }
        });
    }, 0); // End of setTimeout
  }, [nodes, edges, setNodes, setEdges]);
  // Handle node collapse with fixed closure issues
  const handleCollapseNode = useCallback((nodeId: string) => {
    console.log("Collapsing node:", nodeId); // Debug log
    
    // Get all nodes that are descendants of the collapsed node
    // We'll use ID pattern matching instead of relying on edges state
    setNodes(currentNodes => {
      // Find the node to collapse
      const nodeIndex = currentNodes.findIndex(n => n.id === nodeId);
      if (nodeIndex === -1) return currentNodes;
      
      const nodeToCollapse = currentNodes[nodeIndex];
      if (!nodeToCollapse.data.expanded) return currentNodes;
      
      console.log("Found expanded node to collapse:", nodeToCollapse.id);
      
      // Find descendant nodes by ID pattern
      // Any node ID that starts with the collapsing node's ID + "-" is a descendant
      const descendantNodes = currentNodes.filter(n => 
        n.id.startsWith(`${nodeId}-`)
      );
      
      console.log("Found descendant nodes:", descendantNodes.map(n => n.id));
      
      // Get IDs of all descendants for easier filtering
      const descendantIds = new Set(descendantNodes.map(n => n.id));
      
      // Filter out the descendants from the nodes
      const remainingNodes = currentNodes.filter(n => !descendantIds.has(n.id));
      
      // Update the original node to be collapsed
      return remainingNodes.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              expanded: false,
              onExpand: () => handleExpandNode(nodeId),
              onCollapse: () => handleCollapseNode(nodeId)
            }
          };
        }
        return n;
      });
    });
    
    // Update edges separately using the same ID pattern matching approach
    setEdges(currentEdges => {
      const newEdges = currentEdges.filter(e => {
        // Remove edges connected to descendants
        const isSourceDescendant = e.source.startsWith(`${nodeId}-`);
        const isTargetDescendant = e.target.startsWith(`${nodeId}-`);
        
        // Also remove direct edges from the collapsed node
        const isDirectEdgeFromCollapsed = e.source === nodeId && e.target.startsWith(`${nodeId}-`);
        
        return !(isSourceDescendant || isTargetDescendant || isDirectEdgeFromCollapsed);
      });
      
      console.log(`Filtered edges from ${currentEdges.length} to ${newEdges.length}`);
      return newEdges;
    });
    
  }, [setNodes, setEdges]);
    // Helper function to calculate positions for child nodes in a vertical layout
  const calculateChildPosition = (parentNode: Node, index: number, totalChildren: number) => {
    const verticalSpacing = 200; // Vertical distance between parent and children
    const horizontalSpacing = 250; // Horizontal spacing between siblings
    
    // Calculate x position to center children under parent
    const startX = parentNode.position.x - ((totalChildren - 1) * horizontalSpacing) / 2;
    const x = startX + (index * horizontalSpacing);
    const y = parentNode.position.y + verticalSpacing;
    
    return { x, y };
  };
  
  // Helper function to ensure nodes don't overlap
  const adjustNodePositions = (updatedNodes: Node[]) => {
    // Create a grid to track occupied positions
    const grid: Record<string, boolean> = {};
    const nodeMap: Record<string, Node> = {};
    const adjustedNodes = [...updatedNodes];
    
    // First, add all nodes to a map for easy lookup
    updatedNodes.forEach((node) => {
      nodeMap[node.id] = node;
    });
    
    // Sort nodes: parents first, then children
    const sortedNodeIds = Object.keys(nodeMap).sort((a, b) => {
      const aDepth = a.split('-').length;
      const bDepth = b.split('-').length;
      return aDepth - bDepth;
    });
    
    // Process nodes in order
    sortedNodeIds.forEach((nodeId) => {
      const node = nodeMap[nodeId];
      
      // Skip nodes without positions
      if (!node.position) return;
      
      // Find a non-overlapping position for this node
      let { x, y } = node.position;
      
      // If this is not a top-level node, make sure it's below its parent
      if (node.parentNode) {
        const parent = nodeMap[node.parentNode];
        if (parent && parent.position) {
          // Ensure child is below parent
          y = Math.max(y, parent.position.y + 200);
        }
      }
      
      // Round x and y to a grid to reduce small overlaps
      const gridSize = 20;
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
      
      // Find an unoccupied position
      let positionKey = `${x},${y}`;
      while (grid[positionKey]) {
        y += gridSize;
        positionKey = `${x},${y}`;
      }
      
      // Mark position as occupied
      grid[positionKey] = true;
      
      // Update the node position
      const nodeIndex = adjustedNodes.findIndex(n => n.id === nodeId);
      if (nodeIndex !== -1) {
        adjustedNodes[nodeIndex] = {
          ...adjustedNodes[nodeIndex],
          position: { x, y }
        };
      }
    });
    
    return adjustedNodes;
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
    
    // Create initial visualization with chapter as root and topics as children
    if (syllabusData && selectedContent) {
      const subject = syllabusData.subjects[selectedContent.subjectIndex];
      const chapter = subject.chapters[selectedContent.chapterIndex];
      
      // Create chapter node as the root
      const chapterNode = {
        id: 'chapter-root',
        type: 'retro',
        position: { x: 0, y: 0 },
        data: {
          label: chapter.name,
          description: `Chapter from ${subject.name}`,
          type: 'primary',
          expanded: true
        }
      };
      
      // Create topic nodes as children of the chapter
      const topicNodes = chapter.topics.map((topic, index) => {
        const nodeId = `topic-${index}`;
        const position = {
          x: 250 * (index - Math.floor(chapter.topics.length / 2)),
          y: 200 // Position below the chapter node
        };
        
        return {
          id: nodeId,
          type: 'retro',
          position: position,
          data: {
            label: topic.name,
            description: `Topic in ${chapter.name}`,
            type: 'secondary',
            expanded: false,
            onExpand: function() { 
              console.log("Expanding node:", nodeId);
              handleExpandNode(nodeId);
            },
            onCollapse: function() {
              console.log("Collapsing node:", nodeId);
              handleCollapseNode(nodeId);
            }
          }
        };
      });
      
      // Create edges from chapter to topics
      const topicEdges = chapter.topics.map((topic, index) => ({
        id: `e-chapter-topic-${index}`,
        source: 'chapter-root',
        target: `topic-${index}`,
        type: 'smoothstep'
      }));
      
      // Set nodes and edges
      setNodes([chapterNode, ...topicNodes]);
      setEdges(topicEdges);
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
