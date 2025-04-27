
import { useState, useEffect } from 'react';
import { Palette, Copy, Check, RefreshCcw, Info } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
}

const ColorPicker = () => {
  const [color, setColor] = useState<string>('#4f46e5');
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#4f46e5',
    rgb: 'rgb(79, 70, 229)',
    hsl: 'hsl(243, 75%, 59%)'
  });

  useEffect(() => {
    // Initialize the color history from localStorage
    const savedHistory = localStorage.getItem('colorHistory');
    if (savedHistory) {
      setColorHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    // Update all color format values when the color changes
    updateColorValues(color);
  }, [color]);

  const updateColorValues = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Convert RGB to HSL
    const rgbToHsl = (r: number, g: number, b: number) => {
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h *= 60;
      }
      
      return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    };
    
    const [h, s, l] = rgbToHsl(r, g, b);
    
    setColorValues({
      hex: hexColor,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${h}, ${s}%, ${l}%)`
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
  };

  const handleFormatChange = (newFormat: ColorFormat) => {
    setFormat(newFormat);
  };

  const handleAddToHistory = () => {
    // Only add if color isn't already in history
    if (!colorHistory.includes(color)) {
      const newHistory = [color, ...colorHistory].slice(0, 20); // Keep only the last 20 colors
      setColorHistory(newHistory);
      localStorage.setItem('colorHistory', JSON.stringify(newHistory));
      toast.success("Color added to history");
    }
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success(`Copied ${format} to clipboard`);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  const generateComplementaryColor = () => {
    // Get the RGB values
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    // Complementary color is (255 - r, 255 - g, 255 - b)
    const compR = 255 - r;
    const compG = 255 - g;
    const compB = 255 - b;
    
    // Convert back to hex
    return `#${compR.toString(16).padStart(2, '0')}${compG.toString(16).padStart(2, '0')}${compB.toString(16).padStart(2, '0')}`;
  };
  
  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor(randomColor);
    toast.success("Generated random color");
  };

  return (
    <CategoryLayout
      title="Color Picker"
      description="Pick and convert between color formats"
      category="other"
      categoryColor="utility-other"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Color Picker */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Color Preview */}
              <div className="w-full md:w-1/3 flex flex-col">
                <div 
                  className="aspect-square rounded-lg shadow-md border" 
                  style={{ backgroundColor: color }}
                />
                <div className="mt-4 flex justify-center">
                  <Input
                    type="color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-full h-10"
                  />
                </div>
              </div>

              {/* Color Values */}
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <Label className="text-lg font-medium">Color Format</Label>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant={format === 'hex' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFormatChange('hex')}
                    >
                      HEX
                    </Button>
                    <Button 
                      variant={format === 'rgb' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFormatChange('rgb')}
                    >
                      RGB
                    </Button>
                    <Button 
                      variant={format === 'hsl' ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleFormatChange('hsl')}
                    >
                      HSL
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hexValue">HEX</Label>
                    <div className="flex mt-1">
                      <Input
                        id="hexValue"
                        value={colorValues.hex}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => copyToClipboard(colorValues.hex, 'hex')}
                      >
                        {copiedFormat === 'hex' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="rgbValue">RGB</Label>
                    <div className="flex mt-1">
                      <Input
                        id="rgbValue"
                        value={colorValues.rgb}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => copyToClipboard(colorValues.rgb, 'rgb')}
                      >
                        {copiedFormat === 'rgb' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hslValue">HSL</Label>
                    <div className="flex mt-1">
                      <Input
                        id="hslValue"
                        value={colorValues.hsl}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="ml-2"
                        onClick={() => copyToClipboard(colorValues.hsl, 'hsl')}
                      >
                        {copiedFormat === 'hsl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddToHistory}>Save to History</Button>
                  <Button variant="outline" onClick={generateRandomColor}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Random
                  </Button>
                </div>
              </div>
            </div>

            {/* Color Palette Suggestions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Color Palette</h3>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm">
                      These are harmonious colors based on your selected color. 
                      Click any color to select it.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="grid grid-cols-5 gap-2 h-20">
                {/* Complementary color */}
                <div 
                  className="rounded cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: generateComplementaryColor() }}
                  onClick={() => setColor(generateComplementaryColor())}
                  title="Complementary"
                />
                
                {/* Different shades of the same color */}
                {[0.8, 0.6, 0.4, 0.2].map((shade, i) => {
                  const r = parseInt(color.slice(1, 3), 16);
                  const g = parseInt(color.slice(3, 5), 16);
                  const b = parseInt(color.slice(5, 7), 16);
                  
                  const shadeColor = `#${Math.round(r * shade).toString(16).padStart(2, '0')}${Math.round(g * shade).toString(16).padStart(2, '0')}${Math.round(b * shade).toString(16).padStart(2, '0')}`;
                  
                  return (
                    <div 
                      key={i}
                      className="rounded cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: shadeColor }}
                      onClick={() => setColor(shadeColor)}
                      title={`Shade ${i+1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color History */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Color History</h3>
            {colorHistory.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {colorHistory.map((historyColor, index) => (
                  <div 
                    key={index}
                    className="aspect-square rounded cursor-pointer hover:scale-110 transition-transform border"
                    style={{ backgroundColor: historyColor }}
                    onClick={() => setColor(historyColor)}
                    title={historyColor}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No colors in history yet. Save colors to see them here.</p>
            )}
            
            {colorHistory.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setColorHistory([]);
                  localStorage.removeItem('colorHistory');
                  toast.success("Color history cleared");
                }}
              >
                Clear History
              </Button>
            )}
          </div>
        </div>

        {/* Usage Information */}
        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Color Picker Tool Guide</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium mb-2">Picking Colors</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Use the color selector to pick a color</li>
                <li>See the color preview in real-time</li>
                <li>Generate random colors with one click</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Converting Formats</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Toggle between HEX, RGB, and HSL formats</li>
                <li>Copy values to clipboard with one click</li>
                <li>All formats update automatically</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Managing Colors</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Save colors to your history</li>
                <li>Click on historical colors to select them</li>
                <li>Clear your history if needed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
};

export default ColorPicker;
