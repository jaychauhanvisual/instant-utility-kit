
import { FC } from 'react';
import CategoryLayout from '@/components/CategoryLayout';
import ToolCard from '@/components/ToolCard';
import { CaseLower, Text } from 'lucide-react';

const TextTools: FC = () => {
  const textTools = [
    {
      id: 'case-converter',
      title: 'Case Converter',
      description: 'Convert text between different cases',
      icon: CaseLower,
      comingSoon: false,
    },
    {
      id: 'word-counter',
      title: 'Word Counter',
      description: 'Count words, characters and paragraphs',
      icon: Text,
      comingSoon: false,
    },
  ];

  return (
    <CategoryLayout
      title="Text Tools"
      description="Manipulate and analyze text with our simple yet powerful text utilities."
      category="text"
      categoryColor="utility-text"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {textTools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            category="text"
            comingSoon={tool.comingSoon}
          />
        ))}
      </div>
    </CategoryLayout>
  );
};

export default TextTools;
