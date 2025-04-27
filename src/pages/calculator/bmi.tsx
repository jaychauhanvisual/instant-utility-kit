
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

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
        </div>
      </div>
    </CategoryLayout>
  );
}
