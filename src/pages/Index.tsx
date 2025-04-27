
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import StatsSection from '@/components/StatsSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeatureSection />
        <StatsSection />
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Streamline Your Workflow?
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Start using our tools now — no sign-up, no downloads, just instant results.
                </p>
              </div>
              <div className="mt-4">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/explore">
                    Get Started Now
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
