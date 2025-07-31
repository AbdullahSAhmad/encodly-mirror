import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Textarea } from '@encodly/shared-ui';
import { CheckCircle, AlertCircle, Eye, EyeOff, Settings, RotateCcw } from 'lucide-react';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

interface SchemaValidatorProps {
  jsonData: string;
  onValidationChange?: (isValid: boolean, errors: any[]) => void;
}

export const SchemaValidator: React.FC<SchemaValidatorProps> = ({
  jsonData,
  onValidationChange,
}) => {
  const [schema, setSchema] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [customRules, setCustomRules] = useState({
    strictMode: true,
    allowAdditionalProperties: false,
    requireAllProperties: false,
    validateFormats: true,
  });

  // Default schemas for common use cases
  const defaultSchemas = {
    empty: '',
    basic: JSON.stringify({
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number', minimum: 0 },
        email: { type: 'string', format: 'email' }
      },
      required: ['name']
    }, null, 2),
    api: JSON.stringify({
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['success', 'error'] },
        data: { type: 'object' },
        message: { type: 'string' }
      },
      required: ['status']
    }, null, 2),
    config: JSON.stringify({
      type: 'object',
      properties: {
        version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
        environment: { type: 'string', enum: ['development', 'staging', 'production'] },
        features: {
          type: 'object',
          additionalProperties: { type: 'boolean' }
        },
        database: {
          type: 'object',
          properties: {
            host: { type: 'string', format: 'hostname' },
            port: { type: 'number', minimum: 1, maximum: 65535 },
            ssl: { type: 'boolean' }
          },
          required: ['host', 'port']
        }
      },
      required: ['version', 'environment']
    }, null, 2)
  };

  // Create AJV instance with custom configuration
  const ajv = useMemo(() => {
    const ajvInstance = new Ajv({
      allErrors: true,
      verbose: true,
      strict: customRules.strictMode,
      additionalProperties: customRules.allowAdditionalProperties,
      validateFormats: customRules.validateFormats,
    });
    
    // Add format validators
    addFormats(ajvInstance);
    
    // Add custom keywords
    ajvInstance.addKeyword({
      keyword: 'isNotEmpty',
      type: 'string',
      schemaType: 'boolean',
      compile: (schemaVal: boolean) => {
        return (data: string) => {
          if (schemaVal) {
            return data.trim().length > 0;
          }
          return true;
        };
      },
      error: {
        message: 'must not be empty'
      }
    });

    return ajvInstance;
  }, [customRules]);

  // Validation logic
  const validation = useMemo(() => {
    if (!jsonData.trim() || !schema.trim()) {
      return { isValid: null, errors: [] };
    }

    try {
      const parsedData = JSON.parse(jsonData);
      const parsedSchema = JSON.parse(schema);
      
      // Apply custom rules to schema
      if (customRules.requireAllProperties && parsedSchema.properties) {
        parsedSchema.required = Object.keys(parsedSchema.properties);
      }

      const validate = ajv.compile(parsedSchema);
      const isValid = validate(parsedData);
      
      return {
        isValid,
        errors: validate.errors || [],
        schema: parsedSchema
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          instancePath: '',
          schemaPath: '',
          keyword: 'parse',
          message: error instanceof Error ? error.message : 'Invalid JSON or schema'
        }]
      };
    }
  }, [jsonData, schema, ajv, customRules]);

  // Notify parent component of validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation.isValid === true, validation.errors);
    }
  }, [validation, onValidationChange]);

  const loadDefaultSchema = (key: keyof typeof defaultSchemas) => {
    setSchema(defaultSchemas[key]);
  };

  const formatError = (error: any) => {
    const path = error.instancePath || '/';
    const message = error.message || 'Validation error';
    return `${path}: ${message}`;
  };

  // Always show the validator, but make it more compact initially
  const isCompactMode = !schema.trim();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Schema Validation</CardTitle>
            {validation.isValid !== null && schema.trim() && (
              <div className="flex items-center gap-1">
                {validation.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.isValid ? 'Valid' : `${validation.errors.length} error(s)`}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!schema.trim() && (
          <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <strong>💡 How to use:</strong> Add a JSON Schema below to validate your input data. 
            Use the template buttons for quick examples, or write your own schema to ensure your JSON matches the expected structure.
          </div>
        )}
        
        {/* Custom Rules */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={customRules.strictMode}
                onChange={(e) => setCustomRules(prev => ({ ...prev, strictMode: e.target.checked }))}
                className="rounded"
              />
              Strict Mode
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={customRules.allowAdditionalProperties}
                onChange={(e) => setCustomRules(prev => ({ ...prev, allowAdditionalProperties: e.target.checked }))}
                className="rounded"
              />
              Allow Additional Properties
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={customRules.requireAllProperties}
                onChange={(e) => setCustomRules(prev => ({ ...prev, requireAllProperties: e.target.checked }))}
                className="rounded"
              />
              Require All Properties
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={customRules.validateFormats}
                onChange={(e) => setCustomRules(prev => ({ ...prev, validateFormats: e.target.checked }))}
                className="rounded"
              />
              Validate Formats
            </label>
          </div>
        </div>

        {/* Schema Templates */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Templates:</span>
          {Object.keys(defaultSchemas).map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => loadDefaultSchema(key as keyof typeof defaultSchemas)}
              className="capitalize"
            >
              {key === 'empty' ? 'Clear' : key}
            </Button>
          ))}
        </div>

        {/* Schema Editor */}
        <div>
          <label className="text-sm font-medium mb-2 block">JSON Schema:</label>
          <Textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder="Enter your JSON schema here..."
            className="font-mono text-sm min-h-[200px]"
          />
        </div>

        {/* Validation Results */}
        {validation.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-600">Validation Errors:</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {validation.errors.map((error, index) => (
                <div
                  key={index}
                  className="text-sm bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded p-2"
                >
                  <code className="text-red-700 dark:text-red-300">
                    {formatError(error)}
                  </code>
                </div>
              ))}
            </div>
          </div>
        )}

        {validation.isValid && (
          <div className="text-sm bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded p-2">
            <span className="text-green-700 dark:text-green-300">
              ✅ JSON data is valid according to the schema
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};