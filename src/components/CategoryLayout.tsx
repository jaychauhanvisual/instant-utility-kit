
import { FC, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface CategoryLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
}

const CategoryLayout: FC<CategoryLayoutProps> = ({ 
  children, 
  title, 
  description,
  category,
  categoryColor
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className={`py-12 border-b bg-${categoryColor}/5`}>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-start space-y-4 max-w-4xl">
              <Link 
                to="/explore" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to all tools
              </Link>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
          </div>
        </section>
        <div className="container px-4 md:px-6 py-12">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryLayout;
