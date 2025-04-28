
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FAQSection from '@/components/FAQSection';
import FeedbackForm from '@/components/FeedbackForm';

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>FAQ - InstantUtils</title>
        <meta name="description" content="Frequently asked questions about InstantUtils tools and services" />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <FAQSection />
        <FeedbackForm />
      </main>
      <Footer />
    </div>
  );
}
