
import React from 'react';
import { 
  Check, X, AlertTriangle, Download, Clock, Info, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ValidationResult, FieldValidation } from '@/types';
import { exportValidationResultsToCSV, downloadAsFile } from '@/utils/documentUtils';

interface ValidationResultsProps {
  result: ValidationResult;
}

const ValidationResults: React.FC<ValidationResultsProps> = ({ result }) => {
  // Function to handle exporting validation results
  const handleExport = () => {
    const csvContent = exportValidationResultsToCSV(result);
    downloadAsFile(
      csvContent, 
      `validation-${result.documentName.replace(/\.\w+$/, '')}-${new Date().toISOString().slice(0,10)}.csv`,
      'text/csv'
    );
  };

  // Calculate validation stats
  const validCount = result.fields.filter(field => field.isValid).length;
  const errorCount = result.fields.filter(field => !field.isValid).length;
  const overallPercentage = Math.round(result.overallScore * 100);

  return (
    <Card className="w-full shadow-sm">
      <CardContent className="p-0">
        {/* Header with overall score */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Validation Results</h3>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {result.processingTime?.toFixed(1)}s
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs" 
                onClick={handleExport}
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="mt-3 grid grid-cols-4 gap-2">
            <div className="bg-white rounded-md p-3 border">
              <div className="text-2xl font-bold">
                {overallPercentage}%
              </div>
              <div className="text-xs text-gray-500">Overall Score</div>
            </div>
            <div className="bg-white rounded-md p-3 border">
              <div className="text-2xl font-bold text-green-600">
                {validCount}
              </div>
              <div className="text-xs text-gray-500">Valid Fields</div>
            </div>
            <div className="bg-white rounded-md p-3 border">
              <div className="text-2xl font-bold text-red-600">
                {errorCount}
              </div>
              <div className="text-xs text-gray-500">Issues Found</div>
            </div>
            <div className="bg-white rounded-md p-3 border">
              <div className="text-2xl font-bold">
                {result.fields.length}
              </div>
              <div className="text-xs text-gray-500">Total Fields</div>
            </div>
          </div>
        </div>
        
        {/* Field validations */}
        <div className="p-4">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="valid-fields">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center text-sm">
                  <div className="mr-2 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="font-medium">Valid Fields ({validCount})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  {result.fields
                    .filter(field => field.isValid)
                    .map((field, index) => (
                      <FieldValidationItem key={index} field={field} />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="invalid-fields">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center text-sm">
                  <div className="mr-2 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-3 w-3 text-red-600" />
                  </div>
                  <span className="font-medium">Issues Found ({errorCount})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  {result.fields
                    .filter(field => !field.isValid)
                    .map((field, index) => (
                      <FieldValidationItem key={index} field={field} />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

// Component for individual field validation results
const FieldValidationItem: React.FC<{ field: FieldValidation }> = ({ field }) => {
  const confidencePercentage = Math.round(field.confidence * 100);
  
  return (
    <div className={`p-3 rounded-md border ${field.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="flex justify-between">
        <div className="font-medium text-sm">{field.field}</div>
        <div className="text-xs px-2 py-0.5 rounded-full bg-white border">
          {confidencePercentage}% confidence
        </div>
      </div>
      <div className="mt-1 text-sm">
        <span className="font-medium">Value:</span> {field.value}
      </div>
      {field.expected && (
        <div className="mt-1 text-sm">
          <span className="font-medium">Expected:</span> {field.expected}
        </div>
      )}
      {field.message && (
        <div className="mt-1 text-xs text-gray-600 flex items-center">
          <Info className="h-3 w-3 mr-1" /> {field.message}
        </div>
      )}
    </div>
  );
};

export default ValidationResults;
