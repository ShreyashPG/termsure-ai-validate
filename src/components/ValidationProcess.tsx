
import React from 'react';
import { Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { ValidationStatus } from '@/types';

interface ValidationProcessProps {
  status: ValidationStatus;
  documentName?: string;
}

const ValidationProcess: React.FC<ValidationProcessProps> = ({ status, documentName = '' }) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: <RefreshCw className="h-5 w-5 animate-spin" />,
          title: 'Uploading document...',
          description: 'Please wait while we upload your document.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'processing':
        return {
          icon: <RefreshCw className="h-5 w-5 animate-spin" />,
          title: 'Validating term sheet...',
          description: 'Our AI is analyzing your document for any issues.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'success':
        return {
          icon: <Check className="h-5 w-5" />,
          title: 'Validation complete',
          description: 'Your term sheet has been successfully validated.',
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-5 w-5" />,
          title: 'Validation complete with issues',
          description: 'We found some issues with your term sheet.',
          color: 'text-amber-600',
          bgColor: 'bg-amber-100'
        };
      default:
        return null;
    }
  };

  const display = getStatusDisplay();
  
  if (!display) return null;
  
  return (
    <div className="w-full p-4 rounded-lg border animate-pulse-subtle">
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${display.bgColor} ${display.color} mr-3`}>
          {display.icon}
        </div>
        <div>
          <h3 className="text-sm font-medium">{display.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{display.description}</p>
          {documentName && status !== 'idle' && (
            <div className="text-xs text-gray-400 mt-1 truncate max-w-md">
              {documentName}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress steps for the processing state */}
      {status === 'processing' && (
        <div className="mt-4">
          <div className="grid grid-cols-4 gap-1">
            <ProgressStep 
              label="Document Intake" 
              isComplete={true} 
              isActive={false} 
            />
            <ProgressStep 
              label="Text Extraction" 
              isComplete={true} 
              isActive={false} 
            />
            <ProgressStep 
              label="AI Analysis" 
              isComplete={false} 
              isActive={true} 
            />
            <ProgressStep 
              label="Validation" 
              isComplete={false} 
              isActive={false} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ProgressStepProps {
  label: string;
  isComplete: boolean;
  isActive: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ label, isComplete, isActive }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={`h-2 w-full ${isComplete ? 'bg-financial-primary' : isActive ? 'checking-animation' : 'bg-gray-200'} rounded-full`}></div>
      <span className={`text-xs mt-1 ${isComplete ? 'text-financial-primary' : isActive ? 'text-financial-primary' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
};

export default ValidationProcess;
