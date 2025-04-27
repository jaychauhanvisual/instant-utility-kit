
import { useState, useRef } from 'react';
import { FileDigit, Upload, FileOutput, ScissorsSquare } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import CategoryLayout from '@/components/CategoryLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const SplitPDF = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setFileName(file.name.replace('.pdf', ''));
      toast.success("PDF file selected successfully");
    } else {
      toast.error("Please select a valid PDF file");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSplit = async () => {
    if (!selectedFile || !pageRanges.trim()) {
      toast.error("Please select a file and specify page ranges");
      return;
    }

    try {
      setIsProcessing(true);
      setProgress(10);

      // Parse page ranges
      const ranges = pageRanges
        .split(',')
        .map(range => range.trim())
        .filter(range => range !== '');
      
      if (ranges.length === 0) {
        toast.error("Please specify valid page ranges");
        setIsProcessing(false);
        return;
      }

      // Read file as ArrayBuffer
      const fileArrayBuffer = await selectedFile.arrayBuffer();
      setProgress(30);
      
      // Load PDF
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      const totalPages = pdfDoc.getPageCount();
      setProgress(50);

      // Process each range and create separate PDFs
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        
        // Parse range (e.g., "1-5" or "3")
        let startPage: number, endPage: number;
        if (range.includes('-')) {
          [startPage, endPage] = range.split('-').map(p => parseInt(p, 10));
        } else {
          startPage = endPage = parseInt(range, 10);
        }

        // Adjust for 0-based index and validate
        startPage = Math.max(1, startPage) - 1;
        endPage = Math.min(totalPages, endPage) - 1;
        
        if (startPage > endPage || startPage < 0 || endPage >= totalPages) {
          toast.error(`Invalid range: ${range}`);
          continue;
        }

        // Create a new PDF with just these pages
        const newPdf = await PDFDocument.create();
        const pagesToCopy = [];
        for (let j = startPage; j <= endPage; j++) {
          pagesToCopy.push(j);
        }
        
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
        copiedPages.forEach(page => {
          newPdf.addPage(page);
        });

        // Save the new PDF
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        
        // Create download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}_pages_${range}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setProgress(50 + (i + 1) * 50 / ranges.length);
      }

      setProgress(100);
      toast.success("PDF split successfully!");
      setTimeout(() => {
        setProgress(0);
        setIsProcessing(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error splitting PDF:", error);
      toast.error("Failed to split PDF. Please try again.");
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
      setFileName(file.name.replace('.pdf', ''));
      toast.success("PDF file selected successfully");
    } else {
      toast.error("Please drop a valid PDF file");
    }
  };

  return (
    <CategoryLayout
      title="Split PDF"
      description="Separate PDF pages into multiple files"
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
                <ScissorsSquare className="w-8 h-8 text-utility-pdf" />
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
                  <span>{selectedFile.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Page Ranges Input */}
          {selectedFile && (
            <div className="space-y-4 border rounded-lg p-6 bg-card">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="page-ranges">Page Ranges</Label>
                  <span className="text-xs text-muted-foreground">Example: 1-3, 5, 7-10</span>
                </div>
                <Textarea
                  id="page-ranges"
                  placeholder="Enter page ranges (e.g., 1-3, 5, 7-10)"
                  value={pageRanges}
                  onChange={(e) => setPageRanges(e.target.value)}
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground">Each range will create a separate PDF file</p>
              </div>
              
              {/* Process Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleSplit}
                  disabled={isProcessing || !pageRanges.trim()}
                  className="flex gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FileOutput className="h-4 w-4" />
                      Split PDF
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
            </div>
          )}
          
          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-medium">How to Split a PDF</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Upload your PDF file using the drag-and-drop area or file browser</li>
              <li>Enter page ranges for splitting (e.g., 1-3, 5, 7-10)</li>
              <li>Click "Split PDF" to process</li>
              <li>Download individual PDF files for each page range</li>
            </ol>
            <p className="text-sm text-muted-foreground">
              Note: This tool processes your PDF locally in your browser. No files are uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default SplitPDF;
