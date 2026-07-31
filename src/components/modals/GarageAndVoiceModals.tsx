import React, { useState } from 'react';
import { X, MapPin, Phone, Calendar, Clock, Wrench, CheckCircle, Mic, QrCode, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const GarageLocatorModal: React.FC = () => {
  const { isMechanicModalOpen, setMechanicModalOpen, selectedVehicle, garages } = useAppStore();

  const [bookingGarage, setBookingGarage] = useState<any | null>(null);
  const [selectedService, setSelectedService] = useState('Brake Fitting & Suspension Check');
  const [date, setDate] = useState('2026-08-01');
  const [time, setTime] = useState('10:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!isMechanicModalOpen) return null;

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingGarage(null);
      setMechanicModalOpen(false);
      alert('Mechanic Booking Confirmed! Your appointment SMS confirmation has been sent to your mobile.');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setMechanicModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-wider">Certified MS BULLET HUB Workshops & Mechanic Booking</h3>
            <p className="text-xs text-slate-400">Book genuine part installation or doorstep mechanic assistance.</p>
          </div>
        </div>

        {bookingGarage ? (
          /* Booking Form */
          <form onSubmit={handleBookAppointment} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider">Workshop: </span>
                <strong className="text-amber-400">{bookingGarage.name}</strong>
              </div>
              <button
                type="button"
                onClick={() => setBookingGarage(null)}
                className="text-slate-400 hover:text-white underline font-medium"
              >
                Change Workshop
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Select Service Required</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
              >
                {bookingGarage.services.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Appointment Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wider">Time Slot</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:30 AM">11:30 AM - 01:30 PM</option>
                  <option value="02:30 PM">02:30 PM - 04:30 PM</option>
                  <option value="05:00 PM">05:00 PM - 07:00 PM</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <p className="text-slate-300">Target Vehicle: <strong className="text-white">{selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : 'Unspecified'}</strong></p>
              <p className="text-slate-400">Part Installation Charge: <span className="text-emerald-400 font-bold">Standard ₹299 (Paid at Garage)</span></p>
            </div>

            <button
              type="submit"
              disabled={bookingSuccess}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/10 uppercase tracking-wider"
            >
              {bookingSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 text-slate-950" />
                  Booking Confirmed!
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Confirm Workshop Booking
                </>
              )}
            </button>
          </form>
        ) : (
          /* Garages List */
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {garages.map((g) => (
              <div key={g.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-3">
                  <img src={g.image} alt={g.name} className="w-20 h-20 object-cover rounded-xl border border-slate-800 shrink-0 bg-slate-900" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{g.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {g.address}, {g.city} ({g.distanceKm} km away)
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-amber-400 font-bold">
                      <span>⭐ {g.rating} ({g.reviewsCount} reviews)</span>
                      <span className="text-slate-700">|</span>
                      <span className="text-slate-300 font-normal">{g.phone}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setBookingGarage(g)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shrink-0 transition-all uppercase tracking-wider"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const VoiceAndBarcodeModals: React.FC = () => {
  const {
    isVoiceSearchOpen,
    setVoiceSearchOpen,
    isBarcodeScannerOpen,
    setBarcodeScannerOpen,
    setSearchQuery
  } = useAppStore();

  const [isListening, setIsListening] = useState(false);

  const startVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Rolon Chain Kit Classic 350');
      setVoiceSearchOpen(false);
      alert('Voice Recognized: "Rolon Chain Kit Classic 350". Filter applied!');
    }, 2500);
  };

  const handleSimulateScan = () => {
    setSearchQuery('ROL-RE-350-BRS');
    setBarcodeScannerOpen(false);
    alert('Barcode Scanned: OEM #ROL-RE-350-BRS (Rolon Brass Drive Chain Kit).');
  };

  return (
    <>
      {/* Voice Search Modal */}
      {isVoiceSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-sm p-6 text-center relative animate-in fade-in duration-200">
            <button onClick={() => setVoiceSearchOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-4 border border-amber-500/20">
              <Mic className={`w-8 h-8 ${isListening ? 'animate-bounce text-amber-400' : ''}`} />
            </div>
            <h3 className="font-black text-lg mb-1 uppercase tracking-wider">Voice Part Search</h3>
            <p className="text-xs text-slate-400 mb-6">Say the part name, vehicle model, or OEM number clearly.</p>

            <button
              onClick={startVoice}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              {isListening ? 'Listening...' : 'Tap to Start Speaking'}
            </button>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {isBarcodeScannerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-md p-6 relative animate-in fade-in duration-200">
            <button onClick={() => setBarcodeScannerOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <QrCode className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <h3 className="font-black text-lg uppercase tracking-wider">OEM Barcode Scanner</h3>
              <p className="text-xs text-slate-400">Position the OEM barcode on the spare part packaging inside the frame.</p>
            </div>

            <div className="w-full h-48 rounded-2xl bg-slate-950 border-2 border-dashed border-amber-500/40 flex flex-col items-center justify-center p-4 relative overflow-hidden">
              <div className="w-full h-1 bg-amber-500 shadow-lg shadow-amber-500 animate-pulse absolute top-1/2 -translate-y-1/2"></div>
              <QrCode className="w-16 h-16 text-slate-700 opacity-40 mb-2" />
              <span className="text-xs text-slate-400 font-mono">Camera Scanner Active</span>
            </div>

            <button
              onClick={handleSimulateScan}
              className="mt-4 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all"
            >
              Simulate Scan Barcode (OEM #55810M74L00)
            </button>
          </div>
        </div>
      )}
    </>
  );
};
