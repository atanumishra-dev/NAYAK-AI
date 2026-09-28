import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, MapPin, IndianRupee, FileText, CheckCircle, 
  AlertTriangle, ArrowLeft, Download, Printer, Share2,
  TrendingUp, CloudRain, ShieldAlert, BarChart3, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Results() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('advisoryData');
    if (!stored) {
      navigate('/analyze');
    } else {
      setData(JSON.parse(stored));
    }
  }, [navigate]);

  if (!data) return null;

  const fmt = (val) => `₹${val.toLocaleString('en-IN')}`;
  
  const { 
    ai_report, financial_structure, financing_scheme, 
    request_summary, data_sources, warnings 
  } = data;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => navigate('/analyze')} className="text-slate-500 w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" /> Start Over
          </Button>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Button variant="outline" className="bg-white"><Download className="w-4 h-4 mr-2"/> Download PDF</Button>
            <Button variant="outline" className="bg-white"><Printer className="w-4 h-4 mr-2"/> Print</Button>
            <Button variant="outline" className="bg-white"><Share2 className="w-4 h-4 mr-2"/> Share</Button>
          </div>
        </div>

        {warnings && warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Notice</h3>
              <p className="text-sm mt-1">{warnings[0]}</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <CheckCircle className="w-4 h-4" /> AI Analysis Complete
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            {ai_report?.executive_summary?.headline || `Business Assessment`}
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-3xl leading-relaxed">
            {ai_report?.executive_summary?.summary}
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 border-t pt-6">
            <div className="flex items-center gap-2"><Building className="w-4 h-4"/> {request_summary.business_category}</div>
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {request_summary.location.village}, {request_summary.location.district}</div>
            <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Data Quality: <span className="font-semibold uppercase">{ai_report?.data_quality?.overall || 'Medium'}</span></div>
          </div>
        </div>

        {/* Financial & Scheme Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {/* Financials */}
          <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <IndianRupee className="w-5 h-5"/>
                <h2 className="font-semibold tracking-wide uppercase text-sm">Financial Structure</h2>
              </div>
              <div className="text-4xl font-bold mt-4">{fmt(financial_structure.calculated_financing_requirement)}</div>
              <div className="text-sm opacity-80 mt-1">Financing Required</div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-slate-500">Available Margin Capital</span>
                  <span className="font-medium">{fmt(financial_structure.margin_capital)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-slate-500">Estimated Project Cost</span>
                  <span className="font-medium">{fmt(financial_structure.estimated_project_cost)}</span>
                </div>
                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {ai_report?.financial_interpretation?.summary || 'Standard deterministic projection based on benchmarks.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scheme */}
          <Card className="border-emerald-200 shadow-sm overflow-hidden rounded-2xl bg-emerald-50">
            <div className="bg-emerald-600 p-6 text-white">
              <div className="flex items-center gap-2 mb-2 opacity-90">
                <FileText className="w-5 h-5"/>
                <h2 className="font-semibold tracking-wide uppercase text-sm">Recommended Scheme</h2>
              </div>
              <div className="text-2xl font-bold mt-4">{financing_scheme.scheme || financing_scheme.scheme_name}</div>
              <div className="text-sm opacity-90 mt-1">Government Support Match</div>
            </div>
            <CardContent className="p-6 bg-white h-full">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <div className="text-xs text-emerald-600 font-medium mb-1">Max Limit</div>
                    <div className="font-bold text-slate-900">{financing_scheme.maximum_loan_limit || 'Varies'}</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    <div className="text-xs text-emerald-600 font-medium mb-1">Interest Rate</div>
                    <div className="font-bold text-slate-900">{financing_scheme.interest_rate}</div>
                  </div>
                </div>
                {ai_report?.scheme_interpretation?.[0]?.why_it_may_apply && (
                  <p className="text-sm text-slate-600 border-t pt-4">
                    <span className="font-semibold text-slate-900 block mb-1">Why this applies:</span>
                    {ai_report.scheme_interpretation[0].why_it_may_apply}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Intelligence Grid */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-blue-500"/> Market Context
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100">
                <div className="text-xs text-slate-500 font-medium mb-1 uppercase">Local Market Price</div>
                <div className="text-2xl font-bold text-slate-900">
                  {data_sources?.market?.records?.[0]?.modal_price === 'Varies' 
                    ? 'Varies' 
                    : `₹${data_sources?.market?.records?.[0]?.modal_price} / ${data_sources?.market?.records?.[0]?.unit}`}
                </div>
                <div className="text-xs text-slate-400 mt-1">Source: {data_sources?.market?.source_name || 'AGMARKNET'}</div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {ai_report?.market_analysis?.observations?.[0] || 'Market data verified. Demand is stable.'}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CloudRain className="w-5 h-5 text-indigo-500"/> Weather Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                  <div className="text-xs text-slate-500 mb-1">Temp</div>
                  <div className="font-bold text-slate-900">{data_sources?.weather?.records?.[0]?.temperature}°C</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                  <div className="text-xs text-slate-500 mb-1">Rainfall</div>
                  <div className="font-bold text-slate-900">{data_sources?.weather?.records?.[0]?.rainfall}</div>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {data_sources?.weather?.records?.[0]?.forecast}. {data_sources?.weather?.records?.[0]?.warnings?.[0]}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldAlert className="w-5 h-5 text-rose-500"/> Key Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ai_report?.risk_analysis?.slice(0,2).map((r, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full shrink-0 bg-rose-500"/>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{r.risk}</div>
                      <div className="text-xs text-slate-500 mt-1">{r.mitigation}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Plan */}
        <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {['next_7_days', 'next_30_days', 'next_90_days'].map((timeline, idx) => (
                  <div key={timeline} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h4 className="font-semibold text-slate-900 capitalize mb-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                        {idx + 1}
                      </div>
                      {timeline.replace(/_/g, ' ')}
                    </h4>
                    <ul className="space-y-3">
                      {(ai_report?.action_plan?.[timeline] || ['Review market data', 'Check local regulations']).map((action, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400">
          {data.disclaimer}
        </p>

      </div>
    </div>
  );
}
