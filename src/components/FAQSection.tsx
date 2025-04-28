
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is InstantUtils?",
      answer: "InstantUtils is a comprehensive online toolkit offering free utilities for everyday tasks. Our platform includes PDF tools, image editors, calculators, text converters, and more, all accessible without requiring any signup."
    },
    {
      question: "Are the tools really free?",
      answer: "Yes! All our basic tools are completely free to use. We believe in providing accessible utilities to everyone. Some advanced features might require a premium subscription in the future."
    },
    {
      question: "Is my data safe?",
      answer: "We take data privacy seriously. Files uploaded to our servers are automatically deleted after processing. We don't store any personal information unless explicitly provided for specific features."
    },
    {
      question: "Can I use InstantUtils on mobile devices?",
      answer: "Yes! Our platform is fully responsive and works on all devices including smartphones and tablets. The interface adapts to provide the best experience on any screen size."
    },
    {
      question: "Do I need to install anything?",
      answer: "No installation required! InstantUtils is a web-based platform that works directly in your browser. Just visit our website and start using the tools immediately."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Find answers to common questions about InstantUtils
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
