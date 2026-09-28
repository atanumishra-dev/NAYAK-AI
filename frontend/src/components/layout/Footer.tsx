
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-white">GramVenture AI</span>
          </div>
          <p className="text-slate-400 text-sm max-w-sm mb-6">
            AI-powered business intelligence for rural entrepreneurs. Turn local opportunity into a bankable business plan.
          </p>
          <div className="text-xs text-slate-500 font-medium">
            Prototype • Smart India Hackathon 2026
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/analyze" className="hover:text-white transition-colors">Start Analysis</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
