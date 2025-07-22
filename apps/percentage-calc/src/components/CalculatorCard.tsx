import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@encodly/shared-ui';
import { Calculator } from 'lucide-react';

interface InputField {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'number' | 'select';
  options?: { value: string; label: string }[];
}

interface CalculatorCardProps {
  title: string;
  description: string;
  inputs: InputField[];
  calculate: (inputs: Record<string, any>) => { result: number; formula: string };
  onCalculate: (inputs: Record<string, any>, result: number, formula: string) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  description,
  inputs,
  calculate,
  onCalculate,
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [result, setResult] = useState<{ value: number; formula: string } | null>(null);

  const handleInputChange = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    const numericInputs: Record<string, any> = {};
    
    for (const input of inputs) {
      if (input.type === 'select') {
        numericInputs[input.name] = values[input.name] || 'add';
      } else {
        const value = parseFloat(values[input.name] || '0');
        if (isNaN(value)) return;
        numericInputs[input.name] = value;
      }
    }

    const calcResult = calculate(numericInputs);
    setResult({ value: calcResult.result, formula: calcResult.formula });
    onCalculate(numericInputs, calcResult.result, calcResult.formula);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inputs.map((input) => (
            <div key={input.name}>
              <label className="text-sm font-medium mb-1.5 block">
                {input.label}
              </label>
              {input.type === 'select' ? (
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={values[input.name] || input.options?.[0]?.value}
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                >
                  {input.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type="number"
                  placeholder={input.placeholder}
                  value={values[input.name] || ''}
                  onChange={(e) => handleInputChange(input.name, e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              )}
            </div>
          ))}

          <Button onClick={handleCalculate} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-center">
                {result.value.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                {result.formula}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};