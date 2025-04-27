
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="py-12 md:py-20 lg:py-24 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                All Your <span className="text-primary">Favorite Tools</span> <br />In One Place
              </h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Process files, transform images, calculate with precision, and manipulate text—all in one powerful toolkit. Fast, free, and no sign-up required.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/explore">
                  Explore Tools
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[350px] sm:h-[400px] sm:w-[400px] md:h-[450px] md:w-[450px] lg:h-[400px] lg:w-[400px] xl:h-[500px] xl:w-[500px]">
              {/* Abstract shapes for visual interest */}
              <div className="absolute left-0 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-utility-pdf opacity-20 blur-3xl animate-pulse-light"></div>
              <div className="absolute right-0 top-1/4 h-40 w-40 rounded-full bg-utility-image opacity-20 blur-3xl animate-pulse-light" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-utility-calculator opacity-20 blur-3xl animate-pulse-light" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute right-1/4 top-0 h-40 w-40 rounded-full bg-utility-text opacity-20 blur-3xl animate-pulse-light" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Floating tool cards */}
              <div className="absolute left-[10%] top-[20%] h-20 w-20 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center animate-float">
                <svg className="h-8 w-8 text-utility-pdf" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="absolute right-[15%] top-[60%] h-20 w-20 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.7s' }}>
                <svg className="h-8 w-8 text-utility-image" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute left-[25%] bottom-[10%] h-20 w-20 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '0.3s' }}>
                <svg className="h-8 w-8 text-utility-calculator" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute right-[25%] top-[10%] h-20 w-20 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.2s' }}>
                <svg className="h-8 w-8 text-utility-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </div>
              <div className="absolute left-[55%] top-[40%] h-20 w-20 rounded-lg bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: '1.8s' }}>
                <svg className="h-8 w-8 text-utility-other" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
