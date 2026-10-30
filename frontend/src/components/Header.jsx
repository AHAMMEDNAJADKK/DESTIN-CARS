import React from 'react';
import { Phone, ShieldCheck, Clock, Award, FileText, PlusCircle, Printer, Download, FolderClock } from 'lucide-react';

const Header = ({
  onNewVoucher,
  onOpenSaved,
  savedCount = 0,
  onPrint,
  onDownloadPDF,
  isEditing = false,
  voucherNumber = ''
}) => {
  return (
    <header className="no-print bg-[#072418] border-b border-emerald-900/60 sticky top-0 z-40 shadow-lg backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-lime-400 via-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-lime-950/40">
            <span className="font-extrabold text-xl tracking-tighter text-emerald-950">DC</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                DESTIN<span className="text-lime-400">.</span>CABS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-lime-400/20 text-lime-300 border border-lime-400/30">
                PRO VOUCHER
              </span>
            </div>
            <p className="text-[11px] font-semibold tracking-wider text-emerald-300 uppercase">
              PREMIUM DESTINATION CABS
            </p>
          </div>
        </div>

        {/* Brand Core Promises & Direct Call Contact */}
        <div className="hidden lg:flex items-center gap-5 text-xs text-emerald-200/90 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-lime-400" />
            <span>SAFE</span>
          </div>
          <span className="text-emerald-700">•</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-lime-400" />
            <span>COMFORTABLE</span>
          </div>
          <span className="text-emerald-700">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-lime-400" />
            <span>ON TIME</span>
          </div>
          <div className="h-6 w-px bg-emerald-800 mx-1"></div>
          <a
            href="tel:+919526886600"
            className="flex items-center gap-2 bg-emerald-900/60 hover:bg-emerald-800/80 text-lime-300 px-3 py-1.5 rounded-lg border border-emerald-700/60 font-semibold transition-all hover:scale-105"
          >
            <Phone className="w-3.5 h-3.5 text-lime-400" />
            <span>+91 95268 86600</span>
          </a>
        </div>

        {/* Global Action buttons */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onNewVoucher}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-700/70 text-emerald-100 text-xs font-semibold border border-emerald-700 transition-all hover:text-white"
          >
            <PlusCircle className="w-3.5 h-3.5 text-lime-400" />
            <span>New Voucher</span>
          </button>

          <button
            type="button"
            onClick={onOpenSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold border border-emerald-700 relative transition-all hover:text-white"
          >
            <FolderClock className="w-3.5 h-3.5 text-lime-400" />
            <span>Saved Vouchers</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-lime-400 text-emerald-950 font-bold text-[10px] rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold border border-emerald-700 transition-all hover:text-white"
            title="Print Voucher (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs font-bold shadow-md shadow-lime-950/20 transition-all hover:scale-105"
            title="Download A4 PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
