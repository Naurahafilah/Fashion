import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { LoginPage } from './components/auth/LoginPage';
import { TopNavbar } from './components/layout/TopNavbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppSwitcher } from './components/layout/AppSwitcher';

// Modules
import { HomeModule } from './components/modules/HomeModule';
import { DashboardModule } from './components/modules/DashboardModule';
import { CRMPipelineModule } from './components/modules/CRMPipelineModule';
import { SalesModule } from './components/modules/SalesModule';
import { POSModule } from './components/modules/POSModule';
import { PurchaseModule } from './components/modules/PurchaseModule';
import { InventoryModule } from './components/modules/InventoryModule';
import { DeliveryModule } from './components/modules/DeliveryModule';
import { ReceiptModule } from './components/modules/ReceiptModule';
import { CustomerInvoiceModule } from './components/modules/CustomerInvoiceModule';
import { VendorBillModule } from './components/modules/VendorBillModule';
import { RegisterPaymentDialog } from './components/modules/RegisterPaymentDialog';
import { AccountingModule } from './components/modules/AccountingModule';
import { ReturnsModule } from './components/modules/ReturnsModule';
import { ContactsModule } from './components/modules/ContactsModule';
import { ProductsModule } from './components/modules/ProductsModule';
import { AuditLogModule } from './components/modules/AuditLogModule';
import { SettingsModule } from './components/modules/SettingsModule';

import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ERPAppContent: React.FC = () => {
  const {
    currentUser,
    activeApp,
    activeView,
    appSwitcherOpen,
    notifications,
    removeNotification,
  } = useERP();

  // If not logged in, show luxury fashion editorial login page
  if (!currentUser) {
    return <LoginPage />;
  }

  // Render the appropriate module and subview
  const renderCurrentModule = () => {
    switch (activeApp) {
      case 'home':
        return <HomeModule />;
      case 'dashboard':
        return <DashboardModule />;
      case 'crm':
        return <CRMPipelineModule />;
      case 'sales':
        return <SalesModule />;
      case 'pos':
        return <POSModule />;
      case 'purchase':
        return <PurchaseModule />;
      case 'inventory':
        if (activeView === 'delivery_orders') return <DeliveryModule />;
        if (activeView === 'receipts') return <ReceiptModule />;
        if (activeView === 'returns') return <ReturnsModule />;
        return <InventoryModule />;
      case 'invoicing':
        if (activeView === 'credit_notes') return <ReturnsModule />;
        return <CustomerInvoiceModule />;
      case 'accounting':
        if (activeView === 'vendor_bills') return <VendorBillModule />;
        if (activeView === 'register_payment') return <RegisterPaymentDialog />;
        return <AccountingModule />;
      case 'contacts':
        return <ContactsModule />;
      case 'products':
        return <ProductsModule />;
      case 'reporting':
        return <DashboardModule />;
      case 'audit':
        return <AuditLogModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F5F0E8] text-[#171717]">
      {/* Odoo Top Navigation Bar */}
      <TopNavbar />

      {/* Main Workspace: Left Sidebar + Active View */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {renderCurrentModule()}
        </main>
      </div>

      {/* App Switcher Overlay */}
      {appSwitcherOpen && <AppSwitcher />}

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto p-3.5 rounded-xl text-xs font-medium shadow-xl flex items-start gap-2.5 transition-all border ${
              n.type === 'success'
                ? 'bg-[#171717] text-white border-[#54745B]/60'
                : n.type === 'error'
                ? 'bg-[#171717] text-white border-[#B94B4B]/60'
                : n.type === 'warning'
                ? 'bg-[#171717] text-white border-[#C18B42]/60'
                : 'bg-[#171717] text-white border-[#333333]'
            }`}
          >
            {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#54745B] shrink-0 mt-0.5" />}
            {n.type === 'error' && <AlertCircle className="w-4 h-4 text-[#B94B4B] shrink-0 mt-0.5" />}
            {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#C18B42] shrink-0 mt-0.5" />}
            {n.type === 'info' && <Info className="w-4 h-4 text-[#D5CEBF] shrink-0 mt-0.5" />}

            <div className="flex-1 leading-snug">{n.message}</div>

            <button
              onClick={() => removeNotification(n.id)}
              className="text-[#8C8983] hover:text-white shrink-0 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'Terjadi kesalahan saat memuat aplikasi.' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#F5F0E8] text-[#171717] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#FFFEFC] border border-[#E7E3DD] rounded-2xl p-6 shadow-sm space-y-4">
            <h1 className="text-lg font-bold text-[#171717]">Gagal Memuat Workspace ERP</h1>
            <p className="text-xs text-[#8C8983] leading-relaxed">
              Kemungkinan ada data cache browser dari versi sebelumnya yang tidak sesuai. Anda dapat mereset cache lokal atau memuat ulang halaman.
            </p>
            {this.state.errorMessage && (
              <div className="p-2.5 rounded-lg bg-[#F5F0E8] border border-[#E7E3DD] font-mono text-[11px] text-[#B91C1C] break-words">
                {this.state.errorMessage}
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.removeItem('PT_RONA_KARSA_ERP_STATE_V1');
                  } catch {
                    // ignore
                  }
                  window.location.reload();
                }}
                className="px-4 py-2 bg-[#171717] text-white text-xs font-semibold rounded-lg hover:bg-[#282828]"
              >
                Reset Cache & Muat Ulang
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white border border-[#E7E3DD] text-xs font-medium rounded-lg hover:bg-[#F5F0E8]"
              >
                Coba Muat Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <ERPProvider>
        <ERPAppContent />
      </ERPProvider>
    </AppErrorBoundary>
  );
}
