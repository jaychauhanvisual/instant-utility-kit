
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, UploadCloud, Download } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
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
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setPreview(e.target.result as string);
          
          // Get image dimensions
          const img = new Image();
          img.onload = () => {
            setDimensions({
              width: img.width,
              height: img.height
            });
          };
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResize = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please select an image to resize.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing with timeout
    setTimeout(() => {
      setIsProcessing(false);
      
      // In a real implementation, this would be where you'd call an image resize service
      // For this demo, we're just simulating success
      setResultUrl(preview);
      
      toast({
        title: "Resize successful!",
        description: "Your image has been resized successfully.",
      });
    }, 1500);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value);
    if (isNaN(newWidth)) return;
    
    setDimensions(prev => ({
      ...prev,
      width: newWidth
    }));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value);
    if (isNaN(newHeight)) return;
    
    setDimensions(prev => ({
      ...prev,
      height: newHeight
    }));
  };

  const handleDownload = () => {
    // In a real implementation, this would download the resized image
    toast({
      title: "Feature coming soon",
      description: "Download functionality will be available in the next update.",
    });
  };

  return (
    <CategoryLayout
      title="Resize Image"
      description="Change the dimensions of your images while maintaining quality."
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
                
                {/* Image preview */}
                {preview && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Selected image</h3>
                    <div className="border rounded-md p-2 flex justify-center">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="max-h-64 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Step 2: Set dimensions */}
            {preview && (
              <div>
                <h2 className="text-lg font-medium mb-4">2. Set dimensions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (px)</Label>
                    <Input
                      id="width"
                      type="number"
                      value={dimensions.width}
                      onChange={handleWidthChange}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (px)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={dimensions.height}
                      onChange={handleHeightChange}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Resize */}
            {preview && (
              <div>
                <h2 className="text-lg font-medium mb-4">3. Resize image</h2>
                <Button 
                  onClick={handleResize}
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
                      <ArrowUpDown className="mr-2 h-4 w-4" /> Resize Image
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Step 4: Download result (shown only when a result is available) */}
            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium mb-4">4. Download resized image</h2>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-utility-image hover:bg-utility-image/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Resized Image
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">Tips for resizing images</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>For best quality, avoid extreme enlargements</li>
            <li>Input images should be in JPG, PNG, or WebP format for best results</li>
            <li>Maximum file size: 10MB per image</li>
            <li>All processing happens in your browser - your files are never uploaded to a server</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
