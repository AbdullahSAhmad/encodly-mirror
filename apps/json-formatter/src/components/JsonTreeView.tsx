import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Image, ExternalLink } from 'lucide-react';

interface JsonTreeViewProps {
  data: any;
  level?: number;
}

interface TreeNodeProps {
  label: string;
  value: any;
  level: number;
  isLast?: boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({ label, value, level, isLast = false }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const indent = level * 20;
  
  const getValueType = (val: any): string => {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const getValueDisplay = (val: any): string => {
    const type = getValueType(val);
    switch (type) {
      case 'string':
        return `"${val}"`;
      case 'number':
      case 'boolean':
        return String(val);
      case 'null':
        return 'null';
      case 'array':
        return `Array(${val.length})`;
      case 'object':
        return `Object(${Object.keys(val).length})`;
      default:
        return String(val);
    }
  };

  const isImageUrl = (url: string): boolean => {
    if (typeof url !== 'string') return false;
    try {
      const parsedUrl = new URL(url);
      const path = parsedUrl.pathname.toLowerCase();
      return /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/.test(path) || 
             parsedUrl.hostname.includes('images') ||
             parsedUrl.hostname.includes('img') ||
             path.includes('/image/') ||
             path.includes('/img/');
    } catch {
      return false;
    }
  };

  const isUrl = (str: string): boolean => {
    if (typeof str !== 'string') return false;
    try {
      new URL(str);
      return str.startsWith('http://') || str.startsWith('https://');
    } catch {
      return false;
    }
  };

  const getValueColor = (val: any): string => {
    const type = getValueType(val);
    switch (type) {
      case 'string':
        return 'text-blue-600 dark:text-blue-400';
      case 'number':
        return 'text-red-600 dark:text-red-400';
      case 'boolean':
        return 'text-purple-600 dark:text-purple-400';
      case 'null':
        return 'text-gray-500 dark:text-gray-400';
      case 'array':
      case 'object':
        return 'text-gray-700 dark:text-gray-300';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const isExpandable = (val: any): boolean => {
    return (Array.isArray(val) && val.length > 0) || 
           (typeof val === 'object' && val !== null && Object.keys(val).length > 0);
  };

  const expandable = isExpandable(value);

  return (
    <div>
      {/* Current node */}
      <div 
        className="flex items-center py-1 hover:bg-muted/50 rounded text-sm font-mono"
        style={{ paddingLeft: `${indent}px` }}
      >
        {/* Expand/Collapse button */}
        <div className="w-4 h-4 mr-1 flex items-center justify-center">
          {expandable ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-muted rounded p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : null}
        </div>

        {/* Key */}
        <span className="text-blue-700 dark:text-blue-300 mr-2">
          {label}:
        </span>

        {/* Value preview */}
        <span className={getValueColor(value)}>
          {getValueDisplay(value)}
          {/* Image preview icon for image URLs */}
          {getValueType(value) === 'string' && isImageUrl(value) && (
            <Image className="h-3 w-3 ml-1 inline text-blue-500" />
          )}
          {/* External link icon for other URLs */}
          {getValueType(value) === 'string' && isUrl(value) && !isImageUrl(value) && (
            <ExternalLink className="h-3 w-3 ml-1 inline text-blue-500" />
          )}
        </span>
        
        {/* Image preview tooltip */}
        {getValueType(value) === 'string' && isImageUrl(value) && (
          <div className="group relative inline-block ml-2">
            <div className="invisible group-hover:visible absolute z-50 left-0 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 max-w-xs">
              <img 
                src={value} 
                alt="Preview" 
                className="max-w-full max-h-48 object-contain rounded"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.textContent = 'Failed to load image';
                }}
              />
              <div className="text-xs text-gray-500 mt-1 hidden">Failed to load image</div>
              <div className="text-xs text-gray-500 mt-1 break-all">{value}</div>
            </div>
          </div>
        )}
      </div>

      {/* Children (if expanded) */}
      {expandable && isExpanded && (
        <div>
          {Array.isArray(value) ? (
            // Array items
            value.map((item, index) => (
              <TreeNode
                key={index}
                label={`[${index}]`}
                value={item}
                level={level + 1}
                isLast={index === value.length - 1}
              />
            ))
          ) : (
            // Object properties
            Object.entries(value).map(([key, val], index, entries) => (
              <TreeNode
                key={key}
                label={key}
                value={val}
                level={level + 1}
                isLast={index === entries.length - 1}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data, level = 0 }) => {
  try {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    
    return (
      <div className="p-4 text-sm h-[600px] overflow-auto">
        <TreeNode 
          label="root" 
          value={parsedData} 
          level={level} 
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 text-sm text-red-500 h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="font-medium mb-2">Invalid JSON</div>
          <div className="text-sm opacity-75">
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }
};