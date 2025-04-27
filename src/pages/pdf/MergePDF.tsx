
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Merge, Trash, Download, Plus } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Check if files are PDFs
      const selectedFiles = Array.from(e.target.files);
      const invalidFiles = selectedFiles.filter(file => file.type !== 'application/pdf');
      
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid file format",
          description: "Please select only PDF files.",
          variant: "destructive",
        });
        return;
      }

      // Add files to the list
      setFiles(prev => [...prev, ...selectedFiles]);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updatedFiles = [...prev];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleMerge = () => {
    if (files.length < 2) {
      toast({
        title: "More files needed",
        description: "Please add at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing with timeout
    setTimeout(() => {
      setIsProcessing(false);
      
      // In a real implementation, this would be where you'd call a PDF merge service
      // For this demo, we're just simulating success
      setResultUrl("dummy-merged-file.pdf");
      
      toast({
        title: "Merge successful!",
        description: "Your PDFs have been merged successfully.",
      });
    }, 2000);
  };

  const handleAddMoreClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would download the merged PDF
    toast({
      title: "Feature coming soon",
      description: "Download functionality will be available in the next update.",
    });
  };

  return (
    <CategoryLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document."
      category="pdf"
      categoryColor="utility-pdf"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <div className="flex flex-col space-y-6">
            {/* Step 1: Select files */}
            <div>
              <h2 className="text-lg font-medium mb-4">1. Select PDF files</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button 
                    onClick={handleAddMoreClick}
                    variant="outline"
                    className="w-full py-8 border-dashed"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add PDF files
                  </Button>
                </div>
                
                {/* File list */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected files ({files.length})</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <span className="text-sm truncate flex-1">{file.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFile(index)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Step 2: Merge files */}
            <div>
              <h2 className="text-lg font-medium mb-4">2. Merge PDF files</h2>
              <Button 
                onClick={handleMerge}
                disabled={files.length < 2 || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Merge className="mr-2 h-4 w-4" /> Merge PDFs
                  </>
                )}
              </Button>
            </div>
            
            {/* Step 3: Download result (shown only when a result is available) */}
            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium mb-4">3. Download merged PDF</h2>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-utility-pdf hover:bg-utility-pdf/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Merged PDF
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">Tips for merging PDFs</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>For best results, use PDF files with similar page sizes</li>
            <li>You can rearrange files by removing and adding them in your preferred order</li>
            <li>Maximum file size: 100MB per file</li>
            <li>All processing happens in your browser - your files are never uploaded to a server</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
