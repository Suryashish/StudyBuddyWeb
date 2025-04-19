import React from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

export interface RetroNodeData {
  label: string;
  description: string;
  type?: 'primary' | 'secondary' | 'tertiary';
}

export interface RetroNodeProps {
  data: RetroNodeData;
  isConnectable: boolean;
}

const RetroNode: React.FC<RetroNodeProps> = ({ data, isConnectable }) => {
  const { label, description, type = 'primary' } = data;

  const nodeStyles = {
    primary: 'bg-gradient-to-br from-violet-500 to-violet-800 border-violet-300',
    secondary: 'bg-gradient-to-br from-blue-400 to-blue-700 border-blue-200',
    tertiary: 'bg-gradient-to-br from-emerald-400 to-emerald-700 border-emerald-200',
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg shadow-lg border-2 text-white backdrop-blur-sm',
        'hover:shadow-xl transition-all duration-300 cursor-pointer',
        'hover:scale-105 max-w-[220px]',
        nodeStyles[type]
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-gray-200 border-2 border-gray-400"
      />
      <div className="font-bold text-center text-white mb-1 truncate">{label}</div>
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
