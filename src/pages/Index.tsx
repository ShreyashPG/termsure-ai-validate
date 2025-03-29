
import React, { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import FileUploader from '@/components/FileUploader';
import ValidationProcess from '@/components/ValidationProcess';
import ValidationResults from '@/components/ValidationResults';
import SampleDisplay from '@/components/SampleDisplay';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, RefreshCw, FileText, Award } from 'lucide-react';
import { ValidationStatus, ValidationResult } from '@/types';
import { extractTextFromDocument, determineDocumentType } from '@/utils/documentUtils';
import { validateTermSheet, generateSampleValidationResult } from '@/utils/validationUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ValidationStatus>('idle');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  // Handle file selection
  const handleFileSelected = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setStatus('uploading');
    
    // Simulate upload time
    setTimeout(() => {
      setStatus('processing');
      
      // Process the file
      processDocument(selectedFile);
    }, 1000);
  }, []);
  
  // Process the document and run validation
  const processDocument = async (selectedFile: File) => {
    try {
      // Extract text from document
      const text = await extractTextFromDocument(selectedFile);
      
      // Validate the term sheet
      const documentType = determineDocumentType(selectedFile.name);
      const result = await validateTermSheet(text, selectedFile.name, documentType);
      
      // Update state with validation results
      setValidationResult(result);
      setStatus(result.overallScore > 0.7 ? 'success' : 'error');
      
      // Show toast notification
      toast({
        title: result.overallScore > 0.7 
          ? "Validation successful" 
          : "Validation completed with issues",
        description: result.overallScore > 0.7
          ? "Your term sheet has been validated successfully."
          : `Found ${result.fields.filter(f => !f.isValid).length} issues that need attention.`,
        variant: result.overallScore > 0.7 ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error processing document:', error);
      setStatus('error');
      
      toast({
        title: "Validation failed",
        description: "There was an error processing your document. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Reset the validation process
  const handleReset = useCallback(() => {
    setFile(null);
    setStatus('idle');
    setValidationResult(null);
  }, []);
  
  // Handle sample selection
  const handleSampleSelect = useCallback((sampleName: string) => {
    // Create a mock file object
    const mockFile = new File([""], sampleName, {
      type: sampleName.endsWith('.pdf') ? 'application/pdf' : 'text/plain',
    });
    
    setFile(mockFile);
    setStatus('uploading');
    
    // Simulate upload and processing
    setTimeout(() => {
      setStatus('processing');
      
      // After simulated processing, show sample results
      setTimeout(() => {
        const result = generateSampleValidationResult(sampleName);
        setValidationResult(result);
        setStatus(result.status);
        
        toast({
          title: result.overallScore > 0.7 
            ? "Sample validation successful" 
            : "Sample validation completed with issues",
          description: `This is a sample result for demonstration purposes.`,
        });
      }, 2000);
    }, 1000);
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Term Sheet Validation</h2>
              {(status !== 'idle') && (status !== 'uploading') && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="text-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  New Validation
                </Button>
              )}
            </div>
            
            {status === 'idle' ? (
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileCheck className="h-5 w-5 mr-2 text-financial-primary" />
                    Upload Term Sheet
                  </CardTitle>
                  <CardDescription>
                    Upload a term sheet document to validate it using AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader 
                    onFileSelected={handleFileSelected} 
                    isProcessing={status === 'uploading' || status === 'processing'}
                  />
                </CardContent>
              </Card>
            ) : (
              <ValidationProcess 
                status={status} 
                documentName={file?.name}
              />
            )}
            
            {/* Validation Results */}
            {validationResult && (status === 'success' || status === 'error') && (
              <ValidationResults result={validationResult} />
            )}
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sample Documents Card */}
            {status === 'idle' && (
              <SampleDisplay onSampleSelect={handleSampleSelect} />
            )}
            
            {/* How It Works Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-financial-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="h-6 w-6 bg-financial-primary/10 rounded-full flex items-center justify-center text-financial-primary font-medium text-sm">
                      1
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Upload</span> - Submit your term sheet in any format (PDF, DOCX, Excel, or image)
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="h-6 w-6 bg-financial-primary/10 rounded-full flex items-center justify-center text-financial-primary font-medium text-sm">
                      2
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Extract</span> - Our AI extracts all relevant terms from your document
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="h-6 w-6 bg-financial-primary/10 rounded-full flex items-center justify-center text-financial-primary font-medium text-sm">
                      3
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Validate</span> - Terms are checked against standard formats and rules
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="h-6 w-6 bg-financial-primary/10 rounded-full flex items-center justify-center text-financial-primary font-medium text-sm">
                      4
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Review</span> - See detailed validation results with highlighted issues
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-financial-primary" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-3 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-800">Increased Efficiency</p>
                    <p className="text-xs text-green-600">Reduce validation time by up to 80%</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-800">Improved Accuracy</p>
                    <p className="text-xs text-blue-600">Reduce human errors in data handling</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-md">
                    <p className="text-sm font-medium text-amber-800">Enhanced Compliance</p>
                    <p className="text-xs text-amber-600">Ensure adherence to regulatory requirements</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-md">
                    <p className="text-sm font-medium text-purple-800">Better Resource Allocation</p>
                    <p className="text-xs text-purple-600">Free up your team for strategic tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div>
              &copy; 2023 TermSure AI. All rights reserved.
            </div>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-financial-primary">Terms</a>
              <a href="#" className="hover:text-financial-primary">Privacy</a>
              <a href="#" className="hover:text-financial-primary">Help</a>
              <a href="#" className="hover:text-financial-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
