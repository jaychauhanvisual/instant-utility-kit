
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-react';
import { format, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import CategoryLayout from '@/components/CategoryLayout';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [age, setAge] = useState<{
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalDays: number;
  } | null>(null);
  const { toast } = useToast();

  const calculateAge = () => {
    if (!birthDate) {
      toast({
        title: "Missing information",
        description: "Please enter your birth date",
        variant: "destructive",
      });
      return;
    }

    try {
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      
      // Check if birth date is in the future or invalid
      if (birthDateObj > today || isNaN(birthDateObj.getTime())) {
        toast({
          title: "Invalid date",
          description: "Birth date cannot be in the future",
          variant: "destructive",
        });
        return;
      }
      
      // Calculate years, months, and days
      const years = differenceInYears(today, birthDateObj);
      
      // Calculate total months
      const totalMonths = differenceInMonths(today, birthDateObj);
      
      // Calculate remaining months (after subtracting years)
      const tempDateAfterYears = new Date(birthDateObj);
      tempDateAfterYears.setFullYear(tempDateAfterYears.getFullYear() + years);
      const months = differenceInMonths(today, tempDateAfterYears);
      
      // Calculate total days
      const totalDays = differenceInDays(today, birthDateObj);
      
      // Calculate remaining days (after subtracting years and months)
      const tempDateAfterMonths = new Date(tempDateAfterYears);
      tempDateAfterMonths.setMonth(tempDateAfterMonths.getMonth() + months);
      const days = differenceInDays(today, tempDateAfterMonths);
      
      setAge({
        years,
        months,
        days,
        totalMonths,
        totalDays,
      });

      toast({
        title: "Age calculated",
        description: `You are ${years} years, ${months} months, and ${days} days old`,
      });
    } catch (error) {
      toast({
        title: "Calculation error",
        description: "Something went wrong. Please check your input.",
        variant: "destructive",
      });
    }
  };

  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const handleReset = () => {
    setBirthDate('');
    setAge(null);
  };

  return (
    <CategoryLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days."
      category="calculator"
      categoryColor="utility-calculator"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <div className="flex flex-col space-y-6">
            {/* Birth date input */}
            <div>
              <h2 className="text-lg font-medium mb-4">Enter your birth date</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="birthDate">Date of Birth</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={today}
                    className="mt-1"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <Button 
                    onClick={calculateAge} 
                    className="flex-1 bg-utility-calculator hover:bg-utility-calculator/90"
                  >
                    Calculate Age
                  </Button>
                  <Button 
                    onClick={handleReset} 
                    variant="outline"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Results */}
            {age !== null && (
              <div className="mt-2">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays className="h-6 w-6 text-utility-calculator" />
                  <h3 className="text-lg font-medium">Your Age Results</h3>
                </div>
                
                <div className="rounded-lg overflow-hidden border">
                  <div className="bg-utility-calculator/10 p-3 border-b">
                    <p className="text-center font-medium">
                      {birthDate ? format(new Date(birthDate), 'MMMM d, yyyy') : ''} to {format(new Date(), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-utility-calculator">{age.years}</div>
                        <div className="text-xs text-muted-foreground">Years</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-utility-calculator">{age.months}</div>
                        <div className="text-xs text-muted-foreground">Months</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-utility-calculator">{age.days}</div>
                        <div className="text-xs text-muted-foreground">Days</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total months:</span>
                        <span className="text-sm font-medium">{age.totalMonths.toLocaleString()} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total days:</span>
                        <span className="text-sm font-medium">{age.totalDays.toLocaleString()} days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Info section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">About Age Calculation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This calculator provides your exact age in years, months, and days. It accounts for leap years and varying month lengths to give you the most accurate result.
          </p>
          <h4 className="font-medium mb-1 text-sm">Interesting facts:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>A person celebrates about 29,200 days in an 80-year lifespan</li>
            <li>Most babies learn to walk at around 365-395 days old</li>
            <li>By 6,570 days (18 years), most humans have grown to their adult height</li>
            <li>The average human heart beats over 2.5 billion times in a lifetime</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
