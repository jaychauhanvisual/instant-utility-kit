
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Crop as CropIcon, UploadCloud, Download } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function CropImage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // This is to demonstrate the result of crop
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    
    // Make the crop initially centered in the image
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
        },
        16 / 9,
        width,
        height,
      ),
      width,
      height,
    );

    setCrop(crop);
  }

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
          setResultUrl(null); // Reset result when new file is selected
        }
      };
      reader.readAsDataURL(selectedFile);
      
      // Reset the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCrop = () => {
    if (!file || !imgRef.current || !completedCrop) {
      toast({
        title: "No crop area selected",
        description: "Please select an area to crop before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Wait a bit to show processing state to user
    setTimeout(() => {
      // Draw the cropped image to a canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Could not create canvas context.",
          variant: "destructive",
        });
        return;
      }
      
      const image = imgRef.current;
      
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // Set canvas dimensions to match the crop size
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      
      // Draw only the cropped portion of the image to the canvas
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
      
      // Convert canvas to data URL
      const croppedImageUrl = canvas.toDataURL();
      setResultUrl(croppedImageUrl);
      
      setIsProcessing(false);
      
      toast({
        title: "Crop successful!",
        description: "Your image has been cropped successfully.",
      });
    }, 500);
  };

  const handleDownload = () => {
    if (!resultUrl) {
      toast({
        title: "No image to download",
        description: "Please crop an image first.",
        variant: "destructive",
      });
      return;
    }

    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = file ? `cropped-${file.name}` : 'cropped-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download started",
      description: "Your cropped image is downloading.",
    });
  };

  return (
    <CategoryLayout
      title="Crop Image"
      description="Remove unwanted areas from your images."
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
              </div>
            </div>
            
            {/* Image preview with crop UI */}
            {preview && (
              <div>
                <h2 className="text-lg font-medium mb-4">2. Select crop area</h2>
                <div className="border rounded-md overflow-hidden bg-gray-100">
                  <div className="flex justify-center">
                    <ReactCrop
                      crop={crop}
                      onChange={(c) => setCrop(c)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={undefined}
                      className="max-w-full"
                    >
                      <img
                        ref={imgRef}
                        src={preview}
                        alt="Upload"
                        className="max-h-96 object-contain"
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Drag to select the area you want to crop. You can resize and move the selection box.</p>
                </div>
                
                {/* Crop button */}
                <div className="mt-4">
                  <Button 
                    onClick={handleCrop}
                    disabled={isProcessing || !completedCrop}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CropIcon className="mr-2 h-4 w-4" /> Apply Crop
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Preview and Download result (shown only when a result is available) */}
            {resultUrl && (
              <div>
                <h2 className="text-lg font-medium mb-4">3. Preview and download</h2>
                <div className="border rounded-md overflow-hidden mb-4">
                  <div className="flex justify-center bg-gray-100 p-4">
                    <img 
                      src={resultUrl} 
                      alt="Cropped result" 
                      className="max-h-64 object-contain"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-utility-image hover:bg-utility-image/90"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Cropped Image
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">Tips for cropping images</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Drag the corners or edges to resize the crop area</li>
            <li>Click and drag inside the selection to move it</li>
            <li>For precise cropping, zoom in on your browser (Ctrl/Cmd +)</li>
            <li>All processing happens in your browser - your images are never uploaded to a server</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
