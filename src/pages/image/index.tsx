
import { FC } from 'react';
import CategoryLayout from '@/components/CategoryLayout';
import ToolCard from '@/components/ToolCard';
import { ArrowUpDown, Crop, FileDigit, Eraser } from 'lucide-react';

const ImageTools: FC = () => {
  const imageTools = [
    {
      id: 'resize',
      title: 'Resize Image',
      description: 'Change dimensions of your images',
      icon: ArrowUpDown,
      comingSoon: false,
    },
    {
      id: 'crop',
      title: 'Crop Image',
      description: 'Remove unwanted areas from your images',
      icon: Crop,
      comingSoon: false,
    },
    {
      id: 'compress-image',
      title: 'Compress Image',
      description: 'Reduce image file size while preserving quality',
      icon: FileDigit,
      comingSoon: false,
    },
    {
      id: 'background-remove',
      title: 'Remove Background',
      description: 'Automatically remove image backgrounds',
      icon: Eraser,
      comingSoon: false,
    },
  ];

  return (
    <CategoryLayout
      title="Image Tools"
      description="Edit, convert, and optimize your images with our simple and powerful tools."
      category="image"
      categoryColor="utility-image"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {imageTools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            category="image"
            comingSoon={tool.comingSoon}
          />
        ))}
      </div>
    </CategoryLayout>
  );
};

export default ImageTools;
