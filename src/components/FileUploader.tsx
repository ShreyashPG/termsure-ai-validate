
import React, { useCallback, useState } from 'react';
import { FileUp, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { determineDocumentType } from '@/utils/documentUtils';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isProcessing: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelected(file);
    }
  }, [onFileSelected]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelected(file);
    }
  }, [onFileSelected]);

  // Handle upload button click
  const handleUploadClick = useCallback(() => {
    document.getElementById('file-upload')?.click();
  }, []);

  // Clear selected file
  const handleClearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card className="w-full">
      <div 
        className={`p-6 rounded-lg border-2 border-dashed transition-all
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${selectedFile ? 'bg-green-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file" 
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
          disabled={isProcessing}
        />
        
        {!selectedFile ? (
          <div className="text-center">
            <FileUp className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              Upload a Term Sheet
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              PDF, DOCX, Excel, or image files up to 10MB
            </p>
            <div className="mt-4">
              <Button 
                type="button" 
                onClick={handleUploadClick}
                className="flex items-center"
                disabled={isProcessing}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Or drag and drop a file here
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-financial-primary/10 rounded-full">
                <FileUp className="h-6 w-6 text-financial-primary" />
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[250px]">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB · {determineDocumentType(selectedFile.name)}
                </p>
              </div>
            </div>
            {!isProcessing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default FileUploader;
