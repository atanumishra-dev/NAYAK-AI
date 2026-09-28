import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Loader2, TrendingUp, TrendingDown, Target, Zap, AlertTriangle, Shield, CheckCircle, BarChart3, IndianRupee } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState({
    village: '',
    block: '',
    district: '',
    state: '',
    business_category: 'Dairy',
    available_margin: ''
  });

  const categories = ['Dairy', 'Poultry', 'Goat Farming', 'Grocery/Kirana', 'Tailoring', 'Small Restaurant/Food Stall'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDemoData = () => {
    setFormData({
      village: 'Sample Rural',
      block: 'Sample Block',
      district: 'Sample District',
      state: 'Sample State',
      business_category: 'Dairy',
      available_margin: '100000'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setData(null);
    setLoading(true);

    try {
      const margin = parseFloat(formData.available_margin);
      if (isNaN(margin) || margin <= 0) {
        throw new Error('Please enter a valid margin amount.');
      }

      const payload = {
        location: {
          village: formData.village,
          block: formData.block,
          district: formData.district,
          state: formData.state
        },
        business_category: formData.business_category,
        available_margin: margin
      };

      const response = await axios.post(`${API_URL}/advisory/analyze`, payload);
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Unable to generate the analysis right now. Please check the backend connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakh`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <Card className="w-full max-w-xl shadow-lg border-t-4 border-t-primary">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-slate-800 tracking-tight">GramVenture AI</CardTitle>
            <CardDescription className="text-md mt-2 text-slate-600">
              AI-Powered Hyper-Local Business Feasibility & Financial Structuring Assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8 text-center text-slate-700 bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-lg leading-snug">
                "Find the Right Business. Understand Your Market. Plan Your Finance."
              </p>
              <p className="text-sm mt-2 text-slate-500">
                Get a location-specific business feasibility assessment and a structured financing plan using your available capital.
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Village</Label>
                  <Input name="village" value={formData.village} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Block</Label>
                  <Input name="block" value={formData.block} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Input name="district" value={formData.district} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input name="state" value={formData.state} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Business Category</Label>
                <select 
                  name="business_category" 
                  value={formData.business_category} 
                  onChange={handleInputChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Available Margin Capital (₹)</Label>
                <Input type="number" name="available_margin" value={formData.available_margin} onChange={handleInputChange} placeholder="e.g. 100000" required />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit" disabled={loading} className="w-full text-md py-6">
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing local market...</>
                  ) : 'Generate Business Plan'}
                </Button>
                <Button type="button" variant="outline" onClick={handleDemoData} disabled={loading} className="w-full text-md py-6 border-slate-300">
                  Try Demo Data
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">GramVenture AI</h1>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {data.request_summary.location.village}, {data.request_summary.location.state}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Top Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-500 font-medium">Business</p>
              <p className="text-lg font-bold text-slate-800">{data.request_summary.business_category}</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-500 font-medium">Available Margin</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(data.financial_plan.available_margin)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-500 font-medium">Project Cost</p>
              <p className="text-lg font-bold text-slate-800">{formatCurrency(data.financial_plan.estimated_project_cost)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-500 font-medium">Financing Req.</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(data.financial_plan.financing_requirement)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Section 1 & 2 */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Feasibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-blue-600"/> Business Feasibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span>Feasibility Status</span>
                  <span className="text-emerald-600 font-bold">{data.feasibility.level}</span>
                </div>
                <Progress value={85} className="h-2 bg-slate-100 [&>div]:bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span>Market Potential</span>
                  <span>High</span>
                </div>
                <Progress value={75} className="h-2 bg-slate-100 [&>div]:bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1 text-sm font-medium">
                  <span>Competition</span>
                  <span>Low-Medium</span>
                </div>
                <Progress value={40} className="h-2 bg-slate-100 [&>div]:bg-amber-500" />
              </div>
              <p className="text-xs text-slate-400 italic">Prototype estimates based on simplified local market proxy models.</p>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-purple-600"/> Hyper-Local Market Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <p className="text-xs text-slate-500">Customer Base</p>
                  <p className="font-semibold">{data.market_analysis.estimated_local_customer_base}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <p className="text-xs text-slate-500">Service Radius</p>
                  <p className="font-semibold">{data.market_analysis.suggested_service_radius}</p>
                </div>
              </div>
              <h4 className="font-medium text-sm mb-2 text-slate-700">Why this business may work here:</h4>
              <ul className="space-y-2">
                {data.feasibility.reasons.map((r: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Section 4 - SWOT */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">SWOT Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-emerald-700"><TrendingUp className="h-4 w-4"/> <span className="font-bold">Strengths</span></div>
                <ul className="text-sm text-emerald-900 space-y-1 list-disc pl-4">{data.swot.Strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
              </CardContent>
            </Card>
            <Card className="bg-rose-50 border-rose-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-rose-700"><TrendingDown className="h-4 w-4"/> <span className="font-bold">Weaknesses</span></div>
                <ul className="text-sm text-rose-900 space-y-1 list-disc pl-4">{data.swot.Weaknesses.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-blue-700"><Zap className="h-4 w-4"/> <span className="font-bold">Opportunities</span></div>
                <ul className="text-sm text-blue-900 space-y-1 list-disc pl-4">{data.swot.Opportunities.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-amber-700"><AlertTriangle className="h-4 w-4"/> <span className="font-bold">Threats</span></div>
                <ul className="text-sm text-amber-900 space-y-1 list-disc pl-4">{data.swot.Threats.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 5 & 6 - Financial Plan & Scheme */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">Financial Plan & Recommended Scheme</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-slate-200 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><IndianRupee className="w-32 h-32" /></div>
              <CardHeader>
                <CardTitle>Financial Structure</CardTitle>
                <CardDescription>Prototype calculation based on simplified financing structure.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <span className="font-medium text-emerald-800">Available Margin</span>
                    <span className="text-lg font-bold text-emerald-700">{formatCurrency(data.financial_plan.available_margin)}</span>
                  </div>
                  <div className="flex justify-center text-slate-400">↓ determines (10%)</div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border">
                    <span className="font-medium text-slate-700">Estimated Project Cost</span>
                    <span className="text-lg font-bold text-slate-800">{formatCurrency(data.financial_plan.estimated_project_cost)}</span>
                  </div>
                  <div className="flex justify-center text-slate-400">↓ remaining (90%)</div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <span className="font-medium text-blue-800">Financing Requirement</span>
                    <span className="text-lg font-bold text-blue-700">{formatCurrency(data.financial_plan.financing_requirement)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-md bg-blue-50/30">
              <CardHeader className="pb-4">
                <div className="inline-flex px-3 py-1 bg-primary/10 text-primary font-semibold text-xs rounded-full w-fit mb-3">Recommended</div>
                <CardTitle className="text-2xl text-primary">{data.scheme_recommendation.scheme}</CardTitle>
                <CardDescription className="text-slate-600">Subject to eligibility, project appraisal and applicable SCA/CA guidelines.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-white rounded border">
                    <p className="text-slate-500">Max Scheme Loan</p>
                    <p className="font-bold text-slate-800">{formatCurrency(data.scheme_recommendation.eligible_loan_limit)}</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-primary/20">
                    <p className="text-slate-500">Recommended Loan</p>
                    <p className="font-bold text-primary">{formatCurrency(data.scheme_recommendation.recommended_loan)}</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="text-slate-500">Interest Rate</p>
                    <p className="font-bold text-slate-800">{data.scheme_recommendation.interest_rate}% p.a.</p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="text-slate-500">Tenure</p>
                    <p className="font-bold text-slate-800">Up to {data.scheme_recommendation.tenure_years} Years</p>
                  </div>
                  <div className="p-3 bg-white rounded border col-span-2 flex justify-between">
                    <span className="text-slate-500">Moratorium</span>
                    <span className="font-bold text-slate-800">{data.scheme_recommendation.moratorium_months} Months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Section 7 - Repayment Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Repayment Schedule</CardTitle>
            <CardDescription>Illustrative declining balance overview based on {data.repayment_plan.frequency} installments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.repayment_plan.schedule} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="installment_number" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip formatter={(value: any) => `₹${Number(value).toLocaleString()}`} labelFormatter={(l) => `Installment ${l}`} />
                  <Area type="monotone" dataKey="remaining_balance" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="max-h-64 overflow-y-auto border rounded-md">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3">Installment</th>
                    <th className="px-4 py-3">Principal</th>
                    <th className="px-4 py-3">Interest</th>
                    <th className="px-4 py-3 font-semibold">Total Payment</th>
                    <th className="px-4 py-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {data.repayment_plan.schedule.slice(0, 12).map((row: any) => (
                    <tr key={row.installment_number} className="bg-white">
                      <td className="px-4 py-2 font-medium">#{row.installment_number}</td>
                      <td className="px-4 py-2">₹{row.principal.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-rose-600">₹{row.interest.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 font-semibold">₹{row.payment.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-2 text-right">₹{row.remaining_balance.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">Showing first 12 installments. Full schedule available in report.</p>
          </CardContent>
        </Card>

        {/* Section 8 & 9 */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-amber-500"/> Risks & Mitigation</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {data.risks.map((risk: string, i: number) => (
                  <li key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded border">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{risk}</p>
                      <p className="text-xs text-slate-600 mt-1">Implement standard mitigation strategies to secure your business.</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-primary text-primary-foreground border-none">
            <CardHeader>
              <CardTitle>Action Plan</CardTitle>
              <CardDescription className="text-primary-foreground/80">Your recommended next steps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recommendations.map((rec: string, i: number) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20 text-sm font-bold shrink-0">{i+1}</div>
                    <p className="font-medium">{rec}</p>
                  </div>
                ))}
                <div className="flex gap-3 items-center">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20 text-sm font-bold shrink-0">3</div>
                    <p className="font-medium">Prepare loan application</p>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">Download Report</Button>
                <Button variant="outline" className="w-full border-white text-white bg-transparent hover:bg-white/10" onClick={() => setData(null)}>Start New</Button>
              </div>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}

export default App;
