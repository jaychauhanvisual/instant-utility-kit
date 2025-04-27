
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CopyIcon, DownloadIcon, CaseLower, CaseUpper, ArrowLeftRight, Type } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

export default function CaseConverter() {
  const [text, setText] = useState<string>('');
  const [convertedText, setConvertedText] = useState<string>('');
  const [caseType, setCaseType] = useState<string>('lowercase');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!text.trim()) {
      toast({
        title: "Empty text",
        description: "Please enter some text to convert",
        variant: "destructive",
      });
      return;
    }

    let result = '';
    
    switch (caseType) {
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'capitalize':
        result = text.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camelCase':
        result = text.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
        break;
      case 'kebabCase':
        result = text.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
        break;
      case 'snakeCase':
        result = text.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '');
        break;
      case 'alternating':
        result = [...text].map((char, i) => 
          i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        ).join('');
        break;
      default:
        result = text;
    }
    
    setConvertedText(result);
    
    toast({
      title: "Text converted",
      description: `Text successfully converted to ${caseType}`,
    });
  };

  const handleCopy = () => {
    if (!convertedText) {
      toast({
        title: "Nothing to copy",
        description: "Convert some text first",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(convertedText);
    
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const handleDownload = () => {
    if (!convertedText) {
      toast({
        title: "Nothing to download",
        description: "Convert some text first",
        variant: "destructive",
      });
      return;
    }
    
    const element = document.createElement("a");
    const file = new Blob([convertedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `converted_text_${caseType}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Text saved as file",
    });
  };

  const clearAll = () => {
    setText('');
    setConvertedText('');
  };

  const casePreviews: Record<string, string> = {
    lowercase: 'example text',
    uppercase: 'EXAMPLE TEXT',
    capitalize: 'Example Text',
    sentence: 'Example text. Another sentence.',
    camelCase: 'exampleText',
    kebabCase: 'example-text',
    snakeCase: 'example_text',
    alternating: 'eXaMpLe TeXt'
  };

  return (
    <CategoryLayout
      title="Case Converter"
      description="Convert text between different cases like uppercase, lowercase, title case, and more."
      category="text"
      categoryColor="utility-text"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Type className="h-5 w-5" />
              Input Text
            </h2>
            <Textarea 
              placeholder="Enter text to convert..."
              className="min-h-[200px] mb-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAll}
              >
                Clear
              </Button>
              <span className="text-xs text-muted-foreground">
                {text.length} characters • {text.trim() ? text.trim().split(/\s+/).length : 0} words
              </span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Converted Result
            </h2>
            <Textarea 
              readOnly 
              className="min-h-[200px] mb-4"
              value={convertedText}
              placeholder="Converted text will appear here..."
            />
            <div className="flex justify-between">
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCopy}
                  disabled={!convertedText}
                >
                  <CopyIcon className="h-4 w-4 mr-1" /> Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownload}
                  disabled={!convertedText}
                >
                  <DownloadIcon className="h-4 w-4 mr-1" /> Download
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                {convertedText.length} characters
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
            <CaseUpper className="h-5 w-5" /> 
            Case Options
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <RadioGroup
              value={caseType}
              onValueChange={setCaseType}
              className="grid grid-cols-1 gap-4"
            >
              {Object.entries({
                lowercase: { icon: CaseLower, label: "lowercase", example: casePreviews.lowercase },
                uppercase: { icon: CaseUpper, label: "UPPERCASE", example: casePreviews.uppercase },
                capitalize: { icon: Type, label: "Title Case", example: casePreviews.capitalize },
                sentence: { icon: Type, label: "Sentence case", example: casePreviews.sentence },
                camelCase: { icon: Type, label: "camelCase", example: casePreviews.camelCase },
                kebabCase: { icon: Type, label: "kebab-case", example: casePreviews.kebabCase },
                snakeCase: { icon: Type, label: "snake_case", example: casePreviews.snakeCase },
                alternating: { icon: Type, label: "aLtErNaTiNg", example: casePreviews.alternating }
              }).map(([value, { icon: Icon, label, example }]) => (
                <div 
                  key={value}
                  className={`border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer ${caseType === value ? 'bg-utility-text/10 border-utility-text/50' : ''}`}
                  onClick={() => setCaseType(value)}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="cursor-pointer flex items-center gap-2 font-medium">
                      <Icon className="h-4 w-4" />
                      {label}
                    </Label>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground pl-6">Example: {example}</p>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              onClick={handleConvert}
              className="bg-utility-text hover:bg-utility-text/90 min-w-[150px]"
            >
              Convert Text
            </Button>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
}
