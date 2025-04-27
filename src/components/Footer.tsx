
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-bold text-lg">InstantUtils</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your all-in-one toolkit for everyday utilities. Fast, free, and completely online.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-3">Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pdf" className="hover:text-primary transition-colors">PDF Tools</Link></li>
              <li><Link to="/image" className="hover:text-primary transition-colors">Image Tools</Link></li>
              <li><Link to="/calculator" className="hover:text-primary transition-colors">Calculators</Link></li>
              <li><Link to="/text" className="hover:text-primary transition-colors">Text Tools</Link></li>
              <li><Link to="/other" className="hover:text-primary transition-colors">Other Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Feedback</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-8 border-t text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} InstantUtils. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
