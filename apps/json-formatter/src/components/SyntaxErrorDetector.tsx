import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@encodly/shared-ui';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface SyntaxError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

interface SyntaxErrorDetectorProps {
  content: string;
  onErrorsChange?: (errors: SyntaxError[]) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const SyntaxErrorDetector: React.FC<SyntaxErrorDetectorProps> = ({
  content,
  onErrorsChange,
  onValidityChange,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const analysis = useMemo(() => {
    const errors: SyntaxError[] = [];
    let isValid = true;

    if (!content.trim()) {
      return { errors, isValid: true };
    }

    try {
      // Try to parse the JSON
      JSON.parse(content);
    } catch (error) {
      isValid = false;
      
      if (error instanceof SyntaxError) {
        // Extract line and column information from error message
        const match = error.message.match(/at position (\d+)/);
        const position = match ? parseInt(match[1]) : 0;
        
        // Convert position to line/column
        const lines = content.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;

        // Analyze common JSON syntax errors
        const errorAnalysis = analyzeJsonSyntaxError(error.message, content, position);
        
        errors.push({
          line,
          column,
          message: errorAnalysis.message,
          severity: 'error',
          suggestion: errorAnalysis.suggestion,
        });
      }
    }

    // Additional structural checks for valid JSON
    if (isValid) {
      const structuralWarnings = checkJsonStructure(content);
      errors.push(...structuralWarnings);
    }

    return { errors, isValid };
  }, [content]);

  // Notify parent components
  useEffect(() => {
    if (onErrorsChange) {
      onErrorsChange(analysis.errors);
    }
    if (onValidityChange) {
      onValidityChange(analysis.isValid);
    }
  }, [analysis, onErrorsChange, onValidityChange]);

  if (analysis.errors.length === 0 && analysis.isValid) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
        <CardContent className="flex items-center gap-2 py-3">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Valid JSON syntax
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
      <CardHeader 
        className="pb-2 cursor-pointer" 
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <CardTitle className="text-sm text-red-700 dark:text-red-300">
              {analysis.errors.filter(e => e.severity === 'error').length} syntax error(s)
              {analysis.errors.filter(e => e.severity === 'warning').length > 0 && 
                `, ${analysis.errors.filter(e => e.severity === 'warning').length} warning(s)`
              }
            </CardTitle>
          </div>
          <span className="text-xs text-red-600 dark:text-red-400">
            Click to {showDetails ? 'hide' : 'show'} details
          </span>
        </div>
      </CardHeader>
      
      {showDetails && (
        <CardContent className="space-y-3 pt-0">
          {analysis.errors.map((error, index) => (
            <div 
              key={index} 
              className="border border-red-200 dark:border-red-700 rounded p-3 bg-white dark:bg-red-950/30"
            >
              <div className="flex items-start gap-2 mb-2">
                {error.severity === 'error' ? (
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <Info className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-700 dark:text-red-300">
                    Line {error.line}, Column {error.column}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {error.message}
                  </div>
                </div>
              </div>
              
              {error.suggestion && (
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-700 rounded p-2 mt-2">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                    💡 Suggestion:
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    {error.suggestion}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
};

function analyzeJsonSyntaxError(errorMessage: string, content: string, position: number) {
  const surrounding = content.substring(Math.max(0, position - 10), position + 10);
  
  // Common JSON syntax error patterns
  if (errorMessage.includes('Unexpected token') || errorMessage.includes('Unexpected end')) {
    if (errorMessage.includes("'")) {
      return {
        message: "Unexpected single quote. JSON strings must use double quotes.",
        suggestion: "Replace single quotes (') with double quotes (\") around string values."
      };
    }
    
    if (errorMessage.includes('undefined') || errorMessage.includes('function')) {
      return {
        message: "Invalid JavaScript value. JSON only supports strings, numbers, booleans, null, objects, and arrays.",
        suggestion: "Remove undefined values, functions, or other JavaScript-specific syntax."
      };
    }
    
    if (surrounding.includes(',}') || surrounding.includes(',]')) {
      return {
        message: "Trailing comma detected.",
        suggestion: "Remove the comma before the closing bracket or brace."
      };
    }
    
    if (surrounding.includes(':{') && !surrounding.includes('}')) {
      return {
        message: "Unclosed object or missing closing brace.",
        suggestion: "Add a closing brace '}' to match the opening brace."
      };
    }
    
    if (surrounding.includes(':[') && !surrounding.includes(']')) {
      return {
        message: "Unclosed array or missing closing bracket.",
        suggestion: "Add a closing bracket ']' to match the opening bracket."
      };
    }
  }
  
  if (errorMessage.includes('Expected property name') || errorMessage.includes('Expected string')) {
    return {
      message: "Property names must be strings enclosed in double quotes.",
      suggestion: "Wrap property names with double quotes, e.g., {\"propertyName\": \"value\"}"
    };
  }
  
  if (errorMessage.includes('Unexpected end of JSON input')) {
    return {
      message: "Incomplete JSON structure.",
      suggestion: "Check for missing closing braces '}' or brackets ']', or incomplete string values."
    };
  }
  
  return {
    message: errorMessage,
    suggestion: "Check the JSON syntax around the error position."
  };
}

function checkJsonStructure(content: string): SyntaxError[] {
  const warnings: SyntaxError[] = [];
  
  try {
    const parsed = JSON.parse(content);
    
    // Check for potentially problematic structures
    checkForDeepNesting(parsed, warnings);
    checkForLargeArrays(parsed, warnings);
    checkForSuspiciousKeys(parsed, warnings);
    
  } catch {
    // Already handled in main analysis
  }
  
  return warnings;
}

function checkForDeepNesting(obj: any, warnings: SyntaxError[], depth = 0, path = '') {
  if (depth > 10) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Very deep nesting detected (${depth} levels) at path: ${path}`,
      severity: 'warning',
      suggestion: "Consider flattening the structure for better performance and readability."
    });
    return;
  }
  
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        checkForDeepNesting(item, warnings, depth + 1, `${path}[${index}]`);
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        checkForDeepNesting(value, warnings, depth + 1, `${path}.${key}`);
      });
    }
  }
}

function checkForLargeArrays(obj: any, warnings: SyntaxError[], path = '') {
  if (Array.isArray(obj) && obj.length > 1000) {
    warnings.push({
      line: 1,
      column: 1,
      message: `Large array detected (${obj.length} items) at path: ${path}`,
      severity: 'warning',
      suggestion: "Consider pagination or data virtualization for large datasets."
    });
  }
  
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        checkForLargeArrays(item, warnings, `${path}[${index}]`);
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        checkForLargeArrays(value, warnings, `${path}.${key}`);
      });
    }
  }
}

function checkForSuspiciousKeys(obj: any, warnings: SyntaxError[], path = '') {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    Object.keys(obj).forEach(key => {
      // Check for keys that might contain sensitive information
      const sensitivePatterns = /password|secret|token|key|auth|credential/i;
      if (sensitivePatterns.test(key)) {
        warnings.push({
          line: 1,
          column: 1,
          message: `Potentially sensitive key detected: "${key}" at path: ${path}`,
          severity: 'warning',
          suggestion: "Be careful not to expose sensitive information in JSON data."
        });
      }
      
      checkForSuspiciousKeys(obj[key], warnings, `${path}.${key}`);
    });
  }
}