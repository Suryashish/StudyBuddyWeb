import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export interface RetroNodeData {
  label: string;
  description: string;
  type?: 'primary' | 'secondary' | 'tertiary';
  expanded?: boolean;
  loading?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export interface RetroNodeProps {
  data: RetroNodeData;
  isConnectable: boolean;
}

const RetroNode: React.FC<RetroNodeProps> = ({ data, isConnectable }) => {
  const { label, description, type = 'primary', expanded = false, loading = false, onExpand, onCollapse } = data;

  const nodeStyles = {
    primary: 'bg-gradient-to-br from-violet-500 to-violet-800 border-violet-300',
    secondary: 'bg-gradient-to-br from-blue-400 to-blue-700 border-blue-200',
    tertiary: 'bg-gradient-to-br from-emerald-400 to-emerald-700 border-emerald-200',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node selection when clicking expand/collapse button
    if (expanded) {
      onCollapse?.();
    } else {
      onExpand?.();
    }
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg shadow-lg border-2 text-white backdrop-blur-sm',
        'hover:shadow-xl transition-all duration-300',
        'max-w-[220px]',
        nodeStyles[type]
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-200 border-2 border-gray-400"
      />
      <div className="flex justify-between items-center mb-1">
        <div className="font-bold text-center text-white truncate flex-grow">{label}</div>
        {(onExpand || onCollapse) && (
          <button 
            onClick={handleClick}
            className="ml-2 p-1 rounded-full hover:bg-white/20 transition-colors"
            title={expanded ? "Collapse" : "Expand"}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : expanded ? (
              <ChevronUp className="w-4 h-4 text-white" />
            ) : (
              <ChevronDown className="w-4 h-4 text-white" />
            )}
          </button>
        )}
      </div>
      <div className="text-xs text-white/90 line-clamp-2">{description}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-200 border-2 border-gray-400"
      />
    </div>
  );
};

export default RetroNode;
