
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToolCard, { ToolCategory } from '@/components/ToolCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  SearchIcon, 
  FileDown, 
  ScissorsSquare, 
  FileDigit, 
  FileText, 
  ArrowUpDown, 
  Crop, 
  Eraser, 
  Heart, 
  Calculator, 
  CalendarDays, 
  Percent, 
  CaseLower, 
  Text, 
  QrCode, 
  Link2, 
  Palette, 
  FileJson 
} from 'lucide-react';

// Define our tool data
const toolsData = [
  // PDF Tools
  {
    id: 'merge',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    icon: FileDown,
    category: 'pdf' as ToolCategory,
  },
  {
    id: 'split',
    title: 'Split PDF',
    description: 'Separate PDF pages into multiple files',
    icon: ScissorsSquare,
    category: 'pdf' as ToolCategory,
  },
  {
    id: 'compress',
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF documents',
    icon: FileDigit,
    category: 'pdf' as ToolCategory,
  },
  {
    id: 'pdf-to-text',
    title: 'PDF to Text',
    description: 'Extract text content from PDF documents',
    icon: FileText,
    category: 'pdf' as ToolCategory,
    comingSoon: true,
  },
  
  // Image Tools
  {
    id: 'resize',
    title: 'Resize Image',
    description: 'Change dimensions of your images',
    icon: ArrowUpDown,
    category: 'image' as ToolCategory,
  },
  {
    id: 'crop',
    title: 'Crop Image',
    description: 'Remove unwanted areas from your images',
    icon: Crop,
    category: 'image' as ToolCategory,
  },
  {
    id: 'compress-image',
    title: 'Compress Image',
    description: 'Reduce image file size while preserving quality',
    icon: FileDigit,
    category: 'image' as ToolCategory,
  },
  {
    id: 'background-remove',
    title: 'Remove Background',
    description: 'Automatically remove image backgrounds',
    icon: Eraser,
    category: 'image' as ToolCategory,
  },
  
  // Calculator Tools
  {
    id: 'bmi',
    title: 'BMI Calculator',
    description: 'Calculate Body Mass Index',
    icon: Heart,
    category: 'calculator' as ToolCategory,
  },
  {
    id: 'loan',
    title: 'Loan Calculator',
    description: 'Calculate loan payments and interest',
    icon: Calculator,
    category: 'calculator' as ToolCategory,
  },
  {
    id: 'age',
    title: 'Age Calculator',
    description: 'Calculate exact age from birth date',
    icon: CalendarDays,
    category: 'calculator' as ToolCategory,
  },
  {
    id: 'percentage',
    title: 'Percentage Calculator',
    description: 'Calculate percentages easily',
    icon: Percent,
    category: 'calculator' as ToolCategory,
  },
  
  // Text Tools
  {
    id: 'case-converter',
    title: 'Case Converter',
    description: 'Convert text between different cases',
    icon: CaseLower,
    category: 'text' as ToolCategory,
  },
  {
    id: 'word-counter',
    title: 'Word Counter',
    description: 'Count words, characters and paragraphs',
    icon: Text,
    category: 'text' as ToolCategory,
  },
  
  // Other Tools
  {
    id: 'qr-generator',
    title: 'QR Generator',
    description: 'Generate QR codes for any text or URL',
    icon: QrCode,
    category: 'other' as ToolCategory,
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener',
    description: 'Create short links from long URLs',
    icon: Link2,
    category: 'other' as ToolCategory,
    comingSoon: true,
  },
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick and convert between color formats',
    icon: Palette,
    category: 'other' as ToolCategory,
  },
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON data',
    icon: FileJson,
    category: 'other' as ToolCategory,
    comingSoon: true,
  },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredTools = toolsData.filter(tool => {
    // Filter by search query
    if (searchQuery && !tool.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tool.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (activeTab !== 'all' && tool.category !== activeTab) {
      return false;
    }
    
    return true;
  });
  
  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'pdf', name: 'PDF Tools' },
    { id: 'image', name: 'Image Tools' },
    { id: 'calculator', name: 'Calculators' },
    { id: 'text', name: 'Text Tools' },
    { id: 'other', name: 'Other Tools' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-3xl font-bold">Explore All Tools</h1>
            <p className="text-muted-foreground max-w-[700px]">
              Browse our collection of free utilities and tools to help with everyday tasks.
            </p>
            
            {/* Search bar */}
            <div className="w-full max-w-md relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for tools..."
                className="pl-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Category tabs */}
            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 flex flex-wrap">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="px-4">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Tools grid */}
              <TabsContent value={activeTab} className="w-full mt-0">
                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTools.map((tool) => (
                      <ToolCard
                        key={`${tool.category}-${tool.id}`}
                        id={tool.id}
                        title={tool.title}
                        description={tool.description}
                        icon={tool.icon}
                        category={tool.category}
                        comingSoon={tool.comingSoon}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground">No tools found matching your search.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
