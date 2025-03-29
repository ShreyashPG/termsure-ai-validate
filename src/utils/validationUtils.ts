
import { ValidationResult, ValidationStatus, FieldValidation, ValidationRules } from '../types';

// Define common validation rules for term sheets
export const termSheetValidationRules: ValidationRules = {
  'TRADE DATE': {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    description: 'Date when the trade was executed (YYYY-MM-DD)'
  },
  'EFFECTIVE DATE': {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    description: 'Date when the trade becomes effective (YYYY-MM-DD)'
  },
  'MATURITY DATE': {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    description: 'Date when the trade matures (YYYY-MM-DD)'
  },
  'TERMINATION DATE': {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    description: 'Date when the trade terminates (YYYY-MM-DD)'
  },
  'NOTIONAL AMOUNT': {
    required: true,
    pattern: /^([A-Z]{3})\s\d{1,3}(,\d{3})*(\.\d+)?$/,
    description: 'Principal amount of the trade with currency code'
  },
  'NOTIONAL': {
    required: true,
    pattern: /^([A-Z]{3})\s\d{1,3}(,\d{3})*(\.\d+)?$/,
    description: 'Principal amount of the trade with currency code'
  },
  'CURRENCY PAIR': {
    required: false,
    pattern: /^[A-Z]{3}\/[A-Z]{3}$/,
    description: 'Currency pair for FX trades (e.g., EUR/USD)'
  },
  'FIXED RATE': {
    required: false,
    pattern: /^(\d+(\.\d+)?)\%.*$/,
    description: 'Fixed interest rate percentage'
  },
  'FLOATING RATE': {
    required: false,
    description: 'Reference rate for floating payments',
    validValues: ['LIBOR', 'EURIBOR', 'SOFR', 'SONIA', 'EONIA']
  },
  'DEALER': {
    required: true,
    description: 'Financial institution acting as dealer'
  },
  'COUNTERPARTY': {
    required: true,
    description: 'Entity on the other side of the trade'
  },
  'SETTLEMENT': {
    required: false,
    description: 'How the trade will be settled',
    validValues: ['Cash', 'Physical', 'Cash settlement', 'Physical settlement']
  }
};

/**
 * Simulates AI-based term sheet validation
 * In a real implementation, this would use NLP and ML models to extract and validate terms
 */
export const validateTermSheet = async (text: string, documentName: string, documentType: string): Promise<ValidationResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Extract fields from text (in a real app this would use NLP)
  const extractedFields = extractFieldsFromText(text);
  
  // Validate each field
  const validatedFields: FieldValidation[] = [];
  let totalScore = 0;
  
  for (const [field, value] of Object.entries(extractedFields)) {
    const validation = validateField(field, value);
    validatedFields.push(validation);
    totalScore += validation.isValid ? validation.confidence : 0;
  }
  
  // Check for missing required fields
  Object.entries(termSheetValidationRules)
    .filter(([field, rule]) => rule.required && !extractedFields[field])
    .forEach(([field, rule]) => {
      validatedFields.push({
        field,
        value: '',
        isValid: false,
        confidence: 0,
        message: 'Required field is missing'
      });
    });
  
  // Calculate overall score (average of individual scores)
  const overallScore = validatedFields.length > 0 
    ? totalScore / Object.keys(termSheetValidationRules).filter(k => termSheetValidationRules[k].required).length
    : 0;
  
  return {
    status: overallScore > 0.7 ? 'success' : 'error',
    overallScore,
    fields: validatedFields,
    timestamp: new Date().toISOString(),
    documentName,
    documentType: documentType as any,
    processingTime: 2.0 + Math.random()
  };
};

/**
 * Extract fields from text using simple pattern matching
 * In a real implementation, this would use NLP techniques
 */
const extractFieldsFromText = (text: string): Record<string, string> => {
  const fields: Record<string, string> = {};
  
  // Simple regex-based extraction for demo purposes
  // In a real app, we would use more sophisticated NLP techniques
  const lines = text.split('\n').map(line => line.trim());
  
  for (const line of lines) {
    // Try to match "KEY: VALUE" pattern
    const match = line.match(/^([^:]+):\s*(.+)$/);
    if (match) {
      const [_, key, value] = match;
      fields[key.trim().toUpperCase()] = value.trim();
    }
  }
  
  return fields;
};

/**
 * Validate an individual field based on the rules
 */
const validateField = (field: string, value: string): FieldValidation => {
  const rule = termSheetValidationRules[field];
  
  if (!rule) {
    // Field isn't in our validation rules, but might still be valid metadata
    return {
      field,
      value,
      isValid: true,
      confidence: 0.7,
      message: 'Field not in standard validation rules but may be valid'
    };
  }
  
  let isValid = true;
  let confidence = 1.0;
  let message = '';
  
  // Check pattern if specified
  if (rule.pattern) {
    const pattern = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern;
    isValid = pattern.test(value);
    if (!isValid) {
      message = `Value doesn't match expected format`;
      confidence = 0.3;
    }
  }
  
  // Check valid values if specified
  if (rule.validValues && isValid) {
    const valueNormalized = value.toUpperCase();
    // Check if the value contains any of the valid values
    const containsValidValue = rule.validValues.some(validValue => 
      valueNormalized.includes(validValue.toUpperCase())
    );
    
    if (!containsValidValue) {
      isValid = false;
      message = `Value should contain one of: ${rule.validValues.join(', ')}`;
      confidence = 0.2;
    }
  }
  
  return {
    field,
    value,
    isValid,
    confidence,
    message
  };
};

/**
 * Generate sample validation result for testing UI
 */
export const generateSampleValidationResult = (documentName: string): ValidationResult => {
  const fields: FieldValidation[] = [
    {
      field: 'TRADE DATE',
      value: '2023-05-15',
      isValid: true,
      confidence: 0.98,
    },
    {
      field: 'EFFECTIVE DATE',
      value: '2023-05-18',
      isValid: true,
      confidence: 0.96,
    },
    {
      field: 'MATURITY DATE',
      value: '2024-05-18',
      isValid: true,
      confidence: 0.97,
    },
    {
      field: 'NOTIONAL AMOUNT',
      value: 'USD 10,000,000',
      isValid: true,
      confidence: 0.99,
    },
    {
      field: 'DEALER',
      value: 'Global Bank Ltd',
      isValid: true,
      confidence: 0.92,
    },
    {
      field: 'COUNTERPARTY',
      value: 'Hedge Fund Capital LLC',
      isValid: true,
      confidence: 0.94,
    },
    {
      field: 'PAYMENT TERMS',
      value: 'Quarterly',
      isValid: false,
      confidence: 0.65,
      expected: 'Monthly',
      message: 'Payment frequency does not match standard terms',
    },
    {
      field: 'SETTLEMENT CURRENCY',
      value: 'USD',
      isValid: true,
      confidence: 0.98,
    },
  ];
  
  return {
    status: 'success',
    overallScore: 0.83,
    fields,
    timestamp: new Date().toISOString(),
    documentName,
    documentType: 'PDF',
    processingTime: 1.2
  };
};
