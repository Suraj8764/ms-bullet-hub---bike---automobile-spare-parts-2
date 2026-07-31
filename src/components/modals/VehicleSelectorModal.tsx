import React, { useState } from 'react';
import { X, Car, Check, Search, ShieldCheck, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const VehicleSelectorModal: React.FC = () => {
  const {
    isGarageModalOpen,
    setGarageModalOpen,
    selectedVehicle,
    setSelectedVehicle,
    vehicleMakes,
    vehicleModelsMap,
    fuelTypes,
    addVehicleMake,
    addVehicleModel
  } = useAppStore();

  const [make, setMake] = useState(selectedVehicle?.make || 'Royal Enfield');
  const [model, setModel] = useState(selectedVehicle?.model || 'Classic 350');
  const [year, setYear] = useState(selectedVehicle?.year || 2023);
  const [fuelType, setFuelType] = useState(selectedVehicle?.fuelType || 'Petrol');
  const [engine, setEngine] = useState(selectedVehicle?.engine || '350cc J-Series');
  const [vinInput, setVinInput] = useState('');

  // Custom Make / Model input states
  const [isAddingCustomMake, setIsAddingCustomMake] = useState(false);
  const [customMakeName, setCustomMakeName] = useState('');
  const [customModelName, setCustomModelName] = useState('');

  if (!isGarageModalOpen) return null;

  const availableModels = vehicleModelsMap[make] || ['Base Model'];

  const handleSave = () => {
    setSelectedVehicle({
      make,
      model,
      year,
      fuelType,
      engine,
      vin: vinInput || undefined
    });
    setGarageModalOpen(false);
  };

  const handleAddCustomVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMakeName || !customModelName) return;
    addVehicleMake(customMakeName);
    addVehicleModel(customMakeName, customModelName);
    setMake(customMakeName);
    setModel(customModelName);
    setIsAddingCustomMake(false);
    setCustomMakeName('');
    setCustomModelName('');
  };

  const handleVINSearch = () => {
    if (vinInput.length >= 5) {
      // Decode simulated VIN/Chassis
      setMake('Royal Enfield');
      setModel('Classic 350');
      setYear(2023);
      setFuelType('Petrol');
      setEngine('350cc J-Series');
      alert(`Chassis / VIN Verified! Vehicle identified: Royal Enfield Classic 350 (2023 Petrol).`);
    } else {
      alert('Please enter a valid 17-digit Chassis / VIN Number.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => setGarageModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider">Garage Fitment Selector</h3>
            <p className="text-xs text-slate-400">Select your motorcycle or scooter to filter parts with guaranteed fitment.</p>
          </div>
        </div>

        {/* Option 1: VIN Number Quick Finder */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <label className="text-xs font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
            🔍 Quick VIN / Chassis Number Lookup (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={vinInput}
              onChange={(e) => setVinInput(e.target.value.toUpperCase())}
              placeholder="e.g. MA3EWB1S000123456"
              className="flex-1 bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleVINSearch}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl text-xs border border-slate-800 transition-colors uppercase tracking-wider"
            >
              Decode VIN
            </button>
          </div>
        </div>

        {/* Step-by-Step Selectors */}
        <div className="space-y-4">
          {/* Make Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              1. Select Brand / Make
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {vehicleMakes.map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMake(m);
                    setModel(vehicleModelsMap[m]?.[0] || '');
                  }}
                  className={`p-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                    make === m
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              2. Select Model ({make})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
              {availableModels.map((m) => (
                <button
                  key={m}
                  onClick={() => setModel(m)}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    model === m
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Year & Fuel Type Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                3. Manufacturing Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
              >
                {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                4. Fuel Type
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
              >
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Summary Pill */}
        <div className="mt-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>
              Active Fitment Tag: <strong className="text-white">{make} {model} ({year} {fuelType})</strong>
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setGarageModalOpen(false)}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold border border-slate-800 transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/10 flex items-center gap-1.5 transition-all uppercase tracking-wider"
          >
            <Check className="w-4 h-4" />
            Apply & Filter Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
