
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function FeatureSection() {
  return (
    <section className="py-16 bg-muted/50" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Tools. Zero Complexity.
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Our toolkit makes file processing and calculations a breeze with minimal clicks.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-start space-y-4 p-6 bg-background rounded-xl shadow-sm border">
            <div className="p-3 rounded-full bg-utility-pdf/10">
              <svg className="h-6 w-6 text-utility-pdf" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">PDF Tools</h3>
              <p className="text-muted-foreground">
                Merge multiple PDFs, split large documents, compress file sizes, and convert between formats.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group mt-auto">
              <Link to="/pdf">
                Explore PDF Tools <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-start space-y-4 p-6 bg-background rounded-xl shadow-sm border">
            <div className="p-3 rounded-full bg-utility-image/10">
              <svg className="h-6 w-6 text-utility-image" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Image Tools</h3>
              <p className="text-muted-foreground">
                Resize, crop, compress, convert formats, and remove backgrounds from your images.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group mt-auto">
              <Link to="/image">
                Explore Image Tools <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-start space-y-4 p-6 bg-background rounded-xl shadow-sm border">
            <div className="p-3 rounded-full bg-utility-calculator/10">
              <svg className="h-6 w-6 text-utility-calculator" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Calculators</h3>
              <p className="text-muted-foreground">
                Calculate BMI, loan payments, age differences, percentages, and convert between units.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group mt-auto">
              <Link to="/calculator">
                Explore Calculators <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-start space-y-4 p-6 bg-background rounded-xl shadow-sm border">
            <div className="p-3 rounded-full bg-utility-text/10">
              <svg className="h-6 w-6 text-utility-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Text Tools</h3>
              <p className="text-muted-foreground">
                Convert text case, count words, generate Lorem Ipsum text, and format code or text.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group mt-auto">
              <Link to="/text">
                Explore Text Tools <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-start space-y-4 p-6 bg-background rounded-xl shadow-sm border">
            <div className="p-3 rounded-full bg-utility-other/10">
              <svg className="h-6 w-6 text-utility-other" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Other Tools</h3>
              <p className="text-muted-foreground">
                Generate QR codes, shorten URLs, pick colors, and format JSON data effortlessly.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group mt-auto">
              <Link to="/other">
                Explore Other Tools <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col items-start space-y-4 p-6 bg-background rounded-xl shadow-sm border">
            <div className="p-3 rounded-full bg-primary/10">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">No Sign-Up Required</h3>
              <p className="text-muted-foreground">
                Use all tools instantly without creating an account or providing personal information.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="group mt-auto">
              <Link to="/explore">
                Start Using Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
