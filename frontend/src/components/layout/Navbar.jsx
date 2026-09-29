import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, TrendingUp, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isApp = location.pathname.includes('/analyze') || location.pathname.includes('/results');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white shadow-sm overflow-hidden transition-transform group-hover:scale-105">
              <MapPin className="w-4 h-4 absolute -top-1 -right-1 opacity-50" />
              <TrendingUp className="w-5 h-5 z-10" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Nayak <span className="text-primary">AI</span></span>
          </Link>
        </div>

        {/* Desktop Nav */}
        {!isApp ? (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a>
            <a href="#features" className="hover:text-primary transition-colors">What You Get</a>
            <a href="#entrepreneurs" className="hover:text-primary transition-colors">For Entrepreneurs</a>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link to="/analyze" className={cn("hover:text-primary transition-colors", location.pathname === '/analyze' && "text-primary font-semibold")}>New Analysis</Link>
            <span className="cursor-not-allowed opacity-50">Saved Plans</span>
            <span className="cursor-not-allowed opacity-50">Reports</span>
          </nav>
        )}

        <div className="hidden md:flex items-center gap-4">
          {!isApp ? (
            <>
              <Button variant="ghost" className="text-slate-600 font-medium">Sign In</Button>
              <Button asChild className="rounded-full shadow-sm hover:shadow-md transition-all">
                <Link to="/analyze">Get Started</Link>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500 cursor-not-allowed">Help</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 cursor-not-allowed">
                US
              </div>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg py-4 px-4 flex flex-col gap-4">
          {!isApp ? (
            <>
              <a href="#how-it-works" className="text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
              <a href="#features" className="text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>What You Get</a>
              <a href="#entrepreneurs" className="text-slate-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>For Entrepreneurs</a>
              <hr />
              <Button variant="ghost" className="justify-start px-0">Sign In</Button>
              <Button asChild className="w-full justify-center">
                <Link to="/analyze" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              <Link to="/analyze" className="text-primary font-medium" onClick={() => setIsMobileMenuOpen(false)}>New Analysis</Link>
              <span className="text-slate-400 font-medium">Saved Plans</span>
              <span className="text-slate-400 font-medium">Reports</span>
            </>
          )}
        </div>
      )}
    </header>
  );
}
