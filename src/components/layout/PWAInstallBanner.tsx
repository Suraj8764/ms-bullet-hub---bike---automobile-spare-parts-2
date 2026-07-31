import React, { useState, useEffect } from 'react';
import { Download, X, Star, ShieldCheck, Smartphone, Share2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { usePWAInstall } from '../../utils/usePWAInstall';
import { useAppStore } from '../../store/useAppStore';

export const PWAInstallBanner: React.FC = () => {
  const { hasNativePrompt, isStandalone, isIOS, triggerInstall } = usePWAInstall();
  const { setAppDownloadModalOpen } = useAppStore();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if user dismissed earlier in current session
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isStandalone || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      const accepted = await triggerInstall();
      if (accepted) {
        setInstalledSuccess(true);
        setTimeout(() => setDismissed(true), 3000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback: Open full App Download modal with QR code & instructions
      setAppDownloadModalOpen(true);
    }
  };

  return (
    <>
      {/* Top Chrome Extension / Web Store Style App Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/30 text-white shadow-xl relative z-40 animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto px-3 py-2.5 sm:px-6 flex items-center justify-between gap-3">
          {/* Left App Brand & Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src="/icon-192.png"
                alt="MS BULLET HUB App"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-md border border-amber-500/40 object-cover"
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-xs sm:text-sm text-white truncate tracking-tight">
                  MS BULLET HUB App
                </h4>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Official PWA App
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-300 truncate">
                <span className="flex items-center text-amber-400 font-bold">
                  4.9 <Star className="w-3 h-3 fill-amber-400 ml-0.5 inline" />
                </span>
                <span className="text-slate-500">•</span>
                <span className="truncate">Instant Order Tracking & OEM Parts</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {installedSuccess ? (
              <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Installed!
              </span>
            ) : (
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Install App</span>
              </button>
            )}

            <button
              onClick={() => setAppDownloadModalOpen(true)}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
            >
              <span>QR Code</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Instructions Modal Popup */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Smartphone className="w-5 h-5" />
                <span>Install MS BULLET HUB on iOS</span>
              </div>
              <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Install our web application directly on your iPhone or iPad home screen in 2 quick steps:
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="p-2 rounded-xl bg-slate-800 text-amber-400 font-bold shrink-0">1</div>
                <div>
                  Tap the <Share2 className="w-4 h-4 inline text-blue-400 mx-1" /> <strong>Share</strong> button in Safari’s bottom toolbar.
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <div className="p-2 rounded-xl bg-slate-800 text-amber-400 font-bold shrink-0">2</div>
                <div>
                  Scroll down & tap <strong>"Add to Home Screen"</strong> <Sparkles className="w-3.5 h-3.5 inline text-amber-400 ml-1" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
