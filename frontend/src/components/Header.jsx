import React, { useState } from 'react';
import {
  PlusCircle,
  FolderClock,
  Printer,
  Download,
  Loader2,
  Eye,
  Edit3,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Award,
  Clock
} from 'lucide-react';
import DestinLogo from './DestinLogo';

const Header = ({
  onNewVoucher,
  onOpenSaved,
  savedCount = 0,
  onPrint,
  onDownloadPDF,
  activeView = 'form', // 'form' | 'preview'
  onToggleView,
  isEditing = false,
  voucherNumber = '',
  isGeneratingPDF = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileNav = (view) => {
    onToggleView(view);
    setMobileMenuOpen(false);
  };

  const handleMobileNew = () => {
    onNewVoucher();
    setMobileMenuOpen(false);
  };

  const handleMobileSaved = () => {
    onOpenSaved();
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print bg-[#003D2F] border-b border-[#004B38] sticky top-0 z-40 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        
        {/* ============================================================== */}
        {/* LEFT: Logo + Brand Name + Legal Subtitle                        */}
        {/* ============================================================== */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Logo container with strict aspect-ratio preserve */}
          <div className="flex items-center justify-center p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0">
            <DestinLogo variant="dark" className="h-6 sm:h-7 w-auto" />
          </div>

          {/* Typography block */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-white font-display leading-tight">
                DESTIN CABS
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#D8EB29]/15 text-[#D8EB29] border border-[#D8EB29]/30 leading-none">
                VOUCHER
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-emerald-200/90 uppercase leading-normal">
              DESTIN PRIVATE LIMITED
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER: Minimal Navigation for Available Sections             */}
        {/* ============================================================== */}
        <nav className="hidden md:flex items-center gap-1 bg-[#002B21] p-1 rounded-xl border border-[#004B38]/80">
          <button
            type="button"
            onClick={() => onToggleView('form')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'form'
                ? 'bg-[#004B38] text-white shadow-sm'
                : 'text-emerald-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Edit3 className={`w-3.5 h-3.5 ${activeView === 'form' ? 'text-[#D8EB29]' : 'text-emerald-400'}`} />
            <span>Trip Voucher Form</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleView('preview')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeView === 'preview'
                ? 'bg-[#004B38] text-white shadow-sm'
                : 'text-emerald-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${activeView === 'preview' ? 'text-[#D8EB29]' : 'text-emerald-400'}`} />
            <span>Voucher Preview</span>
          </button>
        </nav>

        {/* ============================================================== */}
        {/* RIGHT: Actions (Saved, New, Print, PDF)                        */}
        {/* ============================================================== */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Saved Vouchers */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004B38] hover:bg-[#065b44] text-emerald-100 text-xs font-semibold border border-emerald-700/50 transition-colors"
          >
            <FolderClock className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span>Saved Vouchers</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-[#D8EB29] text-[#003D2F] font-bold text-[10px] rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Voucher */}
          <button
            type="button"
            onClick={onNewVoucher}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004B38] hover:bg-[#065b44] text-emerald-100 text-xs font-semibold border border-emerald-700/50 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span>New Voucher</span>
          </button>

          {/* Quick Print */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004B38] hover:bg-[#065b44] text-emerald-100 text-xs font-semibold border border-emerald-700/50 transition-colors"
            title="Print Voucher (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span>Print</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D8EB29] hover:bg-[#C6D922] text-[#003D2F] text-xs font-black shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed"
            title="Export official A4 PDF"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#003D2F]" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isGeneratingPDF ? 'Generating...' : 'PDF'}</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={onNewVoucher}
            className="px-2.5 py-1.5 rounded-lg bg-[#D8EB29] text-[#003D2F] text-xs font-black shrink-0"
          >
            New
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#004B38] text-white hover:bg-[#075943] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MOBILE EXPANDED MENU DRAWER                                    */}
      {/* ============================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#002B21] border-b border-[#004B38] px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#004B38]">
            <button
              type="button"
              onClick={() => handleMobileNav('form')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 ${
                activeView === 'form' ? 'bg-[#004B38] text-white' : 'text-emerald-300 bg-white/5'
              }`}
            >
              <Edit3 className="w-4 h-4 text-[#D8EB29]" />
              <span>Form Editor</span>
            </button>

            <button
              type="button"
              onClick={() => handleMobileNav('preview')}
              className={`p-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 ${
                activeView === 'preview' ? 'bg-[#004B38] text-white' : 'text-emerald-300 bg-white/5'
              }`}
            >
              <Eye className="w-4 h-4 text-[#D8EB29]" />
              <span>Preview</span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <button
              type="button"
              onClick={handleMobileSaved}
              className="w-full text-left px-3 py-2 rounded-lg bg-[#004B38]/60 text-emerald-100 text-xs font-semibold flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <FolderClock className="w-4 h-4 text-[#D8EB29]" />
                Saved Vouchers
              </span>
              {savedCount > 0 && (
                <span className="px-2 py-0.5 bg-[#D8EB29] text-[#003D2F] font-bold text-[10px] rounded-full">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onPrint();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-[#004B38]/60 text-emerald-100 text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#D8EB29]" />
              <span>Print Voucher</span>
            </button>

            <button
              type="button"
              disabled={isGeneratingPDF}
              onClick={() => {
                onDownloadPDF();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-[#004B38]/60 text-emerald-100 text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <Loader2 className="w-4 h-4 text-[#D8EB29] animate-spin" />
              ) : (
                <Download className="w-4 h-4 text-[#D8EB29]" />
              )}
              <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#004B38] text-[10px] text-emerald-300/80 flex items-center justify-between">
            <span>DESTIN PRIVATE LIMITED</span>
            <span>+91 95268 86600</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
