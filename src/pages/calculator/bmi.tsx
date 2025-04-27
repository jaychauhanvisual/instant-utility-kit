
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, BarChart } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Bar, BarChart as RechartBarChart, Cell, XAxis, YAxis } from "recharts";

export default function BMICalculator() {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const calculateBMI = () => {
    if (weight === '' || height === '' || height <= 0 || weight <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid weight and height values.",
        variant: "destructive",
      });
      return;
    }

    let bmiValue: number;

    if (unit === 'metric') {
      // Metric: weight (kg) / height² (m²)
      bmiValue = Number(weight) / Math.pow(Number(height) / 100, 2);
    } else {
      // Imperial: (weight (lbs) * 703) / height² (in²)
      bmiValue = (Number(weight) * 703) / Math.pow(Number(height), 2);
    }

    bmiValue = Math.round(bmiValue * 10) / 10;
    setBmi(bmiValue);

    // Determine BMI category
    let categoryValue: string;
    if (bmiValue < 18.5) {
      categoryValue = "Underweight";
    } else if (bmiValue < 25) {
      categoryValue = "Normal weight";
    } else if (bmiValue < 30) {
      categoryValue = "Overweight";
    } else {
      categoryValue = "Obesity";
    }
    setCategory(categoryValue);

    toast({
      title: "BMI Calculated",
      description: `Your BMI is ${bmiValue} (${categoryValue})`,
    });
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setBmi(null);
    setCategory(null);
  };

  // BMI range data for visualization
  const bmiData = [
    { name: "Underweight", range: "< 18.5", value: 18.5, color: "#3b82f6" }, // blue
    { name: "Normal", range: "18.5 - 24.9", value: 6.5, color: "#22c55e" }, // green
    { name: "Overweight", range: "25 - 29.9", value: 5, color: "#f97316" }, // orange
    { name: "Obese", range: "≥ 30", value: 10, color: "#ef4444" }, // red
  ];

  // Get color for user's BMI
  const getBmiColor = () => {
    if (!bmi) return "#94a3b8"; // Default gray
    
    if (bmi < 18.5) return "#3b82f6"; // Underweight: blue
    if (bmi < 25) return "#22c55e"; // Normal: green
    if (bmi < 30) return "#f97316"; // Overweight: orange
    return "#ef4444"; // Obese: red
  };

  // User's BMI marker position
  const calculateMarkerPosition = () => {
    if (!bmi) return "0%";
    
    // Calculate position on scale from 10 to 40 BMI
    const minScale = 10;
    const maxScale = 40;
    const percentage = ((Math.min(Math.max(bmi, minScale), maxScale) - minScale) / (maxScale - minScale)) * 100;
    return `${percentage}%`;
  };

  const renderBmiComparison = () => {
    if (!bmi) return null;

    // Example comparative data (simplified)
    const comparisonData = [
      { range: "Your BMI", value: bmi, color: getBmiColor() },
      { range: "Healthy Range", value: 22, color: "#22c55e" }, // Green
      { range: "Average Adult", value: 26.5, color: "#94a3b8" }, // Gray
    ];

    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3">How does your BMI compare?</h3>
        <ChartContainer 
          config={{
            yourBmi: { theme: { light: getBmiColor(), dark: getBmiColor() } },
            healthy: { theme: { light: "#22c55e", dark: "#22c55e" } },
            average: { theme: { light: "#94a3b8", dark: "#94a3b8" } },
          }}
          className="h-40"
        >
          <RechartBarChart 
            data={comparisonData}
            layout="vertical" 
            barCategoryGap={10}
          >
            <XAxis type="number" domain={[0, 40]} hide />
            <YAxis 
              type="category" 
              dataKey="range" 
              width={80}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Bar 
              dataKey="value" 
              barSize={24} 
              radius={4}
            >
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </RechartBarChart>
        </ChartContainer>
      </div>
    );
  };

  return (
    <CategoryLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index (BMI) to determine if your weight is healthy for your height."
      category="calculator"
      categoryColor="utility-calculator"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <div className="flex flex-col space-y-6">
            {/* Unit selection */}
            <div>
              <h2 className="text-lg font-medium mb-4">1. Choose unit system</h2>
              <RadioGroup 
                value={unit} 
                onValueChange={(value) => {
                  setUnit(value as 'metric' | 'imperial');
                  setWeight('');
                  setHeight('');
                  setBmi(null);
                  setCategory(null);
                }}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="metric" id="metric" />
                  <Label htmlFor="metric">Metric (kg, cm)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="imperial" id="imperial" />
                  <Label htmlFor="imperial">Imperial (lbs, in)</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Weight input */}
            <div>
              <h2 className="text-lg font-medium mb-4">2. Enter your weight</h2>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={unit === 'metric' ? 'Weight in kg' : 'Weight in lbs'}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                  min="1"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {unit === 'metric' ? 'kg' : 'lbs'}
                </span>
              </div>
            </div>

            {/* Height input */}
            <div>
              <h2 className="text-lg font-medium mb-4">3. Enter your height</h2>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={unit === 'metric' ? 'Height in cm' : 'Height in inches'}
                  value={height}
                  onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                  min="1"
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {unit === 'metric' ? 'cm' : 'inches'}
                </span>
              </div>
            </div>

            {/* Calculate button */}
            <div className="pt-2">
              <div className="flex gap-3">
                <Button 
                  onClick={calculateBMI} 
                  className="flex-1 bg-utility-calculator hover:bg-utility-calculator/90"
                >
                  Calculate BMI
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Results */}
            {bmi !== null && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-6 w-6 text-utility-calculator" />
                  <h3 className="text-lg font-medium">Your BMI Results</h3>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">BMI Value:</span>
                  <span className="text-lg">{bmi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Category:</span>
                  <span 
                    className={`font-medium ${
                      category === 'Normal weight' 
                        ? 'text-green-600 dark:text-green-400' 
                        : category === 'Underweight' 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {category}
                  </span>
                </div>
                
                {/* BMI Scale Visualization */}
                <div className="mt-4">
                  <div className="h-6 flex rounded-full overflow-hidden">
                    {bmiData.map((item, i) => (
                      <div 
                        key={i}
                        className="h-full flex items-center justify-center text-xs text-white font-medium"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${(item.value / 40) * 100}%`,
                        }}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                  
                  {/* BMI Marker */}
                  <div className="relative h-6 mt-2">
                    <div className="absolute h-full w-[2px] bg-black dark:bg-white" style={{ left: calculateMarkerPosition() }}></div>
                    <div 
                      className="absolute -top-1 transform -translate-x-1/2 h-4 w-4 rounded-full border-2 border-black dark:border-white" 
                      style={{ left: calculateMarkerPosition(), backgroundColor: getBmiColor() }}
                    ></div>
                    <div className="absolute top-4 transform -translate-x-1/2 text-xs font-medium" style={{ left: calculateMarkerPosition() }}>
                      Your BMI: {bmi}
                    </div>
                  </div>
                </div>
                
                {/* BMI Comparison Chart */}
                {renderBmiComparison()}
              </div>
            )}
          </div>
        </div>
        
        {/* Info section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">About BMI</h3>
          <p className="text-sm text-muted-foreground mb-4">
            BMI is a measure of body fat based on height and weight that applies to adult men and women.
            It is used as a screening tool to identify potential weight problems in adults.
          </p>
          <h4 className="font-medium mb-1 text-sm">BMI Categories:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Below 18.5: Underweight</li>
            <li>18.5 - 24.9: Normal weight</li>
            <li>25.0 - 29.9: Overweight</li>
            <li>30.0 and above: Obesity</li>
          </ul>
          
          {/* BMI Range Chart */}
          <div className="mt-4">
            <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              BMI Distribution
            </h4>
            <ChartContainer 
              config={{
                underweight: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
                normal: { theme: { light: "#22c55e", dark: "#22c55e" } },
                overweight: { theme: { light: "#f97316", dark: "#f97316" } },
                obese: { theme: { light: "#ef4444", dark: "#ef4444" } },
              }}
              className="h-36"
            >
              <RechartBarChart 
                data={bmiData}
                barCategoryGap={4}
              >
                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                <YAxis hide />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                />
                <Bar 
                  dataKey="value" 
                  barSize={40} 
                  radius={[4, 4, 0, 0]}
                >
                  {bmiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartBarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </CategoryLayout>
  );
}
