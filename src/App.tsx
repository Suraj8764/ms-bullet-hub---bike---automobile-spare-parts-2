/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { HomeView } from './components/home/HomeView';
import { ProductCatalogView } from './components/shop/ProductCatalogView';
import { CheckoutView } from './components/checkout/CheckoutView';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { AdminDashboardView, AdminTab } from './components/admin/AdminDashboardView';

import { VehicleSelectorModal } from './components/modals/VehicleSelectorModal';
import { AIDoctorModal } from './components/modals/AIDoctorModal';
import { CompareModal } from './components/modals/CompareModal';
import { GarageLocatorModal, VoiceAndBarcodeModals } from './components/modals/GarageAndVoiceModals';
import { AppDownloadAndScannerModal } from './components/modals/AppDownloadAndScannerModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { ProductDetailModal } from './components/shop/ProductDetailModal';

import { useAppStore } from './store/useAppStore';
import { Product } from './types';

export default function App() {
  const { darkMode } = useAppStore();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [adminSubTab, setAdminSubTab] = useState<AdminTab>('dashboard');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleOrderComplete = (orderNumber: string) => {
    setTrackingOrderId(orderNumber);
    setActiveTab('tracking');
  };

  const handleNavigateAdmin = (subTab: AdminTab) => {
    setAdminSubTab(subTab);
    setActiveTab('admin');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white relative overflow-x-hidden">
      {/* Dynamic ambient background mesh lighting */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-500/10 via-blue-600/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 -left-20 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      {activeTab === 'admin' ? (
        /* Standalone Enterprise Admin Portal - Completely isolated from customer store */
        <AdminDashboardView initialTab={adminSubTab} onExitAdmin={() => setActiveTab('home')} />
      ) : (
        /* Customer Store View */
        <>
          {/* Customer Store Navbar */}
          <Navbar onNavigateTab={setActiveTab} onNavigateAdmin={handleNavigateAdmin} activeTab={activeTab} />

          {/* Main Content Body */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <HomeView
                onNavigateTab={setActiveTab}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            )}

            {activeTab === 'catalog' && (
              <ProductCatalogView
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            )}

            {activeTab === 'checkout' && (
              <CheckoutView
                onBack={() => setActiveTab('catalog')}
                onOrderComplete={handleOrderComplete}
              />
            )}

            {activeTab === 'tracking' && (
              <OrderTrackingView initialOrderId={trackingOrderId} />
            )}
          </main>

          {/* Customer Store Footer */}
          <Footer onNavigateTab={setActiveTab} />

          {/* Fixed Customer Mobile Bottom Dock */}
          <MobileBottomBar activeTab={activeTab} onNavigateTab={setActiveTab} />

          {/* Customer Drawers & Modals */}
          <VehicleSelectorModal />
          <AIDoctorModal />
          <CompareModal />
          <GarageLocatorModal />
          <VoiceAndBarcodeModals />
          <AppDownloadAndScannerModal />
          <CartDrawer onCheckout={() => setActiveTab('checkout')} />
          <ProductDetailModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        </>
      )}
    </div>
  );
}
