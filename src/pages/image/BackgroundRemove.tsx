
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eraser, UploadCloud, Download } from 'lucide-react';
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
    
    // Simulate processing with timeout
    setTimeout(() => {
      setIsProcessing(false);
      
      // In a real implementation, this would be where you'd call a background removal API
      // For this demo, we're just simulating success
      setResultUrl(preview);
      
      toast({
        title: "Background removed!",
        description: "Your image background has been removed successfully.",
      });
    }, 2000);
  };

  const handleDownload = () => {
    // In a real implementation, this would download the processed image
    toast({
      title: "Feature coming soon",
      description: "Download functionality will be available in the next update.",
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
            
            {/* Step 3: Download result (shown only when a result is available) */}
            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium mb-4">3. Download image</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Your image with background removed will be saved as a PNG with transparency.
                </p>
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
