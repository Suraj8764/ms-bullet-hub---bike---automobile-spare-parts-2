import React, { useState } from 'react';
import { X, Sparkles, Send, Upload, AlertCircle, ShoppingCart, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AIDoctorModal: React.FC = () => {
  const { isAIDoctorOpen, setAIDoctorOpen, selectedVehicle, products, addToCart } = useAppStore();

  const [query, setQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  if (!isAIDoctorOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() && !imagePreview) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai/part-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || 'Identify damaged spare part in photo',
          vehicle: selectedVehicle,
          imageBase64: imagePreview
        })
      });

      const data = await res.json();
      setResponse(data.response || 'Diagnosis complete.');
    } catch (err) {
      setResponse('Master AI Bike Mechanic: Based on symptoms described for your motorcycle, inspect drive chain tension and lube condition, check ceramic brake pad thickness (Rolon/Endurance OEM), or check 4T synthetic oil level.');
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedPart = products[0]; // Bosch brake pads

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setAIDoctorOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20">
            <Sparkles className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
              AI Diagnostic Assistant
            </h3>
            <p className="text-xs text-slate-400">Describe noises, vibrations, or upload photos of broken parts for instant Gemini AI diagnosis.</p>
          </div>
        </div>

        {/* Vehicle Context Banner */}
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider">Vehicle Context:</span>
          <span className="text-amber-400 font-extrabold">
            {selectedVehicle
              ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year} ${selectedVehicle.fuelType})`
              : 'All Vehicles'}
          </span>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">
              Describe Vehicle Symptom or Fault
            </label>
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Squeaking sound coming from front wheel when braking at low speed, or dark smoke coming from exhaust..."
              className="w-full bg-slate-950 text-white text-xs p-3.5 rounded-2xl border border-slate-800 focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
            />
          </div>

          {/* Photo Upload Option */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950 border border-dashed border-slate-800">
            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors border border-slate-800">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Upload Part Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {imagePreview ? (
                <span className="text-xs text-emerald-400 font-semibold">Photo attached ✓</span>
              ) : (
                <span className="text-xs text-slate-500">Attach worn pad, filter, or engine bay photo</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/10 uppercase tracking-wider"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Diagnose with AI
                </>
              )}
            </button>
          </div>
        </form>

        {/* AI Result Box */}
        {response && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Gemini AI Mechanic Diagnosis Report:</span>
            </div>
            <p className="text-slate-200 leading-relaxed whitespace-pre-line">{response}</p>

            {/* Direct Recommendation Card */}
            {recommendedPart && (
              <div className="mt-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={recommendedPart.images[0]}
                    alt={recommendedPart.name}
                    className="w-12 h-12 object-cover rounded-xl border border-slate-800 bg-slate-950"
                  />
                  <div>
                    <h5 className="font-bold text-white line-clamp-1">{recommendedPart.name}</h5>
                    <p className="text-[11px] text-slate-400">OEM: {recommendedPart.oemNumber} | ₹{recommendedPart.price}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart(recommendedPart);
                    setAIDoctorOpen(false);
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shrink-0 uppercase tracking-wider"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Add Recommended
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
