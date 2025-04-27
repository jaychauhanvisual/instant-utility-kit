
import { FC } from 'react';
import CategoryLayout from '@/components/CategoryLayout';
import ToolCard from '@/components/ToolCard';
import { FileDown, ScissorsSquare, FileDigit, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PDFTools: FC = () => {
  const pdfTools = [
    {
      id: 'merge',
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into one document',
      icon: FileDown,
    },
    {
      id: 'split',
      title: 'Split PDF',
      description: 'Separate PDF pages into multiple files',
      icon: ScissorsSquare,
    },
    {
      id: 'compress',
      title: 'Compress PDF',
      description: 'Reduce the file size of your PDF documents',
      icon: FileDigit,
    },
    {
      id: 'pdf-to-text',
      title: 'PDF to Text',
      description: 'Extract text content from PDF documents',
      icon: FileText,
      comingSoon: true,
    },
  ];

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": pdfTools.map((tool, index) => ({
      "@type": "SoftwareApplication",
      "position": index + 1,
      "name": tool.title,
      "description": tool.description,
      "applicationCategory": "WebApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>PDF Tools - Free Online PDF Utilities | InstantUtils</title>
        <meta name="description" content="Process, modify, and convert PDF files with our simple and powerful tools. Merge, split, and compress PDFs online for free." />
        <meta name="keywords" content="PDF tools, merge PDF, split PDF, compress PDF, PDF to text, online PDF editor, free PDF tools" />
        <link rel="canonical" href="https://instantutils.jaychauhan.tech/pdf" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
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
    </>
  );
};

export default PDFTools;
