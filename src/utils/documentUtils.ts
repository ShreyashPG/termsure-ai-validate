
import { DocumentType, ValidationStatus, ValidationResult, FieldValidation } from '../types';

/**
 * Determines document type from file extension
 */
export const determineDocumentType = (fileName: string): DocumentType => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch(extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'DOCX';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'Image';
    case 'xls':
    case 'xlsx':
      return 'Excel';
    default:
      return 'Text';
  }
};

/**
 * Extracts text from documents using appropriate method based on document type
 * In a real implementation, this would integrate with OCR services for images
 * and specific document parsers for other formats
 */
export const extractTextFromDocument = async (file: File): Promise<string> => {
  // In a real implementation, this would use appropriate libraries 
  // to extract text based on file type
  const documentType = determineDocumentType(file.name);
  
  // Demo implementation for text-based files
  if (documentType === 'Text') {
    return await file.text();
  }
  
  // For demo purposes, we'll simulate OCR/extraction with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we would actually process the file
      // For now, return a mock extraction result based on file name
      const mockText = generateMockTextBasedOnFileName(file.name);
      resolve(mockText);
    }, 1500);
  });
};

/**
 * Generate mock text for demonstration purposes
 */
const generateMockTextBasedOnFileName = (fileName: string): string => {
  // Simple logic to generate different mock text based on filename
  if (fileName.toLowerCase().includes('equity')) {
    return `EQUITY SWAP TERM SHEET
    
TRADE DATE: 2023-05-15
EFFECTIVE DATE: 2023-05-18
MATURITY DATE: 2024-05-18

NOTIONAL AMOUNT: USD 10,000,000
EQUITY UNDERLYING: AAPL US Equity
DEALER: Global Bank Ltd
COUNTERPARTY: Hedge Fund Capital LLC

PAYMENT DETAILS:
- Equity Return: Counterparty receives 100% of price appreciation
- Financing Fee: LIBOR + 50bps paid quarterly
- Dividend: 100% of dividends passed to Counterparty
- Settlement: Cash settlement in USD
`;
  } else if (fileName.toLowerCase().includes('interest')) {
    return `INTEREST RATE SWAP TERM SHEET
    
TRADE DATE: 2023-06-20
EFFECTIVE DATE: 2023-06-25
TERMINATION DATE: 2028-06-25

NOTIONAL AMOUNT: EUR 15,000,000
FIXED RATE PAYER: Corporate Finance Inc.
FIXED RATE: 3.25% per annum
FIXED RATE PAYMENT DATES: Semi-annually on 25th

FLOATING RATE PAYER: Investment Bank AG
FLOATING RATE: 6M EURIBOR
FLOATING RATE PAYMENT DATES: Semi-annually on 25th

BUSINESS DAY CONVENTION: Modified Following
CALCULATION AGENT: Investment Bank AG
`;
  } else if (fileName.toLowerCase().includes('fx') || fileName.toLowerCase().includes('forex')) {
    return `FX FORWARD TERM SHEET
    
TRADE DATE: 2023-07-10
SETTLEMENT DATE: 2023-10-10

CURRENCY PAIR: EUR/USD
DIRECTION: Client buys EUR, sells USD
AMOUNT: EUR 5,000,000
FORWARD RATE: 1.1025
USD EQUIVALENT: USD 5,512,500

CLIENT: European Exports Ltd
DEALER: Global FX Bank
SETTLEMENT INSTRUCTIONS: Via SWIFT
`;
  } else {
    return `GENERIC TERM SHEET
    
TRADE DATE: 2023-08-01
EFFECTIVE DATE: 2023-08-05
MATURITY DATE: 2025-08-05

PRODUCT TYPE: Structured Note
NOTIONAL: USD 5,000,000
ISSUER: Financial Products Inc.
INVESTOR: Institutional Investor LLC

COUPON: 4.5% p.a. paid quarterly
UNDERLYING: S&P 500 Index
BARRIER LEVEL: 75% of initial level
CALL FEATURE: Callable after 12 months at 102%
`;
  }
};

/**
 * Export the validation results to a CSV format
 */
export const exportValidationResultsToCSV = (results: ValidationResult): string => {
  const headers = ['Field', 'Value', 'Expected', 'Valid', 'Confidence', 'Message'];
  const rows = results.fields.map(field => [
    field.field,
    field.value,
    field.expected || '',
    field.isValid ? 'Yes' : 'No',
    `${Math.round(field.confidence * 100)}%`,
    field.message || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

/**
 * Helper function to create a download for exported data
 */
export const downloadAsFile = (content: string, filename: string, contentType: string): void => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
