
import { FC } from 'react';
import CategoryLayout from '@/components/CategoryLayout';
import ToolCard from '@/components/ToolCard';
import { QrCode, Link2, Palette, FileJson } from 'lucide-react';

const OtherTools: FC = () => {
  const otherTools = [
    {
      id: 'qr-generator',
      title: 'QR Generator',
      description: 'Generate QR codes for any text or URL',
      icon: QrCode,
      comingSoon: true,
    },
    {
      id: 'url-shortener',
      title: 'URL Shortener',
      description: 'Create short links from long URLs',
      icon: Link2,
      comingSoon: true,
    },
    {
      id: 'color-picker',
      title: 'Color Picker',
      description: 'Pick and convert between color formats',
      icon: Palette,
    },
    {
      id: 'json-formatter',
      title: 'JSON Formatter',
      description: 'Format and validate JSON data',
      icon: FileJson,
      comingSoon: true,
    },
  ];

  return (
    <CategoryLayout
      title="Other Utilities"
      description="A collection of miscellaneous tools for various everyday tasks."
      category="other"
      categoryColor="utility-other"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {otherTools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            category="other"
            comingSoon={tool.comingSoon}
          />
        ))}
      </div>
    </CategoryLayout>
  );
};

export default OtherTools;
