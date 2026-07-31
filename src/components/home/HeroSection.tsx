import React from 'react';
import { ShieldCheck, Sparkles, ArrowRight, Car, Wrench, Flame, Truck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../utils/i18n';

interface HeroSectionProps {
  onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreCatalog }) => {
  const { language, selectedVehicle, setGarageModalOpen, setAIDoctorOpen } = useAppStore();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#090d16] via-[#0b101c] to-[#07090e] text-slate-100 pt-8 pb-14 border-b border-slate-800/80">
      {/* Background Decorative Gradients & Glowing Mesh Orbs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text Banner */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 font-extrabold text-xs uppercase tracking-widest shadow-lg">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Monsoon Bike Care Sale • Up to 40% OFF Genuine Parts
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white uppercase">
              100% Genuine <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">Royal Enfield & OEM Parts</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
              Browse 50,000+ OEM drive chain kits, ceramic brake pads, 4T synthetic lubricants, spark plugs, and batteries for Royal Enfield, Hero, Honda, TVS, Bajaj, Yamaha & KTM.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <button
                onClick={() => setAIDoctorOpen(true)}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-extrabold text-xs uppercase tracking-wider rounded-2xl border border-slate-700 flex items-center gap-2 transition-all shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>AI Symptom Doctor</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>100% Genuine OEM Fitment Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Express Doorstep Delivery Across India</span>
              </div>
            </div>
          </div>

          {/* Right Hero Vehicle Selector Container */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Active Bike Selector</h3>
                    <p className="text-[11px] text-slate-400">Filter catalog to match your exact bike</p>
                  </div>
                </div>

                <button
                  onClick={() => setGarageModalOpen(true)}
                  className="text-xs text-amber-400 font-bold hover:underline"
                >
                  Change Bike
                </button>
              </div>

              {/* Selected Vehicle Display Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Selected Bike:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    ✓ Fitment Filter Active
                  </span>
                </div>

                <div className="text-lg font-black text-white">
                  {selectedVehicle
                    ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.year})`
                    : 'Royal Enfield Classic 350 (2023)'}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Fuel: {selectedVehicle?.fuelType || 'Petrol'}</span>
                  <span>Engine: {selectedVehicle?.engine || '350cc J-Series'}</span>
                </div>

                <button
                  onClick={onExploreCatalog}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/10"
                >
                  View Parts Compatible with My {selectedVehicle?.model || 'Classic 350'}
                </button>
              </div>

              {/* Decorative Bike Graphic */}
              <img
                src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80"
                alt="Motorcycle"
                className="mt-4 rounded-2xl w-full h-36 object-cover filter brightness-75 group-hover:scale-102 transition-transform duration-500 border border-slate-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
