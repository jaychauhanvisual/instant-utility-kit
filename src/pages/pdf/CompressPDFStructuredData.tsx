
import { Helmet } from 'react-helmet-async';

interface CompressPDFSEOProps {
  url: string;
}

const CompressPDFStructuredData: React.FC<CompressPDFSEOProps> = ({ url }) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF Compressor",
    "applicationCategory": "WebApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Compress PDF files to reduce file size while maintaining quality. Free online tool with no registration required.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156"
    }
  };

  return (
    <Helmet>
      <title>Compress PDF Files Online - Free PDF Compressor | InstantUtils</title>
      <meta name="description" content="Reduce PDF file size without losing quality. Our free online PDF compressor makes your PDFs smaller and easier to share. No registration required." />
      <meta name="keywords" content="compress PDF, PDF compressor, reduce PDF size, shrink PDF, optimize PDF, online PDF compressor, free PDF compression" />
      <link rel="canonical" href={url} />
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default CompressPDFStructuredData;
