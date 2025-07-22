import React, { useState } from 'react';
import { ToolLayout } from '@encodly/shared-ui';
import { CalculatorCard } from '../components/CalculatorCard';
import { CalculationHistory } from '../components/CalculationHistory';
import { useAnalytics } from '@encodly/shared-analytics';

export interface Calculation {
  id: string;
  type: string;
  inputs: Record<string, number>;
  result: number;
  formula: string;
  timestamp: Date;
}

export const PercentageCalculatorPage: React.FC = () => {
  const [history, setHistory] = useState<Calculation[]>([]);
  const { trackToolUsage } = useAnalytics();

  const addToHistory = (calculation: Omit<Calculation, 'id' | 'timestamp'>) => {
    const newCalculation: Calculation = {
      ...calculation,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setHistory((prev) => [newCalculation, ...prev].slice(0, 10));
    trackToolUsage('percentage-calc', calculation.type, { result: calculation.result });
  };

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Calculate percentages easily with our free online percentage calculator"
      toolName="percentage-calculator"
      keywords={['percentage calculator', 'percent calculator', 'percentage increase', 'percentage decrease']}
    >
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CalculatorCard
            title="What is X% of Y?"
            description="Find what percentage of a number equals"
            inputs={[
              { name: 'percentage', label: 'Percentage (%)', placeholder: '25' },
              { name: 'number', label: 'Number', placeholder: '100' },
            ]}
            calculate={(inputs) => {
              const result = (inputs.percentage * inputs.number) / 100;
              return {
                result,
                formula: `${inputs.percentage}% × ${inputs.number} = ${result}`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'percentage-of',
                inputs,
                result,
                formula,
              });
            }}
          />

          <CalculatorCard
            title="X is what % of Y?"
            description="Find what percentage one number is of another"
            inputs={[
              { name: 'value', label: 'Value', placeholder: '25' },
              { name: 'total', label: 'Total', placeholder: '100' },
            ]}
            calculate={(inputs) => {
              const result = (inputs.value / inputs.total) * 100;
              return {
                result,
                formula: `(${inputs.value} ÷ ${inputs.total}) × 100 = ${result}%`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'what-percentage',
                inputs,
                result,
                formula,
              });
            }}
          />

          <CalculatorCard
            title="Percentage Increase/Decrease"
            description="Calculate the percentage change between two values"
            inputs={[
              { name: 'original', label: 'Original Value', placeholder: '100' },
              { name: 'new', label: 'New Value', placeholder: '125' },
            ]}
            calculate={(inputs) => {
              const change = inputs.new - inputs.original;
              const result = (change / inputs.original) * 100;
              const changeType = result >= 0 ? 'increase' : 'decrease';
              return {
                result: Math.abs(result),
                formula: `((${inputs.new} - ${inputs.original}) ÷ ${inputs.original}) × 100 = ${result.toFixed(2)}% ${changeType}`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'percentage-change',
                inputs,
                result,
                formula,
              });
            }}
          />

          <CalculatorCard
            title="Add/Subtract Percentage"
            description="Add or subtract a percentage from a number"
            inputs={[
              { name: 'number', label: 'Number', placeholder: '100' },
              { name: 'percentage', label: 'Percentage (%)', placeholder: '25' },
              {
                name: 'operation',
                label: 'Operation',
                type: 'select',
                options: [
                  { value: 'add', label: 'Add' },
                  { value: 'subtract', label: 'Subtract' },
                ],
              },
            ]}
            calculate={(inputs) => {
              const percentageAmount = (inputs.number * inputs.percentage) / 100;
              const result = inputs.operation === 'add' 
                ? inputs.number + percentageAmount 
                : inputs.number - percentageAmount;
              const operator = inputs.operation === 'add' ? '+' : '-';
              return {
                result,
                formula: `${inputs.number} ${operator} ${inputs.percentage}% = ${result}`,
              };
            }}
            onCalculate={(inputs, result, formula) => {
              addToHistory({
                type: 'add-subtract-percentage',
                inputs,
                result,
                formula,
              });
            }}
          />
        </div>

        <CalculationHistory history={history} onClear={() => setHistory([])} />
      </div>
    </ToolLayout>
  );
};