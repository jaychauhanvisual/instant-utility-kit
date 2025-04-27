
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator
} from '@/components/ui/command';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Tools data organized by category
  const tools = [
    {
      category: "PDF Tools",
      items: [
        { name: "Merge PDF", path: "/pdf/merge" },
        { name: "Split PDF", path: "/pdf/split" },
        { name: "Compress PDF", path: "/pdf/compress" },
      ]
    },
    {
      category: "Image Tools",
      items: [
        { name: "Resize Image", path: "/image/resize" },
        { name: "Crop Image", path: "/image/crop" },
        { name: "Compress Image", path: "/image/compress-image" },
        { name: "Remove Background", path: "/image/background-remove" },
      ]
    },
    {
      category: "Calculator Tools",
      items: [
        { name: "BMI Calculator", path: "/calculator/bmi" },
        { name: "Loan Calculator", path: "/calculator/loan" },
        { name: "Age Calculator", path: "/calculator/age" },
        { name: "Percentage Calculator", path: "/calculator/percentage" },
      ]
    },
    {
      category: "Text Tools",
      items: [
        { name: "Case Converter", path: "/text/case-converter" },
        { name: "Word Counter", path: "/text/word-counter" },
      ]
    },
    {
      category: "Other Tools",
      items: [
        { name: "Color Picker", path: "/other/color-picker" },
      ]
    },
  ];
  
  // Check for dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Setup keyboard shortcut for search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  
  const handleSelectTool = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${isScrolled ? 'bg-background/80 backdrop-blur supports-backdrop-blur:bg-background/60 shadow-sm' : 'bg-transparent'}`}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <svg className="h-8 w-8 text-primary transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-bold text-xl">InstantUtils</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-sm space-x-2">
          <div className="relative w-full">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools... (⌘K)"
              className="w-full pl-8 rounded-full bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setOpen(true)}
            />
          </div>
          <Button type="submit" size="sm" className="rounded-full px-4">Search</Button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          <Button variant="default" size="sm" asChild className="hidden sm:flex hover:scale-105 transition-transform">
            <Link to="/explore">Explore Tools</Link>
          </Button>
          <Button variant="outline" size="icon" onClick={() => setOpen(true)} className="md:hidden">
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search tools..." 
          ref={inputRef}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {tools.map((toolCategory) => (
            <CommandGroup key={toolCategory.category} heading={toolCategory.category}>
              {toolCategory.items.map((tool) => (
                <CommandItem 
                  key={tool.path} 
                  onSelect={() => handleSelectTool(tool.path)}
                >
                  {tool.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => handleSelectTool("/")}>Home</CommandItem>
            <CommandItem onSelect={() => handleSelectTool("/explore")}>Explore Tools</CommandItem>
            <CommandItem onSelect={() => handleSelectTool("/terms")}>Terms of Service</CommandItem>
            <CommandItem onSelect={() => handleSelectTool("/privacy")}>Privacy Policy</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </header>
  );
}
