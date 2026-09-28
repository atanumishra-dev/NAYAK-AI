import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeAdvisory } from '@/lib/api';
import { MapPin, Briefcase, IndianRupee, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStates, getDistricts, getVillages } from '@/lib/locationData';

const categories = [
  { id: 'Dairy', icon: '🥛', desc: 'Milk production & distribution' },
  { id: 'Poultry', icon: '🐔', desc: 'Egg & meat production' },
  { id: 'Goat Farming', icon: '🐐', desc: 'Livestock rearing' },
  { id: 'Fish Farming', icon: '🐟', desc: 'Aquaculture' },
  { id: 'Grocery / Kirana', icon: '🏪', desc: 'Retail provisions' },
  { id: 'Food Processing', icon: '🥫', desc: 'Value addition' },
  { id: 'Tailoring', icon: '🧵', desc: 'Clothing & stitching' },
  { id: 'Mobile Repair', icon: '📱', desc: 'Electronics servicing' },
  { id: 'Food Stall', icon: '🍳', desc: 'Quick service food' },
  { id: 'Handicrafts', icon: '🏺', desc: 'Artisan goods' },
  { id: 'Agriculture Input Store', icon: '🌱', desc: 'Seeds & fertilizers' }
];

export default function Analyze() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    state: '', district: '', village: '',
    business_category: '',
    available_margin: ''
  });

  const availableStates = getStates();
  const availableDistricts = formData.state ? getDistricts(formData.state) : [];
  const availableVillages = (formData.state && formData.district) ? getVillages(formData.state, formData.district) : [];

  const handleStateChange = (e) => {
    setFormData(prev => ({ ...prev, state: e.target.value, district: '', village: '' }));
  };

  const handleDistrictChange = (e) => {
    setFormData(prev => ({ ...prev, district: e.target.value, village: '' }));
  };

  const handleVillageChange = (e) => {
    setFormData(prev => ({ ...prev, village: e.target.value }));
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDemo = () => {
    setFormData({
      state: 'Maharashtra', district: 'Pune', village: 'Haveli',
      business_category: 'Dairy',
      available_margin: '100000'
    });
    setStep(3);
  };

  const handleSubmit = async () => {
    setError('');
    
    if (!formData.state || !formData.district || !formData.village) {
        setError('Please select state, district, and village.');
        setStep(1);
        return;
    }
    
    if (!formData.business_category) {
        setError('Please select a business category.');
        setStep(2);
        return;
    }

    setIsLoading(true);
    setLoadingStep(1);

    try {
      const margin = parseFloat(formData.available_margin);
      if (isNaN(margin) || margin <= 0) throw new Error('Please enter a valid margin amount.');

      const payload = {
        location: {
          village: formData.village, 
          district: formData.district, 
          state: formData.state
        },
        business_category: formData.business_category,
        available_margin: margin
      };

      // Mock loading sequence for premium feel
      setTimeout(() => setLoadingStep(2), 1000);
      setTimeout(() => setLoadingStep(3), 2000);
      setTimeout(() => setLoadingStep(4), 3000);

      const response = await analyzeAdvisory(payload);
      
      // Store in session storage to pass to results page
      sessionStorage.setItem('advisoryData', JSON.stringify(response));
      
      setTimeout(() => {
        navigate('/results');
      }, 4000);

    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || err.message || 'We couldn\'t complete the analysis. Your information is safe. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Preparing your business plan</h2>
          
          <div className="space-y-6">
            {[
              { id: 1, text: "Analyzing your location" },
              { id: 2, text: "Understanding local market" },
              { id: 3, text: "Evaluating business feasibility" },
              { id: 4, text: "Structuring financing" }
            ].map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 ${loadingStep > item.id ? 'bg-emerald-500' : loadingStep === item.id ? 'bg-blue-500' : 'bg-slate-100'}`}>
                  {loadingStep > item.id ? <CheckCircle className="w-4 h-4 text-white" /> : loadingStep === item.id ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : null}
                </div>
                <span className={`text-sm font-medium transition-colors duration-500 ${loadingStep >= item.id ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">New Analysis</h1>
          <Button variant="ghost" onClick={handleDemo} className="text-primary hover:bg-primary/10 rounded-full">
            Try a demo
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm flex items-start gap-3">
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Progress Header */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {[1, 2, 3].map(num => (
              <div key={num} className={`flex-1 p-4 text-center border-r last:border-r-0 transition-colors ${step === num ? 'bg-white border-b-2 border-b-primary text-primary' : step > num ? 'text-slate-700' : 'text-slate-400'}`}>
                <span className="text-xs font-bold uppercase tracking-widest block mb-1">Step {num}</span>
                <span className="font-medium text-sm hidden sm:block">{num === 1 ? 'Location' : num === 2 ? 'Business' : 'Capital'}</span>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-10 min-h-[400px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><MapPin className="w-5 h-5" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Where?</h2>
                      <p className="text-slate-500 text-sm">Tell us where you want to start your business.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>State</Label>
                      <select 
                        name="state" 
                        value={formData.state} 
                        onChange={handleStateChange}
                        className="flex h-12 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                      >
                        <option value="" disabled>Select State</option>
                        {availableStates.map(st => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>District</Label>
                      <select 
                        name="district" 
                        value={formData.district} 
                        onChange={handleDistrictChange}
                        disabled={!formData.state}
                        className="flex h-12 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm disabled:opacity-50"
                      >
                        <option value="" disabled>Select District</option>
                        {availableDistricts.map(dt => (
                            <option key={dt} value={dt}>{dt}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Village / Block</Label>
                      <select 
                        name="village" 
                        value={formData.village} 
                        onChange={handleVillageChange}
                        disabled={!formData.district}
                        className="flex h-12 w-full rounded-md border border-input bg-slate-50 px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm disabled:opacity-50"
                      >
                        <option value="" disabled>Select Village / Block</option>
                        {availableVillages.map(vil => (
                            <option key={vil} value={vil}>{vil}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Briefcase className="w-5 h-5" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">What?</h2>
                      <p className="text-slate-500 text-sm">Choose a business category.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map(cat => (
                      <div 
                        key={cat.id} 
                        onClick={() => setFormData(prev => ({ ...prev, business_category: cat.id }))}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.business_category === cat.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        <div className="text-2xl mb-2">{cat.icon}</div>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1">{cat.id}</h3>
                        <p className="text-xs text-slate-500">{cat.desc}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><IndianRupee className="w-5 h-5" /></div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">How much?</h2>
                      <p className="text-slate-500 text-sm">Enter your available margin capital.</p>
                    </div>
                  </div>
                  
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xl">₹</div>
                      <Input 
                        type="number" 
                        name="available_margin" 
                        value={formData.available_margin} 
                        onChange={handleInputChange}
                        className="h-16 pl-10 text-2xl font-bold bg-slate-50 border-2 focus-visible:border-primary focus-visible:ring-0" 
                        placeholder="100000" 
                      />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[50000, 100000, 200000, 500000].map(val => (
                        <Button 
                          key={val}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => setFormData(prev => ({ ...prev, available_margin: val.toString() }))}
                        >
                          ₹{val / 1000}K
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 md:p-6 bg-slate-50 border-t flex justify-between items-center">
            <Button 
              variant="ghost" 
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className={step === 1 ? 'invisible' : ''}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {step < 3 ? (
              <Button onClick={() => setStep(s => s + 1)} className="rounded-full px-8">
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="rounded-full px-8 bg-primary">
                <span className="hidden sm:inline">Generate Business Plan</span><span className="sm:hidden">Generate</span> <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
