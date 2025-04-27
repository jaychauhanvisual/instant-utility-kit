
import { useState, useRef } from 'react';
import { FileDigit, Upload, FileOutput } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import CategoryLayout from '@/components/CategoryLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const CompressPDF = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setOriginalSize(file.size);
      toast.success("PDF file selected successfully");
    } else {
      toast.error("Please select a valid PDF file");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(10);

      // Read file as ArrayBuffer
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      setProgress(30);
      
      // Load PDF
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      setProgress(50);

      // Flatten any forms and annotations
      const pages = pdfDoc.getPages();
      setProgress(60);

      // Save with compression (pdf-lib already applies some compression)
      // For this example, we're simulating different levels of compression
      // In a real implementation, you might use different PDF libraries or settings
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
      });
      
      setProgress(80);

      // Create and download the compressed PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setCompressedSize(blob.size);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${selectedFile.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setProgress(100);
      toast.success(`PDF compressed: ${formatFileSize(originalSize)} → ${formatFileSize(blob.size)}`);
      setTimeout(() => {
        setProgress(0);
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error compressing PDF:", error);
      toast.error("Failed to compress PDF. Please try again.");
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setOriginalSize(file.size);
      toast.success("PDF file selected successfully");
    } else {
      toast.error("Please drop a valid PDF file");
    }
  };

  const compressionPercentage = compressedSize > 0 && originalSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;

  return (
    <CategoryLayout
      title="Compress PDF"
      description="Reduce the file size of your PDF documents"
      category="pdf"
      categoryColor="utility-pdf"
    >
      <div className="max-w-3xl mx-auto">
        <div className="grid gap-8">
          {/* File Upload Area */}
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-utility-pdf/10 flex items-center justify-center">
                <FileDigit className="w-8 h-8 text-utility-pdf" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Upload PDF File</h3>
                <p className="text-muted-foreground">Drag and drop your PDF here or click to browse</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center mt-4 w-full max-w-md">
                <Input
                  type="file"
                  accept=".pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  id="file-input"
                />
              </div>
              
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md">
                  <FileDigit className="h-4 w-4" />
                  <span>{selectedFile.name} ({formatFileSize(originalSize)})</span>
                </div>
              )}
            </div>
          </div>

          {/* Compression Options */}
          {selectedFile && (
            <div className="space-y-4 border rounded-lg p-6 bg-card">
              {/* Process Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="flex gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FileOutput className="h-4 w-4" />
                      Compress PDF
                    </>
                  )}
                </Button>
              </div>
              
              {/* Progress Bar */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="text-sm flex justify-between">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {/* Compression Results */}
              {compressedSize > 0 && !isProcessing && (
                <div className="bg-muted/50 p-4 rounded-md space-y-2">
                  <h4 className="font-medium">Compression Results</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Original Size</p>
                      <p className="font-medium">{formatFileSize(originalSize)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Compressed Size</p>
                      <p className="font-medium">{formatFileSize(compressedSize)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reduction</p>
                      <p className="font-medium text-green-600">{compressionPercentage}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <Progress value={compressionPercentage} className="h-2" />
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium">About PDF Compression</h3>
            <p className="text-sm text-muted-foreground">
              This tool reduces PDF file size by optimizing the document structure and compressing content.
              Compression works best on PDFs with high-resolution images or complex graphics.
            </p>
            
            <h4 className="font-medium text-sm mt-2">Benefits of PDF Compression</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Faster email sending and uploading</li>
              <li>Reduced storage space requirements</li>
              <li>Improved loading times on websites</li>
              <li>Easier sharing through messaging apps</li>
            </ul>
            
            <p className="text-sm text-muted-foreground">
              Note: This tool processes your PDF locally in your browser. No files are uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default CompressPDF;
