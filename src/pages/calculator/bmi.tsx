
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, BarChart as BarChartIcon, Circle, Scale, ArrowRight, Activity } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Bar, BarChart as RechartBarChart, Cell, XAxis, YAxis, Line, LineChart, CartesianGrid, Tooltip, Legend, PieChart, Pie, ResponsiveContainer, Area, AreaChart } from "recharts";

export default function BMICalculator() {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [categoryIndex, setCategoryIndex] = useState<number | null>(null);
  const [animation, setAnimation] = useState(false);
  const { toast } = useToast();

  // Health data based on BMI result
  const [healthData, setHealthData] = useState<{
    risk: string;
    color: string;
    recommendations: string[];
  }>({
    risk: '',
    color: '#94a3b8',
    recommendations: []
  });

  // Trigger animation after calculation
  useEffect(() => {
    if (bmi !== null) {
      setAnimation(true);
      const timer = setTimeout(() => setAnimation(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [bmi]);

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
    let categoryIdx: number;
    let riskLevel: string;
    let riskColor: string;
    let recommendations: string[] = [];

    if (bmiValue < 18.5) {
      categoryValue = "Underweight";
      categoryIdx = 0;
      riskLevel = "Moderate";
      riskColor = "#3b82f6";
      recommendations = [
        "Consult with a healthcare provider",
        "Consider a nutrient-dense diet",
        "Regular strength training exercises",
        "Track calorie intake to ensure sufficient energy",
        "Gradual weight gain of 0.5-1 lb per week is recommended"
      ];
    } else if (bmiValue < 25) {
      categoryValue = "Normal weight";
      categoryIdx = 1;
      riskLevel = "Low";
      riskColor = "#22c55e";
      recommendations = [
        "Maintain current healthy lifestyle",
        "Regular physical activity (150+ minutes/week)",
        "Balanced diet rich in fruits and vegetables",
        "Regular health check-ups",
        "Adequate sleep and stress management"
      ];
    } else if (bmiValue < 30) {
      categoryValue = "Overweight";
      categoryIdx = 2;
      riskLevel = "Increased";
      riskColor = "#f97316";
      recommendations = [
        "Aim for gradual weight loss (1-2 lbs per week)",
        "Increase physical activity to 150-300 minutes/week",
        "Focus on portion control",
        "Reduce intake of processed foods and added sugars",
        "Consider working with a nutritionist"
      ];
    } else {
      categoryValue = "Obesity";
      categoryIdx = 3;
      riskLevel = "High";
      riskColor = "#ef4444";
      recommendations = [
        "Consult with healthcare provider for personalized plan",
        "Gradual, sustainable lifestyle changes",
        "Regular physical activity adapted to current fitness level",
        "Consider behavioral therapy for long-term success",
        "Monitor other health markers (blood pressure, cholesterol, etc.)"
      ];
    }
    
    setCategory(categoryValue);
    setCategoryIndex(categoryIdx);
    setHealthData({
      risk: riskLevel,
      color: riskColor,
      recommendations
    });

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
    setCategoryIndex(null);
    setHealthData({
      risk: '',
      color: '#94a3b8',
      recommendations: []
    });
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

  // Risk distribution data
  const riskDistributionData = [
    { name: "Very Low", value: 10 },
    { name: "Low", value: 15 },
    { name: "Moderate", value: 25 },
    { name: "High", value: 30 },
    { name: "Very High", value: 20 }
  ];

  // Health outcomes data
  const healthOutcomesData = [
    { 
      category: "Low BMI < 18.5", 
      "Nutritional Deficiency": 65, 
      "Bone Density Issues": 55, 
      "Impaired Immunity": 40
    },
    { 
      category: "Normal BMI 18.5-24.9", 
      "Nutritional Deficiency": 15, 
      "Bone Density Issues": 20, 
      "Impaired Immunity": 10
    },
    { 
      category: "Overweight BMI 25-29.9", 
      "Nutritional Deficiency": 20, 
      "Bone Density Issues": 30, 
      "Impaired Immunity": 35
    },
    { 
      category: "Obese BMI ≥ 30", 
      "Nutritional Deficiency": 40, 
      "Bone Density Issues": 55, 
      "Impaired Immunity": 70
    }
  ];

  // BMI trend data (example)
  const trendData = [
    { age: "20-29", "Average BMI": 24.2 },
    { age: "30-39", "Average BMI": 26.8 },
    { age: "40-49", "Average BMI": 27.9 },
    { age: "50-59", "Average BMI": 28.4 },
    { age: "60-69", "Average BMI": 28.1 },
    { age: "70+", "Average BMI": 26.9 }
  ];

  const renderBmiComparison = () => {
    if (!bmi) return null;

    // Example comparative data
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
              className={animation ? "animate-pulse" : ""}
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

  const renderHealthDataVisualizations = () => {
    if (!bmi) return null;

    return (
      <div className="mt-6 space-y-6">
        {/* Health risk gauge */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4" /> 
            Health Risk Assessment
          </h3>
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Risk level:</span>
              <span 
                className="text-sm font-bold"
                style={{ color: healthData.color }}
              >
                {healthData.risk}
              </span>
            </div>
            
            {/* Risk meter visualization */}
            <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full transition-all duration-1000 ease-out"
                style={{ 
                  width: categoryIndex !== null ? `${(categoryIndex / 3) * 100}%` : '0%',
                  backgroundColor: healthData.color,
                  transition: 'width 1s ease-out'
                }}
              ></div>
            </div>
            
            {/* Health Recommendations */}
            <div>
              <h4 className="text-xs font-medium mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1">
                {healthData.recommendations.map((rec, index) => (
                  <li 
                    key={index} 
                    className="text-xs text-muted-foreground"
                    style={{
                      animation: animation ? `fade-in 0.3s ease-out ${index * 0.1}s forwards` : 'none',
                      opacity: animation ? 0 : 1
                    }}
                  >
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Health outcomes chart - FIXING THIS SECTION */}
        <div>
          <h3 className="text-sm font-medium mb-3">Health Outcomes by BMI Category</h3>
          <div className="border rounded-lg p-4 bg-card">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={healthOutcomesData}
                margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  label={{ 
                    value: 'Risk %', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 10 }
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Nutritional Deficiency" fill="#8884d8" />
                <Bar dataKey="Bone Density Issues" fill="#82ca9d" />
                <Bar dataKey="Impaired Immunity" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Age trend chart */}
        <div>
          <h3 className="text-sm font-medium mb-3">Average BMI Trend by Age</h3>
          <div className="border rounded-lg p-4 bg-card">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="age" />
                <YAxis 
                  domain={[15, 35]}
                  ticks={[15, 20, 25, 30, 35]}
                />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="Average BMI" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#colorUv)"
                />
                {/* Normal range marker */}
                <rect 
                  x="0%" 
                  y={25 - 18.5} // 25 is y-max, so we calculate percentage
                  width="100%" 
                  height={(25 - 18.5) - (25 - 25)} 
                  fill="#22c55e" 
                  fillOpacity="0.2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
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
                  setCategoryIndex(null);
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
                  <Heart className={`h-6 w-6 text-utility-calculator ${animation ? 'animate-pulse' : ''}`} />
                  <h3 className="text-lg font-medium">Your BMI Results</h3>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">BMI Value:</span>
                  <span className="text-lg">{bmi}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Category:</span>
                  <span 
                    className={`font-medium ${animation ? 'animate-fade-in' : ''}`}
                    style={{ color: getBmiColor() }}
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
                      className={`absolute -top-1 transform -translate-x-1/2 h-4 w-4 rounded-full border-2 border-black dark:border-white ${animation ? 'animate-pulse' : ''}`}
                      style={{ left: calculateMarkerPosition(), backgroundColor: getBmiColor() }}
                    ></div>
                    <div className="absolute top-4 transform -translate-x-1/2 text-xs font-medium" style={{ left: calculateMarkerPosition() }}>
                      Your BMI: {bmi}
                    </div>
                  </div>
                </div>
                
                {/* Visual speedometer/gauge for BMI range */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">BMI Range</h3>
                  <div className="relative h-36 flex items-center justify-center">
                    {/* Semicircle gauge background */}
                    <div className="absolute h-36 w-36 rounded-full border-[16px] border-gray-200 -bottom-6" style={{ clipPath: 'polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)' }}></div>
                    
                    {/* Gauge colored sections */}
                    <div className="absolute h-36 w-36 rounded-full border-[16px] border-blue-500 -bottom-6" style={{ clipPath: 'polygon(0% 50%, 25% 50%, 25% 100%, 0% 100%)' }}></div>
                    <div className="absolute h-36 w-36 rounded-full border-[16px] border-green-500 -bottom-6" style={{ clipPath: 'polygon(25% 50%, 50% 50%, 50% 100%, 25% 100%)' }}></div>
                    <div className="absolute h-36 w-36 rounded-full border-[16px] border-orange-500 -bottom-6" style={{ clipPath: 'polygon(50% 50%, 75% 50%, 75% 100%, 50% 100%)' }}></div>
                    <div className="absolute h-36 w-36 rounded-full border-[16px] border-red-500 -bottom-6" style={{ clipPath: 'polygon(75% 50%, 100% 50%, 100% 100%, 75% 100%)' }}></div>
                    
                    {/* Needle */}
                    <div 
                      className="absolute bottom-0 h-32 w-1 bg-black dark:bg-white origin-bottom transform transition-all duration-1000"
                      style={{ 
                        rotate: bmi ? `${Math.min((bmi - 10) / 30 * 180, 180)}deg` : '0deg'
                      }}
                    >
                      <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-black dark:bg-white"></div>
                    </div>
                    
                    {/* BMI value labels */}
                    <div className="absolute -bottom-2 left-0 text-xs">10</div>
                    <div className="absolute -bottom-2 left-1/4 text-xs">18.5</div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs">25</div>
                    <div className="absolute -bottom-2 left-3/4 text-xs">30</div>
                    <div className="absolute -bottom-2 right-0 text-xs">40</div>
                    
                    {/* Current value */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-lg font-bold">{bmi || "-"}</div>
                  </div>
                </div>
                
                {/* BMI Comparison Chart */}
                {renderBmiComparison()}
                
                {/* Additional health visualizations */}
                {renderHealthDataVisualizations()}
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
