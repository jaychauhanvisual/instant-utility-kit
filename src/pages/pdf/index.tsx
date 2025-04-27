
import { FC } from 'react';
import CategoryLayout from '@/components/CategoryLayout';
import ToolCard from '@/components/ToolCard';
import { Merge, Split, Compress, FileText } from 'lucide-react';

const PDFTools: FC = () => {
  const pdfTools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into one document',
      icon: Merge,
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Separate PDF pages into multiple files',
      icon: Split,
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce the file size of your PDF documents',
      icon: Compress,
    },
    {
      id: 'pdf-to-text',
      title: 'PDF to Text',
      description: 'Extract text content from PDF documents',
      icon: FileText,
      comingSoon: true,
    },
  ];

  return (
    <CategoryLayout
      title="PDF Tools"
      description="Process, modify, and convert PDF files with our simple and powerful tools."
      category="pdf"
      categoryColor="utility-pdf"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pdfTools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            title={tool.title}
            description={tool.description}
            icon={tool.icon}
            category="pdf"
            comingSoon={tool.comingSoon}
          />
        ))}
      </div>
    </CategoryLayout>
  );
};

export default PDFTools;
