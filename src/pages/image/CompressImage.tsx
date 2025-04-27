
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { FileDigit, UploadCloud, Download } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';
import { Label } from '@/components/ui/label';

export default function CompressImage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(80);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an image
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: "Invalid file format",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setPreview(e.target.result as string);
          setResultUrl(null); // Reset the result when a new image is selected
        }
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCompress = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please select an image to compress.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Create a canvas to compress the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setIsProcessing(false);
      toast({
        title: "Processing error",
        description: "Failed to create canvas context.",
        variant: "destructive",
      });
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert the canvas to a data URL with the desired quality
      const resultDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      setResultUrl(resultDataUrl);
      
      // Calculate compressed size
      // The data URL string length - header length divided by 4/3 (base64 encoding ratio) gives an approximation
      const header = 'data:image/jpeg;base64,';
      const base64Str = resultDataUrl.substring(header.length);
      const compressedBytes = Math.ceil((base64Str.length * 3) / 4);
      setCompressedSize(compressedBytes);
      
      setIsProcessing(false);
      
      toast({
        title: "Image compressed!",
        description: "Your image has been compressed successfully.",
      });
    };
    
    img.onerror = () => {
      setIsProcessing(false);
      toast({
        title: "Image error",
        description: "Failed to load image for compression.",
        variant: "destructive",
      });
    };
    
    img.src = preview as string;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!resultUrl) {
      toast({
        title: "No compressed image",
        description: "Please compress an image first.",
        variant: "destructive",
      });
      return;
    }
    
    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `compressed-${file?.name?.split('.')[0] || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your compressed image is being downloaded.",
    });
  };

  return (
    <CategoryLayout
      title="Compress Image"
      description="Reduce image file size while maintaining quality."
      category="image"
      categoryColor="utility-image"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <div className="flex flex-col space-y-6">
            {/* Step 1: Select image */}
            <div>
              <h2 className="text-lg font-medium mb-4">1. Select an image</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full py-8 border-dashed"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload image
                  </Button>
                </div>
                
                {/* Image details */}
                {preview && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected image</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="border rounded-md p-2 flex justify-center md:w-1/2">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="max-h-48 object-contain"
                        />
                      </div>
                      <div className="md:w-1/2 flex flex-col justify-center">
                        <p className="text-sm">
                          <span className="font-medium">Original size:</span> {formatFileSize(originalSize)}
                        </p>
                        {file && (
                          <p className="text-sm">
                            <span className="font-medium">Type:</span> {file.type}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Step 2: Set compression level */}
            {preview && (
              <div>
                <h2 className="text-lg font-medium mb-4">2. Set compression level</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="quality">Quality: {quality}%</Label>
                    </div>
                    <Slider
                      id="quality"
                      min={10}
                      max={100}
                      step={1}
                      value={[quality]}
                      onValueChange={(values) => setQuality(values[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Small file size</span>
                      <span>High quality</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Compress */}
            {preview && (
              <div>
                <h2 className="text-lg font-medium mb-4">3. Compress image</h2>
                <Button 
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileDigit className="mr-2 h-4 w-4" /> Compress Image
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Step 4: Results and download (shown only when a result is available) */}
            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium mb-4">4. Compression results</h2>
                
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Original size:</span>
                    <span>{formatFileSize(originalSize)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Compressed size:</span>
                    <span>{formatFileSize(compressedSize)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Reduction:</span>
                    <span>{Math.round(((originalSize - compressedSize) / originalSize) * 100)}%</span>
                  </div>
                </div>
                
                <div className="border rounded-md p-2 flex justify-center mb-4">
                  <img 
                    src={resultUrl} 
                    alt="Compressed" 
                    className="max-h-48 object-contain"
                  />
                </div>
                
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-utility-image hover:bg-utility-image/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Compressed Image
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">Tips for compressing images</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>JPEG format is best for photos, while PNG is better for graphics with text</li>
            <li>80% quality is usually a good balance between file size and image quality</li>
            <li>For web images, a quality setting of 60-70% is often sufficient</li>
            <li>Maximum file size: 10MB per image</li>
            <li>All processing happens in your browser - your files are never uploaded to a server</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
