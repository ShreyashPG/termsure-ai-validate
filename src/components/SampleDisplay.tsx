
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface SampleDisplayProps {
  onSampleSelect: (sampleName: string) => void;
}

const SampleDisplay: React.FC<SampleDisplayProps> = ({ onSampleSelect }) => {
  const samples = [
    {
      name: 'Equity_Swap.pdf',
      description: 'Standard equity swap term sheet with standard terms',
      label: 'Clean',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      name: 'Interest_Rate_Swap.pdf',
      description: 'Interest rate swap with minor formatting issues',
      label: 'Minor Issues',
      icon: AlertTriangle,
      color: 'text-amber-500'
    },
    {
      name: 'FX_Forward.pdf',
      description: 'FX forward with missing required fields',
      label: 'Missing Fields',
      icon: AlertTriangle,
      color: 'text-red-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sample Term Sheets</CardTitle>
        <CardDescription>
          Try validation with these sample term sheets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {samples.map((sample) => (
            <div 
              key={sample.name}
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => onSampleSelect(sample.name)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-financial-primary/10 rounded-full">
                  <FileText className="h-5 w-5 text-financial-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{sample.name}</p>
                  <p className="text-xs text-gray-500">{sample.description}</p>
                </div>
              </div>
              <div className={`flex items-center text-xs ${sample.color} font-medium`}>
                <sample.icon className="h-3 w-3 mr-1" />
                {sample.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SampleDisplay;
