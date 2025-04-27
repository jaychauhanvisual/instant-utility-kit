
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator } from 'lucide-react';
import CategoryLayout from '@/components/CategoryLayout';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [loanTerm, setLoanTerm] = useState<number>(20);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const { toast } = useToast();

  // Calculate loan details when inputs change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateLoan = () => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyPayment(null);
      setTotalPayment(null);
      setTotalInterest(null);
      return;
    }

    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Total number of payments
    const numberOfPayments = loanTerm * 12;
    
    // Calculate monthly payment
    // Formula: P × (r × (1 + r)^n) / ((1 + r)^n - 1)
    // Where P = Principal, r = Monthly interest rate, n = Number of payments
    const monthlyPaymentValue = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) 
                              / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Calculate total payment over the life of the loan
    const totalPaymentValue = monthlyPaymentValue * numberOfPayments;
    
    // Calculate total interest paid
    const totalInterestValue = totalPaymentValue - loanAmount;
    
    setMonthlyPayment(monthlyPaymentValue);
    setTotalPayment(totalPaymentValue);
    setTotalInterest(totalInterestValue);
  };

  const handleAmountChange = (value: string) => {
    const amount = value ? Number(value) : 0;
    setLoanAmount(amount);
  };

  const handleRateChange = (value: string) => {
    const rate = value ? Number(value) : 0;
    setInterestRate(rate);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleReset = () => {
    setLoanAmount(100000);
    setInterestRate(5);
    setLoanTerm(20);
    toast({
      title: "Reset Completed",
      description: "Calculator has been reset to default values.",
    });
  };

  return (
    <CategoryLayout
      title="Loan Calculator"
      description="Calculate your monthly loan payments, total payment amount, and total interest paid."
      category="calculator"
      categoryColor="utility-calculator"
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Loan Information</h2>
              
              {/* Loan Amount */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <span className="text-sm text-muted-foreground">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex gap-3">
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    min="1000"
                    step="1000"
                    className="flex-1"
                  />
                </div>
                <Slider
                  value={[loanAmount]}
                  min={10000}
                  max={1000000}
                  step={10000}
                  onValueChange={(value) => setLoanAmount(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>$10k</span>
                  <span>$1M</span>
                </div>
              </div>
              
              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{interestRate}%</span>
                </div>
                <div className="flex gap-3">
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => handleRateChange(e.target.value)}
                    min="0.1"
                    max="30"
                    step="0.1"
                    className="flex-1"
                  />
                </div>
                <Slider
                  value={[interestRate]}
                  min={0.1}
                  max={20}
                  step={0.1}
                  onValueChange={(value) => setInterestRate(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1%</span>
                  <span>20%</span>
                </div>
              </div>
              
              {/* Loan Term */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="loanTerm">Loan Term (years)</Label>
                  <span className="text-sm text-muted-foreground">{loanTerm} years</span>
                </div>
                <div className="flex gap-3">
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    min="1"
                    max="40"
                    step="1"
                    className="flex-1"
                  />
                </div>
                <Slider
                  value={[loanTerm]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(value) => setLoanTerm(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 year</span>
                  <span>30 years</span>
                </div>
              </div>
              
              <Button onClick={handleReset} variant="outline">Reset Calculator</Button>
            </div>
            
            {/* Results Section */}
            <div className="bg-muted rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="h-6 w-6 text-utility-calculator" />
                <h2 className="text-xl font-medium">Loan Results</h2>
              </div>
              
              {monthlyPayment !== null ? (
                <div className="space-y-5">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Monthly Payment:</p>
                    <p className="text-2xl font-bold text-utility-calculator">{formatCurrency(monthlyPayment)}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Principal:</p>
                      <p className="text-lg font-medium">{formatCurrency(loanAmount)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Interest:</p>
                      <p className="text-lg font-medium text-amber-600 dark:text-amber-400">
                        {formatCurrency(totalInterest || 0)}
                      </p>
                    </div>
                    
                    <div className="col-span-2 pt-3 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Total Amount Paid:</p>
                      <p className="text-lg font-medium">{formatCurrency(totalPayment || 0)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Enter valid loan details to calculate payments</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tips section */}
        <div className="mt-8 bg-muted/50 rounded-xl p-6">
          <h3 className="font-medium mb-2">About Loan Calculations</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This calculator provides an estimate of your monthly loan payments using a standard amortization formula. 
            Actual loan terms may vary based on lender, loan type, credit score, and other factors.
          </p>
          <h4 className="font-medium mb-1 text-sm">Tips:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>A shorter loan term will increase monthly payments but reduce total interest paid</li>
            <li>Even a small decrease in interest rate can save thousands over the life of a loan</li>
            <li>Consider making extra payments to reduce the principal faster</li>
            <li>For mortgages, remember to account for property taxes and insurance</li>
          </ul>
        </div>
      </div>
    </CategoryLayout>
  );
}
