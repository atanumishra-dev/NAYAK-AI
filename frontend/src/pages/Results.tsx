import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Download, Share2, AlertTriangle, TrendingUp,
  CheckCircle, ShieldCheck, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const rawData = sessionStorage.getItem('advisoryData');
    if (!rawData) {
      navigate('/analyze');
      return;
    }
    setData(JSON.parse(rawData));
  }, [navigate]);

  if (!data) return null;

  const {
    location,
    business_category,
    feasibility,
    financial_structure,
    financing_scheme,
    repayment_schedule
  } = data;

  // Format currency
  const fmt = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  
  // Repayment chart data formatting
  const chartData = repayment_schedule?.map((item: any) => ({
    year: `Year ${item.year}`,
    balance: item.remaining_balance
  })) || [];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-900">Your Business Plan</h1>
            <p className="text-xs text-slate-500">{business_category} in {location.village}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex" disabled><Share2 className="w-4 h-4 mr-2" /> Share</Button>
            <Button size="sm" className="bg-slate-900"><Download className="w-4 h-4 mr-2" /> Report</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-3 gap-6">
          
          {/* Executive Summary */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">Feasibility Status</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Promising</h2>
                </div>
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Market Demand</p>
                  <p className="font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" /> High</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Competition</p>
                  <p className="font-bold text-amber-600 flex items-center gap-1"><AlertTriangle className="w-4 h-4" /> Medium</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Capital Route</p>
                  <p className="font-bold text-primary flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> {financing_scheme?.scheme_name || 'Eligible'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Overview Flow */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Financial Structure</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
                {/* Desktop Connector Line */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2"></div>
                
                <div className="w-full md:w-1/3 bg-white p-6 rounded-xl border-2 border-slate-200 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Your Capital</div>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{fmt(financial_structure.margin_capital)}</p>
                  <p className="text-sm text-slate-500">10% Margin</p>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 z-10 shrink-0">+</div>
                
                <div className="w-full md:w-1/3 bg-white p-6 rounded-xl border-2 border-blue-200 text-center relative shadow-sm">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs font-bold text-blue-600 uppercase tracking-wider">Financing Req.</div>
                  <p className="text-3xl font-bold text-blue-700 mb-1">{fmt(financial_structure.calculated_financing_requirement)}</p>
                  <p className="text-sm text-blue-500">90% Loan</p>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 z-10 shrink-0">=</div>
                
                <div className="w-full md:w-1/3 bg-white p-6 rounded-xl border-2 border-primary text-center relative shadow-md">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs font-bold text-primary uppercase tracking-wider">Project Cost</div>
                  <p className="text-3xl font-bold text-primary mb-1">{fmt(financial_structure.estimated_project_cost)}</p>
                  <p className="text-sm text-primary-foreground/60 text-slate-500">Total Estimate</p>
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-1">
                <Info className="w-3 h-3" /> Prototype estimate; actual financing depends on applicable scheme rules and assessment.
              </p>
            </div>
          </div>

          {/* SWOT Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-slate-900">SWOT Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 h-full">
                <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Strengths</h4>
                <ul className="space-y-2">
                  {feasibility.swot_analysis?.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-emerald-900/80 leading-relaxed">• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100 h-full">
                <h4 className="font-bold text-rose-800 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"/> Weaknesses</h4>
                <ul className="space-y-2">
                  {feasibility.swot_analysis?.weaknesses?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-rose-900/80 leading-relaxed">• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 h-full">
                <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> Opportunities</h4>
                <ul className="space-y-2">
                  {feasibility.swot_analysis?.opportunities?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-blue-900/80 leading-relaxed">• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100 h-full">
                <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"/> Threats</h4>
                <ul className="space-y-2">
                  {feasibility.swot_analysis?.threats?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-amber-900/80 leading-relaxed">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Scheme Card */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Recommended Scheme</h3>
            <div className="bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden h-full flex flex-col">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10 flex-1">
                <ShieldCheck className="w-8 h-8 text-amber-400 mb-4" />
                <h4 className="text-2xl font-bold mb-2">{financing_scheme.scheme_name}</h4>
                <p className="text-primary-foreground/80 text-sm mb-6">Based on your project cost, this is the appropriate prototype financing route.</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-sm text-primary-foreground/80">Interest Rate</span>
                    <span className="font-bold">{financing_scheme.beneficiary_interest_rate}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-sm text-primary-foreground/80">Tenure</span>
                    <span className="font-bold">{financing_scheme.repayment_period}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/20">
                    <span className="text-sm text-primary-foreground/80">Moratorium</span>
                    <span className="font-bold">{financing_scheme.moratorium}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-primary-foreground/80">Max Loan</span>
                    <span className="font-bold">{financing_scheme.maximum_loan_limit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Repayment Chart */}
          <div className="lg:col-span-3 space-y-4 mt-8">
            <h3 className="text-xl font-bold text-slate-900">Illustrative Repayment Schedule</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <RechartsTooltip 
                    formatter={(value: any) => [fmt(Number(value)), 'Remaining Balance']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="lg:col-span-3 space-y-4 mt-8">
            <h3 className="text-xl font-bold text-slate-900">Action Plan</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Validate local demand and pricing",
                  "Compare supplier prices for equipment",
                  "Confirm project investment breakdown",
                  "Review financing route requirements",
                  "Prepare required documents",
                  "Start execution planning"
                ].map((action, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 font-bold text-slate-500 text-sm">
                      0{i + 1}
                    </div>
                    <div>
                      <p className="text-slate-800 font-medium text-sm leading-tight pt-1">{action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
