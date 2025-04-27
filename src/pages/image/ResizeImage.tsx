
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpDown, UploadCloud, Download, Lock, Unlock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import CategoryLayout from '@/components/CategoryLayout';

export default function ResizeImage() {
  const [file, setFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
            const originalWidth = img.width;
            const originalHeight = img.height;
            
            setOriginalDimensions({ 
              width: originalWidth, 
              height: originalHeight 
            });
            
            setDimensions({
              width: originalWidth,
              height: originalHeight
            });
            
            setAspectRatio(originalWidth / originalHeight);
          };
          img.src = e.target.result as string;
        }
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset the result
      setResultUrl(null);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResize = async () => {
    if (!file || !preview) {
      toast({
        title: "No image selected",
        description: "Please select an image to resize.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Create a canvas and resize the image
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Create a new image from preview
      const img = new Image();
      img.src = preview;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Draw and resize the image to canvas
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      
      // Get the resized image as data URL
      const resizedImageUrl = canvas.toDataURL(file.type || 'image/png', 0.85);
      setResultUrl(resizedImageUrl);
      
      toast({
        title: "Resize successful!",
        description: "Your image has been resized successfully.",
      });
    } catch (error) {
      console.error('Error resizing image:', error);
      toast({
        title: "Error resizing image",
        description: "An error occurred while resizing the image.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value) || 0;
    if (newWidth <= 0) return;
    
    setDimensions(prev => {
      if (aspectRatioLocked && prev.height) {
        // Maintain aspect ratio if locked
        const newHeight = Math.round(newWidth / aspectRatio);
        return { width: newWidth, height: newHeight };
      }
      return { ...prev, width: newWidth };
    });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value) || 0;
    if (newHeight <= 0) return;
    
    setDimensions(prev => {
      if (aspectRatioLocked && prev.width) {
        // Maintain aspect ratio if locked
        const newWidth = Math.round(newHeight * aspectRatio);
        return { width: newWidth, height: newHeight };
      }
      return { ...prev, height: newHeight };
    });
  };

  const toggleAspectRatio = () => {
    setAspectRatioLocked(!aspectRatioLocked);
  };

  const handlePercentChange = (value: number[]) => {
    const percent = value[0];
    if (originalDimensions.width && originalDimensions.height) {
      const newWidth = Math.round((originalDimensions.width * percent) / 100);
      const newHeight = Math.round((originalDimensions.height * percent) / 100);
      setDimensions({ width: newWidth, height: newHeight });
    }
  };

  const handleDownload = () => {
    if (!resultUrl) {
      toast({
        title: "No image to download",
        description: "Please resize an image first.",
        variant: "destructive",
      });
      return;
    }

    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = resultUrl;
    // Use original filename with size appended
    const fileName = file ? `resized-${dimensions.width}x${dimensions.height}-${file.name}` : 'resized-image.png';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your resized image is downloading.",
    });
  };

  // Reset to original dimensions
  const handleReset = () => {
    if (originalDimensions.width && originalDimensions.height) {
      setDimensions({
        width: originalDimensions.width,
        height: originalDimensions.height,
      });
    }
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
                    <h3 className="text-sm font-medium mb-2">
                      Selected image {originalDimensions.width > 0 ? `(${originalDimensions.width}x${originalDimensions.height})` : ''}
                    </h3>
                    <div className="border rounded-md p-2 flex justify-center">
                      <img 
                        ref={imageRef}
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
                
                {/* Scale slider */}
                <div className="mb-6">
                  <Label htmlFor="scale" className="block mb-2">Scale: {Math.round((dimensions.width / originalDimensions.width) * 100)}%</Label>
                  <Slider 
                    defaultValue={[100]} 
                    min={10} 
                    max={200} 
                    step={1}
                    value={[Math.round((dimensions.width / originalDimensions.width) * 100)]}
                    onValueChange={handlePercentChange}
                    className="mb-4"
                  />
                </div>
                
                {/* Aspect ratio lock toggle */}
                <div className="flex items-center mb-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleAspectRatio}
                    className="mr-2"
                  >
                    {aspectRatioLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {aspectRatioLocked ? "Aspect ratio locked" : "Aspect ratio unlocked"}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReset}
                    className="ml-auto text-xs"
                  >
                    Reset to original
                  </Button>
                </div>
                
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
            
            {/* Step 4: Preview and Download result (shown only when a result is available) */}
            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium mb-4">4. Download resized image</h2>
                <div className="border rounded-md overflow-hidden mb-4">
                  <div className="flex justify-center bg-gray-100 p-4">
                    <img 
                      src={resultUrl} 
                      alt="Resized result" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-utility-image hover:bg-utility-image/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Resized Image ({dimensions.width}x{dimensions.height})
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
            <li>Keep aspect ratio locked to prevent image distortion</li>
            <li>Use the scale slider for quick proportional resizing</li>
            <li>Input images should be in JPG, PNG, or WebP format for best results</li>
            <li>All processing happens in your browser - your files are never uploaded to a server</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
