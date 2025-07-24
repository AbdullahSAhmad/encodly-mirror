import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@encodly/shared-ui';
import { FileText, Clock, User, Shield, Key, ChevronDown, ChevronUp } from 'lucide-react';
import { PAYLOAD_TEMPLATES, formatJSON, getCurrentTimestamp, getFutureTimestamp, generateUUID } from '../utils/jwtUtils';

interface PayloadTemplatesProps {
  onSelectTemplate: (payload: any) => void;
  onToast?: (message: string) => void;
}

export const PayloadTemplates: React.FC<PayloadTemplatesProps> = ({
  onSelectTemplate,
  onToast,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelectTemplate = (templateKey: string) => {
    const template = PAYLOAD_TEMPLATES[templateKey as keyof typeof PAYLOAD_TEMPLATES];
    if (template) {
      // Generate fresh timestamps and UUID for each use
      const freshPayload = { ...template.payload };
      
      // Update timestamps
      if (freshPayload.iat) {
        freshPayload.iat = getCurrentTimestamp();
      }
      if (freshPayload.exp) {
        // Preserve the original duration from template
        const originalDuration = template.payload.exp - template.payload.iat;
        freshPayload.exp = getCurrentTimestamp() + originalDuration;
      }
      
      // Generate new UUID if jti exists
      if (freshPayload.jti) {
        freshPayload.jti = generateUUID();
      }
      
      onSelectTemplate(freshPayload);
      onToast?.(`Applied ${template.name} template`);
    }
  };

  const getTemplateIcon = (templateKey: string) => {
    switch (templateKey) {
      case 'basic':
        return <User className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'api':
        return <Key className="h-4 w-4" />;
      case 'refresh':
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const templates = Object.entries(PAYLOAD_TEMPLATES);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Payload Templates
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 gap-2">
            {templates.map(([key, template]) => (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start h-auto p-3"
                      onClick={() => handleSelectTemplate(key)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {getTemplateIcon(key)}
                        <div className="text-left">
                          <div className="font-medium text-sm">{template.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {Object.keys(template.payload).length} claims
                          </div>
                        </div>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="text-xs">
                      <div className="font-semibold mb-1">{template.name}</div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                        {formatJSON(template.payload)}
                      </pre>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <div className="text-xs text-muted-foreground">
              <div className="font-medium mb-1">Template Features:</div>
              <ul className="space-y-1">
                <li>• Fresh timestamps generated on each use</li>
                <li>• Unique IDs (jti) auto-generated</li>
                <li>• Industry-standard claim structures</li>
                <li>• Ready-to-use for common scenarios</li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};