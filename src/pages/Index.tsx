import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import StatsSection from '@/components/StatsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FileDigit, 
  Image, 
  Calculator, 
  FileText, 
  Link as LinkIcon, 
  ArrowRight,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet-async';

// Tool category data with icons and links
const toolCategories = [
  { 
    name: "PDF Tools", 
    icon: FileDigit, 
    color: "utility-pdf", 
    description: "Combine, split, and compress PDF files",
    link: "/pdf"
  },
  { 
    name: "Image Tools", 
    icon: Image, 
    color: "utility-image", 
    description: "Resize, crop, and optimize your images",
    link: "/image"
  },
  { 
    name: "Calculators", 
    icon: Calculator, 
    color: "utility-calculator", 
    description: "Financial, health, and general calculations",
    link: "/calculator"
  },
  { 
    name: "Text Tools", 
    icon: FileText, 
    color: "utility-text", 
    description: "Format, count, and transform text",
    link: "/text"
  },
];

export default function Index() {
  const [visibleSection, setVisibleSection] = useState(0);
  const [animateToolCards, setAnimateToolCards] = useState(false);

  // Animation timing for staggered elements
  useEffect(() => {
    // Initialize animations
    const timer = setTimeout(() => {
      setAnimateToolCards(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements with the scroll-animation class
    document.querySelectorAll('.scroll-animation').forEach(el => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "InstantUtils",
    "url": "https://instantutils.jaychauhan.tech",
    "applicationCategory": "UtilityApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free online utilities for everyday tasks. PDF tools, image editors, calculators, text converters, and more.",
    "operatingSystem": "Any",
    "screenshot": "https://instantutils.jaychauhan.tech/screenshot.jpg",
    "softwareVersion": "1.0",
    "author": {
      "@type": "Person",
      "name": "Jay Chauhan"
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>InstantUtils - Free Online Utilities and Tools</title>
        <meta name="description" content="Free online utilities for everyday tasks. PDF tools, image editors, calculators, text converters, and more. No signup required." />
        <meta name="keywords" content="online utilities, free tools, pdf tools, image resizer, calculator, text tools" />
        <link rel="canonical" href="https://instantutils.jaychauhan.tech/" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        
        {/* Popular Tools Section */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Most Popular Tools
              </h2>
              <p className="mt-4 text-muted-foreground md:text-xl max-w-3xl mx-auto">
                Try our most-used utilities, designed to simplify your everyday tasks
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {toolCategories.map((category, index) => (
                <Link 
                  key={category.name} 
                  to={category.link}
                  className={cn(
                    "group relative rounded-xl border bg-card p-6 shadow-sm transition-all",
                    "hover:shadow-md hover:scale-105",
                    animateToolCards ? "animate-fade-in" : "opacity-0",
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={cn(
                      "shrink-0 rounded-full p-3",
                      `bg-${category.color}/10`
                    )}>
                      <category.icon className={cn(
                        "h-6 w-6",
                        `text-${category.color}`
                      )} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Button asChild variant="outline" size="lg" className="group">
                <Link to="/explore">
                  <span>Explore all tools</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <StatsSection />
        
        {/* Testimonials Section */}
        <section className="py-16 bg-gradient-to-b from-white to-muted/30 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12 scroll-animation">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                What Our Users Say
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                See why thousands of users trust InstantUtils for their everyday tasks
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Thompson",
                  role: "Digital Marketer",
                  content: "The PDF compression tool saved me gigabytes of storage space. The quality remains excellent while file sizes are drastically reduced."
                },
                {
                  name: "Sarah Chen",
                  role: "Web Developer",
                  content: "I use the image resizing tool daily for my web projects. It's fast, accurate, and the batch processing saves me so much time."
                },
                {
                  name: "Marcus Johnson",
                  role: "Financial Analyst",
                  content: "The loan calculator provides exactly the information I need to help clients understand their mortgage options. Simple but powerful."
                }
              ].map((testimonial, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "rounded-lg border bg-card p-6 shadow-sm",
                    "scroll-animation"
                  )}
                >
                  <div className="flex space-x-1 mb-3">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div className="rounded-full bg-primary/10 h-10 w-10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.name[0]}{testimonial.name.split(" ")[1][0]}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section with animation */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center scroll-animation">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Streamline Your Workflow?
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Start using our tools now — no sign-up, no downloads, just instant results.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild size="lg" className="rounded-full animate-pulse hover:animate-none group transition-all duration-300">
                  <Link to="/explore" className="flex items-center">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
