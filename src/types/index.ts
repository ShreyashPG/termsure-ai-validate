
// Term sheet document types
export type DocumentType = 'PDF' | 'DOCX' | 'Image' | 'Excel' | 'Text';

// Validation status types
export type ValidationStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

// Validation result for a specific field
export type FieldValidation = {
  field: string;
  value: string;
  expected?: string;
  isValid: boolean;
  confidence: number;
  message?: string;
};

// Complete validation result
export type ValidationResult = {
  status: ValidationStatus;
  overallScore: number;
  fields: FieldValidation[];
  timestamp: string;
  documentName: string;
  documentType: DocumentType;
  processingTime?: number;
  errorMessage?: string;
};

// Mock data type for sample term sheet validation rules
export type ValidationRules = {
  [key: string]: {
    required: boolean;
    pattern?: RegExp | string;
    description: string;
    validValues?: string[];
  };
};
