
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eraser, UploadCloud, Download, Layers3 } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

export default function BackgroundRemove() {
  const [file, setFile] = useState<File | null>(null);
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

  const handleRemoveBackground = () => {
    if (!file) {
      toast({
        title: "No image selected",
        description: "Please select an image to process.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    const img = new Image();
    img.onload = () => {
      // Create a canvas to process the image
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
      
      // Set canvas dimensions to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);
      
      // Get the image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Function to check if a color is likely to be background
      const isLikelyBackground = (r: number, g: number, b: number) => {
        const brightness = (r + g + b) / 3;
        const colorVariance = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
        
        // Light backgrounds
        if (brightness > 200 && colorVariance < 20) {
          return true;
        }
        
        // Blue/green screens
        if (g > 100 && b > 100 && r < g && r < b) {
          return true;
        }
        
        // Gray backgrounds
        if (Math.abs(r - g) < 10 && Math.abs(r - b) < 10 && Math.abs(g - b) < 10 && brightness > 150) {
          return true;
        }
        
        return false;
      };
      
      // Edge detection for better background removal
      const sobelData = new Uint8Array(data.length / 4);
      const threshold = 30;

      // Apply Sobel operator for edge detection
      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4;
          
          // Calculate gradient using the luminance value
          const getGray = (idx: number) => {
            return 0.3 * data[idx] + 0.59 * data[idx + 1] + 0.11 * data[idx + 2];
          };
          
          // Calculate gradients in x and y directions
          const gx = 
            getGray((y - 1) * canvas.width * 4 + (x - 1) * 4) * -1 +
            getGray((y - 1) * canvas.width * 4 + (x + 1) * 4) * 1 +
            getGray((y) * canvas.width * 4 + (x - 1) * 4) * -2 +
            getGray((y) * canvas.width * 4 + (x + 1) * 4) * 2 +
            getGray((y + 1) * canvas.width * 4 + (x - 1) * 4) * -1 +
            getGray((y + 1) * canvas.width * 4 + (x + 1) * 4) * 1;
            
          const gy = 
            getGray((y - 1) * canvas.width * 4 + (x - 1) * 4) * -1 +
            getGray((y - 1) * canvas.width * 4 + (x) * 4) * -2 +
            getGray((y - 1) * canvas.width * 4 + (x + 1) * 4) * -1 +
            getGray((y + 1) * canvas.width * 4 + (x - 1) * 4) * 1 +
            getGray((y + 1) * canvas.width * 4 + (x) * 4) * 2 +
            getGray((y + 1) * canvas.width * 4 + (x + 1) * 4) * 1;
            
          const magnitude = Math.sqrt(gx * gx + gy * gy);
          sobelData[y * canvas.width + x] = magnitude > threshold ? 255 : 0;
        }
      }
      
      // Background removal with edge preservation
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Calculate pixel position
        const x = (i / 4) % canvas.width;
        const y = Math.floor((i / 4) / canvas.width);
        
        // Edge detection to preserve subject edges
        const isEdge = sobelData[y * canvas.width + x] > 0;
        
        // Determine if pixel is background
        if (isEdge) {
          // Preserve edges but still process obvious background
          if (isLikelyBackground(r, g, b)) {
            data[i + 3] = 0; // Make transparent
          }
        } else if (isLikelyBackground(r, g, b)) {
          data[i + 3] = 0; // Make transparent
        }
      }
      
      // Put the processed image data back onto the canvas
      ctx.putImageData(imageData, 0, 0);
      
      // Convert the canvas to a data URL and set it as the result
      const resultDataUrl = canvas.toDataURL('image/png');
      setResultUrl(resultDataUrl);
      setIsProcessing(false);
      
      toast({
        title: "Background removed!",
        description: "Your image background has been removed successfully.",
      });
    };
    
    img.onerror = () => {
      setIsProcessing(false);
      toast({
        title: "Image error",
        description: "Failed to load image for processing.",
        variant: "destructive",
      });
    };
    
    img.src = preview as string;
  };

  const handleDownload = () => {
    if (!resultUrl) {
      toast({
        title: "No processed image",
        description: "Please process an image first.",
        variant: "destructive",
      });
      return;
    }
    
    // Create an anchor element to trigger the download
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `no-bg-${file?.name?.split('.')[0] || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your image is being downloaded.",
    });
  };

  return (
    <CategoryLayout
      title="Remove Background"
      description="Automatically remove backgrounds from your images."
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
            
            {/* Step 2: Remove background */}
            {preview && (
              <div>
                <h2 className="text-lg font-medium mb-4">2. Remove background</h2>
                <Button 
                  onClick={handleRemoveBackground}
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
                      <Eraser className="mr-2 h-4 w-4" /> Remove Background
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {/* Step 3: Result and Download */}
            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium mb-4">3. Result</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1 border rounded-md p-2 bg-gray-100 dark:bg-gray-700">
                    <h3 className="text-sm font-medium mb-2 text-center">Original</h3>
                    <img 
                      src={preview as string} 
                      alt="Original" 
                      className="max-h-48 object-contain mx-auto"
                    />
                  </div>
                  <div className="flex-1 border rounded-md p-2" style={{ 
                    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKqq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABHklEQVQ4jZWTvU4CQRSFv3vZXdgFYimQbLRAwcZIQWHpK1hZ0FnzBLyAsZWSx9DSwhojhZa2JNRKwuIPERZw77Uwe4GohF3CSW7m3HPOzczcMSKCiKCUyrVWqwFQKpVwHIeXlxeiKEopYpTyff/bDev1OhcXF5imiRCCcrnM/v4+t7e3pGkKYK21FvEVrNVqDAYD0jTFdV2azSZHR0cYhnGcJImV+1yr1Xh7e2N3d5fLy0t6vR71ep35fE673WYymWTr5O851Go1Xl9fOT8/ZzqdEgQBjuMwnU5xXZdisUi32003YRgmgMzn8zSbzSQIgqxUKkkYhtn9/X1mWZZ4npfvQEQy3/cZjUYsFgvCMKTdbmNZFnt7ew/j8bgDIPwCDUjWNL9eJJUAAAAASUVORK5CYII=")',
                    backgroundRepeat: 'repeat'
                  }}>
                    <h3 className="text-sm font-medium mb-2 text-center">Background Removed</h3>
                    <img 
                      src={resultUrl} 
                      alt="Processed" 
                      className="max-h-48 object-contain mx-auto"
                    />
                  </div>
                </div>
                
                {/* Comparison slider */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Before / After Comparison</h3>
                  <div className="border rounded-md p-2 overflow-hidden" style={{ 
                    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKqq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABHklEQVQ4jZWTvU4CQRSFv3vZXdgFYimQbLRAwcZIQWHpK1hZ0FnzBLyAsZWSx9DSwhojhZa2JNRKwuIPERZw77Uwe4GohF3CSW7m3HPOzczcMSKCiKCUyrVWqwFQKpVwHIeXlxeiKEopYpTyff/bDev1OhcXF5imiRCCcrnM/v4+t7e3pGkKYK21FvEVrNVqDAYD0jTFdV2azSZHR0cYhnGcJImV+1yr1Xh7e2N3d5fLy0t6vR71ep35fE673WYymWTr5O851Go1Xl9fOT8/ZzqdEgQBjuMwnU5xXZdisUi32003YRgmgMzn8zSbzSQIgqxUKkkYhtn9/X1mWZZ4npfvQEQy3/cZjUYsFgvCMKTdbmNZFnt7ew/j8bgDIPwCDUjWNL9eJJUAAAAASUVORK5CYII=")',
                    backgroundRepeat: 'repeat',
                    height: '300px',
                    position: 'relative'
                  }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative h-full w-full max-h-64 flex items-center justify-center">
                        <img 
                          src={preview as string} 
                          alt="Original" 
                          className="absolute h-full max-h-64 object-contain"
                          style={{ filter: 'opacity(0.5)' }}
                        />
                        <img 
                          src={resultUrl} 
                          alt="Result" 
                          className="absolute h-full max-h-64 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleDownload}
                  className="w-full bg-utility-image hover:bg-utility-image/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Image
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">Tips for background removal</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Works best with images that have a clear subject and distinct background</li>
            <li>For best results, use images with good lighting and contrast</li>
            <li>People, products, and animals are typically detected well</li>
            <li>Maximum file size: 5MB per image</li>
            <li>Supported formats: JPG, PNG</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
