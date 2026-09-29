
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, MapPin, BarChart3, TrendingUp, IndianRupee, ShieldCheck,
  Target, Search, Zap, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="bg-background min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 px-4">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMikiLz48L3N2Zz4=')] opacity-50"></div>
        </div>

        <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <Zap className="w-4 h-4" />
              Smart India Hackathon 2026 Prototype
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 text-balance">
              Turn Local Opportunity Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Bankable</span> Business Plan.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-xl text-balance">
              Nayak AI combines hyper-local market insights, business feasibility analysis, and structured financing guidance to help rural entrepreneurs move from idea to action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-6 md:px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all">
                <Link to="/analyze">Build My Business Plan <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-6 md:px-8 text-base rounded-full bg-white/50 backdrop-blur-sm border-slate-200">
                <a href="#how-it-works">Explore How It Works</a>
              </Button>
            </div>
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-2xl transform rotate-6"></div>
              
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-float">
                <div className="h-12 bg-slate-50 border-b flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Analysis Result</p>
                      <h3 className="text-xl font-bold text-slate-800">Dairy Farming</h3>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Promising
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-sm text-slate-500 mb-1">Available Capital</p>
                      <p className="text-lg font-bold text-slate-800">₹1,00,000</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-blue-600 mb-1">Financing Required</p>
                      <p className="text-lg font-bold text-blue-700">₹9,00,000</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary rounded-xl text-white">
                    <p className="text-sm text-primary-foreground/80 mb-1">Recommended Route</p>
                    <p className="text-lg font-bold">TERM LOAN SCHEME</p>
                    <div className="flex gap-4 mt-2 text-xs font-medium text-primary-foreground/90">
                      <span>8% p.a.</span>
                      <span>•</span>
                      <span>Up to 7 Years</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -right-8 top-16 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Market Gap Detected</p>
                  <p className="text-[10px] text-slate-500">High local demand</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -left-12 bottom-20 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Structure Ready</p>
                  <p className="text-[10px] text-slate-500">Financial plan created</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y bg-white/50 backdrop-blur-sm py-8 relative z-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Built for the realities of rural entrepreneurship
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-slate-700 font-medium">
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Hyper-local insights</div>
            <div className="flex items-center gap-2"><IndianRupee className="w-5 h-5 text-secondary" /> Financial planning</div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-amber-500" /> Scheme guidance</div>
            <div className="flex items-center gap-2"><Target className="w-5 h-5 text-blue-500" /> Actionable recommendations</div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">From location to business plan in minutes.</h2>
            <p className="text-lg text-slate-600">A guided, intelligent workflow that requires zero prior financial expertise.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>
            
            {[
              { num: '01', title: 'Choose Location', desc: 'Pinpoint your exact rural district or village block.', icon: MapPin },
              { num: '02', title: 'Pick Business', desc: 'Select the type of business you want to start.', icon: Search },
              { num: '03', title: 'Add Capital', desc: 'Tell us how much starting margin you have available.', icon: IndianRupee },
              { num: '04', title: 'Get Your Plan', desc: 'Receive a full feasibility and financial structure report.', icon: BarChart3 }
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <div className="absolute top-0 right-0 md:hidden w-1 h-full bg-slate-100 -z-10 left-1/2 -translate-x-1/2"></div>
                <span className="text-xs font-bold text-primary mb-2 tracking-widest uppercase">Step {step.num}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need before you invest.</h2>
            <p className="text-lg text-slate-600">Get answers to the most critical questions before committing your capital.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Market Opportunity', desc: 'Understand local demand and opportunity gaps.', icon: Target, color: 'text-blue-600', bg: 'bg-blue-100' },
              { title: 'Business Feasibility', desc: 'Evaluate whether the business makes sense for the selected location.', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { title: 'Competitor Insights', desc: 'Understand competition and your positioning.', icon: Search, color: 'text-amber-600', bg: 'bg-amber-100' },
              { title: 'Financial Structure', desc: 'See estimated project cost and financing requirement.', icon: IndianRupee, color: 'text-primary', bg: 'bg-primary/10' },
              { title: 'Scheme Guidance', desc: 'Understand the applicable prototype financing route.', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-100' },
              { title: 'Repayment Planning', desc: 'Visualize an estimated repayment schedule.', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-100' }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group cursor-default">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg}`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Showcase */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Know your numbers before you start.</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed max-w-lg">
              Nayak AI analyzes your available margin to project total costs, financing gaps, and routes you to the appropriate supportive scheme—giving you a realistic financial map.
            </p>
            <Button asChild variant="secondary" size="lg" className="rounded-full px-6 md:px-8 text-primary font-semibold hover:bg-white/90">
              <Link to="/analyze">Build My Plan</Link>
            </Button>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/20 pb-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Your Capital</p>
                  <p className="text-3xl font-bold">₹1,00,000</p>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">10% Margin</div>
              </div>
              <div className="flex justify-between items-end border-b border-white/20 pb-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Financing Required</p>
                  <p className="text-3xl font-bold text-amber-400">₹9,00,000</p>
                </div>
                <div className="px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-xs font-medium">90% Loan</div>
              </div>
              <div className="flex justify-between items-end pt-2">
                <div>
                  <p className="text-white/60 text-sm mb-1">Estimated Project Cost</p>
                  <p className="text-4xl font-bold">₹10,00,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 max-w-3xl mx-auto text-balance">
          Your next business decision starts with better information.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <Button asChild size="lg" className="h-14 px-8 md:px-10 text-base rounded-full shadow-lg">
            <Link to="/analyze">Build My Business Plan</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 md:px-10 text-base rounded-full">
            <Link to="/analyze">Try Demo</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
