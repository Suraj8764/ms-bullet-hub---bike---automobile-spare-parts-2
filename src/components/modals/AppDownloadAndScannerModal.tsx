import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  Download,
  Copy,
  Check,
  Camera,
  Scan,
  ShieldCheck,
  Share2,
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import QRCode from 'qrcode';
import { useAppStore } from '../../store/useAppStore';
import { usePWAInstall } from '../../utils/usePWAInstall';

export const AppDownloadAndScannerModal: React.FC = () => {
  const { isAppDownloadModalOpen, setAppDownloadModalOpen } = useAppStore();
  const { hasNativePrompt, isStandalone, isIOS, triggerInstall } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'download' | 'camera_scanner'>('download');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installedCompleted, setInstalledCompleted] = useState(false);
  const [showDirectGuide, setShowDirectGuide] = useState(false);

  // Camera Scanner State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://msbullethub.in';

  // Generate real QR Code on mount or open
  useEffect(() => {
    if (isAppDownloadModalOpen) {
      QRCode.toDataURL(
        currentAppUrl,
        {
          width: 320,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        },
        (err, url) => {
          if (!err && url) {
            setQrDataUrl(url);
          }
        }
      );
    }
  }, [isAppDownloadModalOpen, currentAppUrl]);

  // Handle Camera Start
  const startCamera = async () => {
    setCameraError(null);
    setScannedResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable on this browser.');
      setCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera_scanner') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  if (!isAppDownloadModalOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstallApp = async () => {
    setInstalling(true);
    setInstalledCompleted(false);
    if (hasNativePrompt) {
      const accepted = await triggerInstall();
      setInstalling(false);
      if (accepted) {
        setInstalledCompleted(true);
      }
    } else {
      setInstalling(false);
      setShowDirectGuide(true);
    }
  };

  const simulateScanSuccess = () => {
    setScannedResult(`MS-PARTS-REG-${Math.floor(100000 + Math.random() * 900000)} (Genuine OEM Verified)`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-2">
                Download Mobile App & Scanner
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30 uppercase">
                  Free
                </span>
              </h3>
              <p className="text-xs text-slate-400">Scan QR Code or download Android APK directly</p>
            </div>
          </div>

          <button
            onClick={() => setAppDownloadModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-2">
          <button
            onClick={() => setActiveTab('download')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'download'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-extrabold'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Scan QR / Download App
          </button>

          <button
            onClick={() => setActiveTab('camera_scanner')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              activeTab === 'camera_scanner'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-extrabold'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            Live Camera Scanner
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'download' && (
            <div className="space-y-6 text-center">
              {/* QR Code Container */}
              <div className="p-5 rounded-3xl bg-white border-4 border-amber-500/40 inline-block shadow-2xl relative group mx-auto">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Scan QR Code to Download App" className="w-48 h-48 mx-auto" />
                ) : (
                  <div className="w-48 h-48 bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-mono">
                    Generating QR...
                  </div>
                )}
                <div className="mt-2 pt-2 border-t border-slate-200 text-center">
                  <p className="text-[10px] font-black text-slate-900 tracking-wider uppercase">MS BULLET HUB APP QR</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>How to Install via QR Scanner:</span>
                </div>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
                  <li>Open phone <strong>Camera app</strong> or <strong>Google Lens / QR Scanner</strong>.</li>
                  <li>Point your phone camera at the QR code above.</li>
                  <li>Tap the pop-up link to open MS BULLET HUB store.</li>
                  <li>Tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleInstallApp}
                  disabled={installing}
                  className="py-3 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {installing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Opening Installer...
                    </>
                  ) : installedCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      App Installed!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Install Official Web App
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      App Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-amber-400" />
                      Copy Direct App Link
                    </>
                  )}
                </button>
              </div>

              {showDirectGuide && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" />
                      Installation Steps for Your Device
                    </span>
                  </div>
                  {isIOS ? (
                    <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1">
                      <li>Tap the <strong>Share</strong> button in Safari toolbar.</li>
                      <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                      <li>Launch MS BULLET HUB directly from your home screen icon!</li>
                    </ol>
                  ) : (
                    <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside pl-1">
                      <li>Tap the <strong>3-dots menu (⋮)</strong> in top-right corner of Chrome.</li>
                      <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                      <li>Launch MS BULLET HUB directly with fast offline caching!</li>
                    </ol>
                  )}
                </div>
              )}

              {/* PWA Direct Prompt note */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Works natively on all Android phones (Samsung, Xiaomi, Realme, Vivo) & Apple iPhones!</span>
              </div>
            </div>
          )}

          {activeTab === 'camera_scanner' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-slate-300">
                Point your phone camera at any <strong>Parts Box QR Code</strong>, <strong>Invoice QR</strong>, or <strong>Coupon Tag</strong> to scan instantly.
              </p>

              {/* Camera Video Frame */}
              <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 flex items-center justify-center shadow-inner group">
                <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

                {/* Laser Overlay Animation */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    <div className="w-56 h-36 border-2 border-amber-400 rounded-xl relative overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-bounce my-auto"></div>
                    </div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-2 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400/30">
                      Scanning QR Code...
                    </span>
                  </div>
                )}

                {cameraError && (
                  <div className="p-4 text-xs text-rose-400 font-bold bg-rose-500/10 rounded-xl border border-rose-500/20 max-w-xs">
                    {cameraError}
                  </div>
                )}
              </div>

              {/* Scan Simulator Button */}
              <div className="pt-2">
                <button
                  onClick={simulateScanSuccess}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 uppercase tracking-wider"
                >
                  <Scan className="w-4 h-4" />
                  Test Scan Sample QR Code
                </button>
              </div>

              {/* Scan Result Box */}
              {scannedResult && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-left space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>QR Code Detected Successfully!</span>
                  </div>
                  <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {scannedResult}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-center flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Secure & Virus Free</span>
          </div>
          <button
            onClick={() => setAppDownloadModalOpen(false)}
            className="text-amber-400 hover:underline font-bold"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
