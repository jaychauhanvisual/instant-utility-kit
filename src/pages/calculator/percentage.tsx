
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Percent } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

export default function PercentageCalculator() {
  // State for "What is X% of Y"
  const [percentValue, setPercentValue] = useState<string>('');
  const [totalValue, setTotalValue] = useState<string>('');
  const [percentOfResult, setPercentOfResult] = useState<string | null>(null);

  // State for "X is what % of Y"
  const [partValue, setPartValue] = useState<string>('');
  const [wholeValue, setWholeValue] = useState<string>('');
  const [percentageResult, setPercentageResult] = useState<string | null>(null);

  // State for "X + Y%"
  const [baseValue, setBaseValue] = useState<string>('');
  const [addPercentValue, setAddPercentValue] = useState<string>('');
  const [addResult, setAddResult] = useState<string | null>(null);

  const { toast } = useToast();

  // Calculate what is X% of Y
  const calculatePercentOf = () => {
    if (!percentValue || !totalValue) {
      toast({
        title: "Missing information",
        description: "Please enter both percentage and total values",
        variant: "destructive",
      });
      return;
    }

    try {
      const percent = parseFloat(percentValue);
      const total = parseFloat(totalValue);
      
      if (isNaN(percent) || isNaN(total)) {
        throw new Error("Invalid numbers");
      }
      
      const result = (percent / 100) * total;
      setPercentOfResult(result.toFixed(2));
      
      toast({
        title: "Calculation complete",
        description: `${percent}% of ${total} is ${result.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Calculation error",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
    }
  };

  // Calculate X is what % of Y
  const calculatePercentage = () => {
    if (!partValue || !wholeValue) {
      toast({
        title: "Missing information",
        description: "Please enter both part and whole values",
        variant: "destructive",
      });
      return;
    }

    try {
      const part = parseFloat(partValue);
      const whole = parseFloat(wholeValue);
      
      if (isNaN(part) || isNaN(whole) || whole === 0) {
        throw new Error("Invalid numbers");
      }
      
      const result = (part / whole) * 100;
      setPercentageResult(result.toFixed(2));
      
      toast({
        title: "Calculation complete",
        description: `${part} is ${result.toFixed(2)}% of ${whole}`,
      });
    } catch (error) {
      toast({
        title: "Calculation error",
        description: "Please enter valid numbers (whole cannot be zero)",
        variant: "destructive",
      });
    }
  };

  // Calculate X + Y%
  const calculateAddPercent = () => {
    if (!baseValue || !addPercentValue) {
      toast({
        title: "Missing information",
        description: "Please enter both base value and percentage",
        variant: "destructive",
      });
      return;
    }

    try {
      const base = parseFloat(baseValue);
      const percent = parseFloat(addPercentValue);
      
      if (isNaN(base) || isNaN(percent)) {
        throw new Error("Invalid numbers");
      }
      
      const increase = base * (percent / 100);
      const result = base + increase;
      setAddResult(result.toFixed(2));
      
      toast({
        title: "Calculation complete",
        description: `${base} increased by ${percent}% is ${result.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Calculation error",
        description: "Please enter valid numbers",
        variant: "destructive",
      });
    }
  };

  const resetAll = () => {
    // Reset "What is X% of Y"
    setPercentValue('');
    setTotalValue('');
    setPercentOfResult(null);
    
    // Reset "X is what % of Y"
    setPartValue('');
    setWholeValue('');
    setPercentageResult(null);
    
    // Reset "X + Y%"
    setBaseValue('');
    setAddPercentValue('');
    setAddResult(null);
  };

  return (
    <CategoryLayout
      title="Percentage Calculator"
      description="Calculate percentages for various everyday needs."
      category="calculator"
      categoryColor="utility-calculator"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <Tabs defaultValue="percentOf" className="space-y-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="percentOf">X% of Y</TabsTrigger>
              <TabsTrigger value="isPercent">X is what % of Y</TabsTrigger>
              <TabsTrigger value="addPercent">X + Y%</TabsTrigger>
            </TabsList>
            
            {/* What is X% of Y */}
            <TabsContent value="percentOf" className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Percent className="h-6 w-6 text-utility-calculator" />
                <h2 className="text-lg font-medium">What is X% of Y?</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="percentValue">Percentage (%)</Label>
                    <div className="relative">
                      <Input
                        id="percentValue"
                        type="number"
                        value={percentValue}
                        onChange={(e) => setPercentValue(e.target.value)}
                        placeholder="Enter percentage"
                        className="pr-6"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="totalValue">Of What Value</Label>
                    <Input
                      id="totalValue"
                      type="number"
                      value={totalValue}
                      onChange={(e) => setTotalValue(e.target.value)}
                      placeholder="Enter value"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={calculatePercentOf} 
                  className="w-full bg-utility-calculator hover:bg-utility-calculator/90"
                >
                  Calculate
                </Button>
                
                {percentOfResult !== null && (
                  <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Result:</p>
                    <p className="text-2xl font-bold text-utility-calculator">{percentOfResult}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {percentValue}% of {totalValue} is {percentOfResult}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* X is what % of Y */}
            <TabsContent value="isPercent" className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Percent className="h-6 w-6 text-utility-calculator" />
                <h2 className="text-lg font-medium">X is what % of Y?</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="partValue">Value (X)</Label>
                    <Input
                      id="partValue"
                      type="number"
                      value={partValue}
                      onChange={(e) => setPartValue(e.target.value)}
                      placeholder="Enter part value"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="wholeValue">Of What Value (Y)</Label>
                    <Input
                      id="wholeValue"
                      type="number"
                      value={wholeValue}
                      onChange={(e) => setWholeValue(e.target.value)}
                      placeholder="Enter whole value"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={calculatePercentage} 
                  className="w-full bg-utility-calculator hover:bg-utility-calculator/90"
                >
                  Calculate
                </Button>
                
                {percentageResult !== null && (
                  <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Result:</p>
                    <p className="text-2xl font-bold text-utility-calculator">{percentageResult}%</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {partValue} is {percentageResult}% of {wholeValue}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* X + Y% */}
            <TabsContent value="addPercent" className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Percent className="h-6 w-6 text-utility-calculator" />
                <h2 className="text-lg font-medium">Calculate X + Y%</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseValue">Base Value (X)</Label>
                    <Input
                      id="baseValue"
                      type="number"
                      value={baseValue}
                      onChange={(e) => setBaseValue(e.target.value)}
                      placeholder="Enter base value"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="addPercentValue">Percentage Increase (Y%)</Label>
                    <div className="relative">
                      <Input
                        id="addPercentValue"
                        type="number"
                        value={addPercentValue}
                        onChange={(e) => setAddPercentValue(e.target.value)}
                        placeholder="Enter percentage"
                        className="pr-6"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={calculateAddPercent} 
                  className="w-full bg-utility-calculator hover:bg-utility-calculator/90"
                >
                  Calculate
                </Button>
                
                {addResult !== null && (
                  <div className="mt-4 p-4 bg-muted rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Result:</p>
                    <p className="text-2xl font-bold text-utility-calculator">{addResult}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {baseValue} increased by {addPercentValue}% is {addResult}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t">
            <Button onClick={resetAll} variant="outline">Reset All Calculators</Button>
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">Common Percentage Calculations</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>Percentage of a number:</strong> To find X% of Y, multiply Y by (X/100)</li>
            <li><strong>What percentage X is of Y:</strong> To find what % X is of Y, divide X by Y and multiply by 100</li>
            <li><strong>Adding a percentage:</strong> To increase X by Y%, multiply X by (1 + Y/100)</li>
            <li><strong>Subtracting a percentage:</strong> To decrease X by Y%, multiply X by (1 - Y/100)</li>
            <li><strong>Percentage change:</strong> (New Value - Old Value) / Old Value × 100</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
