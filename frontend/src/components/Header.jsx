import React from 'react';
import {
  Phone,
  ShieldCheck,
  Award,
  Clock,
  PlusCircle,
  FolderClock,
  Printer,
  Download,
  Eye,
  Edit3
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
  voucherNumber = ''
}) => {
  return (
    <header className="no-print bg-[#003D2F] border-b border-[#004B38] sticky top-0 z-40 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand identity with Authentic Vector Logo */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <DestinLogo variant="dark" className="h-7 sm:h-8 w-auto" />
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#D8EB29]/15 text-[#D8EB29] border border-[#D8EB29]/30">
                OFFICIAL VOUCHER
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase">
                DESTIN PRIVATE LIMITED
              </span>
              <span className="text-emerald-700 text-xs">•</span>
              <span className="text-[10px] font-semibold text-emerald-300/80">
                PREMIUM DESTINATION CABS
              </span>
            </div>
          </div>
        </div>

        {/* Corporate Trust Badges & Direct Line */}
        <div className="hidden xl:flex items-center gap-4 text-xs text-emerald-200/90 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span className="text-[11px] font-semibold">SAFE</span>
          </div>
          <span className="text-emerald-700">•</span>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span className="text-[11px] font-semibold">COMFORTABLE</span>
          </div>
          <span className="text-emerald-700">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span className="text-[11px] font-semibold">ON TIME</span>
          </div>
          <div className="h-5 w-px bg-[#004B38] mx-1"></div>
          <a
            href="tel:+919526886600"
            className="flex items-center gap-1.5 bg-[#004B38]/80 hover:bg-[#004B38] text-[#D8EB29] px-2.5 py-1 rounded-lg border border-[#D8EB29]/20 font-semibold text-xs transition-colors"
          >
            <Phone className="w-3 h-3 text-[#D8EB29]" />
            <span>+91 95268 86600</span>
          </a>
        </div>

        {/* Actions & View Modes */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          
          {/* Mode Switcher: Form vs Preview */}
          <div className="flex items-center bg-[#002B21] p-0.5 rounded-lg border border-[#004B38]">
            <button
              type="button"
              onClick={() => onToggleView('form')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeView === 'form'
                  ? 'bg-[#004B38] text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#D8EB29]" />
              <span>Form Editor</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleView('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeView === 'preview'
                  ? 'bg-[#004B38] text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#D8EB29]" />
              <span>Live Preview</span>
            </button>
          </div>

          {/* New Voucher */}
          <button
            type="button"
            onClick={onNewVoucher}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004B38] hover:bg-[#075943] text-emerald-100 text-xs font-semibold border border-emerald-700/60 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span>New</span>
          </button>

          {/* Saved Vouchers Drawer Button */}
          <button
            type="button"
            onClick={onOpenSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004B38] hover:bg-[#075943] text-emerald-100 text-xs font-semibold border border-emerald-700/60 transition-colors"
          >
            <FolderClock className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-[#D8EB29] text-[#003D2F] font-bold text-[10px] rounded-full">
                {savedCount}
              </span>
            )}
          </button>

          {/* Print Action */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004B38] hover:bg-[#075943] text-emerald-100 text-xs font-semibold border border-emerald-700/60 transition-colors"
            title="Print Voucher (Ctrl+P)"
          >
            <Printer className="w-3.5 h-3.5 text-[#D8EB29]" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Download PDF Action */}
          <button
            type="button"
            onClick={onDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D8EB29] hover:bg-[#C6D922] text-[#003D2F] text-xs font-black shadow-md shadow-black/20 transition-transform active:scale-95"
            title="Download Official A4 PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
