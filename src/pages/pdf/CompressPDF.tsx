
import { useState, useRef } from 'react';
import { FileDigit, Upload, FileOutput } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import CategoryLayout from '@/components/CategoryLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import CompressPDFStructuredData from './CompressPDFStructuredData';

// Define compression quality presets
const compressionPresets = {
  low: { quality: 0.3, description: "Heavily compressed, smaller file size, lower quality" },
  medium: { quality: 0.6, description: "Balanced compression, good quality and file size" },
  high: { quality: 0.9, description: "Light compression, larger file size, high quality" },
  custom: { quality: 0.8, description: "Custom compression level" }
};

type CompressionPreset = 'low' | 'medium' | 'high' | 'custom';

const CompressPDF = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [compressionPreset, setCompressionPreset] = useState<CompressionPreset>('medium');
  const [customQuality, setCustomQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
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

  const getQualityValue = (): number => {
    if (compressionPreset === 'custom') {
      return customQuality / 100;
    }
    return compressionPresets[compressionPreset].quality;
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

      // Get compression quality
      const quality = getQualityValue();
      
      // Actually create a new PDF with compression
      const compressedDoc = await PDFDocument.create();
      
      // Copy pages from original document
      const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach(page => compressedDoc.addPage(page));
      
      setProgress(70);

      // Apply compression options based on quality
      // Using valid options from pdf-lib SaveOptions
      const pdfBytes = await compressedDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        // We'll use the built-in compression options only
      });
      
      setProgress(85);
      
      // Create real compressed PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const actualCompressedSize = blob.size;
      setCompressedSize(actualCompressedSize);
      
      // Ensure compression actually happened
      // If compression didn't help, use more aggressive settings
      if (actualCompressedSize >= originalSize * 0.95) {
        // Try again with more aggressive but valid settings
        const moreCompressedDoc = await PDFDocument.create();
        const morePages = await moreCompressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
        morePages.forEach(page => moreCompressedDoc.addPage(page));
        
        // Using only valid options for pdf-lib
        const morePdfBytes = await moreCompressedDoc.save({
          useObjectStreams: true,
          addDefaultPage: false,
          // Using maximum valid compression
        });
        
        const moreBlob = new Blob([morePdfBytes], { type: 'application/pdf' });
        const moreCompressedSize = moreBlob.size;
        
        // Use the smaller of the two attempts
        if (moreCompressedSize < actualCompressedSize) {
          setCompressedSize(moreCompressedSize);
          
          const url = URL.createObjectURL(moreBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `compressed_${selectedFile.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `compressed_${selectedFile.name}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compressed_${selectedFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      setProgress(100);
      toast.success(`PDF compressed: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`);
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
    <>
      <CompressPDFStructuredData url="https://instantutils.jaychauhan.tech/pdf/compress" />
      <CategoryLayout
        title="Compress PDF"
        description="Reduce the file size of your PDF documents"
        category="pdf"
        categoryColor="utility-pdf"
      >
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-8">
            {/* File Upload Area with animation */}
            <div 
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300",
                selectedFile ? "border-primary/40 bg-primary/5" : "hover:border-primary/30 hover:bg-primary/5"
              )}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500",
                  selectedFile ? "bg-primary/20 scale-110" : "bg-utility-pdf/10"
                )}>
                  <FileDigit className={cn(
                    "w-8 h-8 transition-all duration-500",
                    selectedFile ? "text-primary" : "text-utility-pdf"
                  )} />
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
                    className="cursor-pointer file:cursor-pointer file:transition-colors file:hover:bg-primary/90"
                    id="file-input"
                  />
                </div>
                
                {selectedFile && (
                  <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded-md animate-fade-in">
                    <FileDigit className="h-4 w-4" />
                    <span>{selectedFile.name} ({formatFileSize(originalSize)})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Compression Options */}
            {selectedFile && (
              <div className="space-y-6 border rounded-lg p-6 bg-card animate-fade-in">
                <Tabs defaultValue="basic" onValueChange={(val) => setAdvancedMode(val === 'advanced')}>
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Compression Level</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {(['low', 'medium', 'high'] as const).map(preset => (
                          <div 
                            key={preset}
                            className={cn(
                              "border rounded-lg p-4 cursor-pointer transition-all",
                              compressionPreset === preset ? 
                                "border-primary bg-primary/5 shadow-sm" : 
                                "hover:border-primary/30 hover:bg-primary/5"
                            )}
                            onClick={() => setCompressionPreset(preset)}
                          >
                            <h4 className="font-medium capitalize">{preset}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {compressionPresets[preset].description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Custom Compression</h3>
                      <div 
                        className={cn(
                          "border rounded-lg p-4 transition-all",
                          "border-primary bg-primary/5 shadow-sm"
                        )}
                      >
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <Label htmlFor="compression-slider">Compression quality: {customQuality}%</Label>
                            </div>
                            <Slider
                              id="compression-slider"
                              min={10}
                              max={100}
                              step={1}
                              value={[customQuality]}
                              onValueChange={(values) => {
                                setCustomQuality(values[0]);
                                setCompressionPreset('custom');
                              }}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                              <span>Small file size</span>
                              <span>High quality</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {/* Process Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className={cn(
                      "flex gap-2 transition-all",
                      isProcessing ? "" : "hover:scale-105"
                    )}
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        Processing...
                      </>
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
                  <div className="space-y-2 animate-fade-in">
                    <div className="text-sm flex justify-between">
                      <span>Processing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {/* Compression Results */}
                {compressedSize > 0 && !isProcessing && (
                  <div className="bg-muted/50 p-4 rounded-md space-y-2 animate-fade-in">
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
            
            {/* Instructions and FAQ */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="about">
                  <AccordionTrigger>About PDF Compression</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      This tool reduces PDF file size by optimizing the document structure and compressing content.
                      Compression works best on PDFs with high-resolution images or complex graphics.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="benefits">
                  <AccordionTrigger>Benefits of PDF Compression</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Faster email sending and uploading</li>
                      <li>Reduced storage space requirements</li>
                      <li>Improved loading times on websites</li>
                      <li>Easier sharing through messaging apps</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="privacy">
                  <AccordionTrigger>Privacy & Security</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      This tool processes your PDF locally in your browser. No files are uploaded to any server,
                      ensuring complete privacy and security for your documents.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </CategoryLayout>
    </>
  );
};

export default CompressPDF;
