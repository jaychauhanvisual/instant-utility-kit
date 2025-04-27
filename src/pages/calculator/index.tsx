
import { FC } from 'react';
import CategoryLayout from '@/components/CategoryLayout';
import ToolCard from '@/components/ToolCard';
import { Bmi, Loan, Age, Percentage } from 'lucide-react';

const CalculatorTools: FC = () => {
  const calculatorTools = [
    {
      id: 'bmi',
      title: 'BMI Calculator',
      description: 'Calculate Body Mass Index',
      icon: Bmi,
    },
    {
      id: 'loan',
      title: 'Loan Calculator',
      description: 'Calculate loan payments and interest',
      icon: Loan,
    },
    {
      id: 'age',
      title: 'Age Calculator',
      description: 'Calculate exact age from birth date',
      icon: Age,
    },
    {
      id: 'percentage',
      title: 'Percentage Calculator',
      description: 'Calculate percentages easily',
      icon: Percentage,
    },
  ];

  return (
    <CategoryLayout
      title="Calculator Tools"
      description="Make quick calculations for various everyday needs."
      category="calculator"
      categoryColor="utility-calculator"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {calculatorTools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            category="calculator"
            comingSoon={tool.comingSoon}
          />
        ))}
      </div>
    </CategoryLayout>
  );
};

export default CalculatorTools;
