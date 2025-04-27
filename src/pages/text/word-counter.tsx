
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BarChart, CircleOffIcon, Text, Type, Clock3 } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart as RechartBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';

export default function WordCounter() {
  const [text, setText] = useState<string>('');
  const { toast } = useToast();
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    uniqueWords: 0,
    letterFrequency: [] as {name: string, value: number}[],
    wordLengths: [] as {name: string, value: number}[],
    longestWords: [] as {word: string, length: number}[],
  });

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (text: string) => {
    // Character count
    const characters = text.length;
    
    // Characters without spaces
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    
    // Word count
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    
    // Sentence count
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    
    // Paragraph count
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    
    // Reading time (avg 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Unique words
    const wordList = text.toLowerCase().match(/\b[\w']+\b/g) || [];
    const uniqueWords = new Set(wordList).size;
    
    // Letter frequency
    const letterCounts: Record<string, number> = {};
    const lettersOnly = text.toLowerCase().replace(/[^a-z]/g, '');
    
    for (const char of lettersOnly) {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    }
    
    const letterFrequency = Object.entries(letterCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
      
    // Word length distribution
    const wordLengthMap: Record<string, number> = {};
    
    wordList.forEach(word => {
      const length = word.length;
      const bucket = length > 10 ? '10+' : length.toString();
      wordLengthMap[bucket] = (wordLengthMap[bucket] || 0) + 1;
    });
    
    const wordLengths = Array.from({ length: 11 }, (_, i) => {
      const name = i === 10 ? '10+' : i.toString();
      return { name, value: wordLengthMap[name] || 0 };
    });
    
    // Longest words
    const longestWords = wordList
      .filter(word => word.length > 4)
      .map(word => ({ word, length: word.length }))
      .sort((a, b) => b.length - a.length)
      .slice(0, 5);
      
    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      uniqueWords,
      letterFrequency,
      wordLengths,
      longestWords,
    });
  };

  const handleClear = () => {
    setText('');
    toast({
      title: "Text cleared",
      description: "All text has been cleared",
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <CategoryLayout
      title="Word Counter"
      description="Analyze your text with detailed statistics, character counts, and word frequency."
      category="text"
      categoryColor="utility-text"
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Type className="h-5 w-5" />
              Your Text
            </h2>
            <Textarea 
              placeholder="Type or paste your text here..."
              className="min-h-[300px] mb-4"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleClear}
              >
                <CircleOffIcon className="h-4 w-4 mr-1" />
                Clear
              </Button>
              <span className="text-xs text-muted-foreground">
                {stats.characters} characters • {stats.words} words
              </span>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Text Statistics
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Characters</span>
                  <span className="font-medium">{stats.characters}</span>
                </div>
                <Progress value={Math.min(stats.characters / 10, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Characters (no spaces)</span>
                  <span className="font-medium">{stats.charactersNoSpaces}</span>
                </div>
                <Progress value={Math.min(stats.charactersNoSpaces / 10, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Words</span>
                  <span className="font-medium">{stats.words}</span>
                </div>
                <Progress value={Math.min(stats.words / 2, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Unique Words</span>
                  <span className="font-medium">{stats.uniqueWords}</span>
                </div>
                <Progress value={Math.min(stats.uniqueWords / 2, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sentences</span>
                  <span className="font-medium">{stats.sentences}</span>
                </div>
                <Progress value={Math.min(stats.sentences * 10, 100)} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Paragraphs</span>
                  <span className="font-medium">{stats.paragraphs}</span>
                </div>
                <Progress value={Math.min(stats.paragraphs * 20, 100)} className="h-2" />
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reading Time</span>
                </div>
                <span className="font-medium">
                  {stats.readingTime} {stats.readingTime === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Visualizations */}
        {stats.words > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Letter Frequency Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
              <h3 className="text-md font-medium mb-4">Letter Frequency</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBarChart
                    data={stats.letterFrequency}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name"
                      width={40}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {stats.letterFrequency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </RechartBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Word Length Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
              <h3 className="text-md font-medium mb-4">Word Length Distribution</h3>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    length: { theme: { light: "#8884d8", dark: "#8884d8" } },
                  }}
                  className="h-full"
                >
                  <RechartBarChart
                    data={stats.wordLengths}
                    margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      label={{ 
                        value: 'Word Length', 
                        position: 'insideBottom', 
                        offset: -15 
                      }} 
                    />
                    <YAxis 
                      label={{ 
                        value: 'Frequency', 
                        angle: -90, 
                        position: 'insideLeft' 
                      }} 
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="value" name="Length" fill="#8884d8" />
                  </RechartBarChart>
                </ChartContainer>
              </div>
            </div>
          </div>
        )}
        
        {/* Longest Words and Pie Chart */}
        {stats.words > 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
              <h3 className="text-md font-medium mb-4">Text Composition</h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Words', value: stats.words },
                        { name: 'Sentences', value: stats.sentences },
                        { name: 'Paragraphs', value: stats.paragraphs },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.letterFrequency.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
              <h3 className="text-md font-medium mb-4">Longest Words</h3>
              {stats.longestWords.length > 0 ? (
                <div className="space-y-3">
                  {stats.longestWords.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-utility-text/20 flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="font-medium">{item.word}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {item.length} characters
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No words to analyze
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CategoryLayout>
  );
}
