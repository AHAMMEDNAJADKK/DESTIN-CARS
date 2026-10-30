import React, { useState } from 'react';
import {
  Search,
  Calendar,
  X,
  Edit,
  Trash2,
  Printer,
  Download,
  Car,
  MapPin,
  Clock,
  ArrowRight,
  RefreshCw,
  FileCheck
} from 'lucide-react';
import DestinLogo from './DestinLogo';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

const SavedVouchersModal = ({
  isOpen,
  onClose,
  onSelectVoucher,
  onPrintVoucher,
  onDownloadVoucherPDF,
  onDeleteVoucher,
  vouchers = [],
  isLoading = false,
  onRefresh,
  onSearchChange,
  searchTerm = '',
  dateFilter = '',
  onDateChange
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-white border border-[#DCE7E0] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#004B38] bg-[#003D2F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20">
              <DestinLogo variant="dark" className="h-6 w-auto" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Saved Trip Vouchers
              </h3>
              <p className="text-xs text-emerald-200">
                DESTIN PRIVATE LIMITED • Search, view, print, or load vouchers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-emerald-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-emerald-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-[#F5F8F5] border-b border-[#DCE7E0] grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="relative sm:col-span-8">
            <Search className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Voucher #, Customer Name, Vehicle #, Driver Phone..."
              className="w-full bg-white border border-[#DCE7E0] rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-[#102B24] placeholder-[#718078] focus:outline-none focus:border-[#003D2F] focus:ring-1 focus:ring-[#003D2F] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#718078] hover:text-[#102B24]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="relative sm:col-span-4">
            <Calendar className="w-4 h-4 text-[#718078] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-white border border-[#DCE7E0] rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-[#102B24] focus:outline-none focus:border-[#003D2F] transition-colors"
            />
            {dateFilter && (
              <button
                onClick={() => onDateChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#003D2F] hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#F5F8F5]/40">
          {isLoading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-[#003D2F] animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-[#718078]">Loading saved vouchers...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-[#DCE7E0] rounded-2xl p-6 bg-white">
              <FileCheck className="w-12 h-12 text-[#718078]/50 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-[#102B24] mb-1">No vouchers found</h4>
              <p className="text-xs text-[#718078] max-w-sm mx-auto">
                {searchTerm || dateFilter
                  ? 'No records match your search filter. Try clearing or broadening search keywords.'
                  : 'No saved vouchers found in database. Create one using the voucher form.'}
              </p>
            </div>
          ) : (
            vouchers.map((voucher) => (
              <div
                key={voucher._id || voucher.voucherNumber}
                className="bg-white border border-[#DCE7E0] hover:border-[#003D2F] rounded-xl p-4 transition-all hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#003D2F]/10 text-[#003D2F] border border-[#003D2F]/20 font-mono font-bold text-xs">
                      {voucher.voucherNumber}
                    </span>
                    <span className="text-xs text-[#718078] flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#003D2F]" />
                      {formatDateDisplay(voucher.date)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-[#102B24] border border-[#DCE7E0] font-semibold flex items-center gap-1">
                      <Car className="w-3 h-3 text-[#003D2F]" />
                      {voucher.vehicleNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1">
                    <div>
                      <p className="text-[11px] text-[#718078]">Customer</p>
                      <p className="text-sm font-semibold text-[#102B24]">
                        {voucher.customerName}
                        {voucher.customerPhone && (
                          <span className="text-xs font-normal text-[#718078] ml-1.5">
                            ({voucher.customerPhone})
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#718078]">Driver</p>
                      <p className="text-sm font-medium text-[#102B24]">
                        {voucher.driverName}
                        {voucher.driverPhone && (
                          <span className="text-xs text-[#718078] ml-1.5">
                            ({voucher.driverPhone})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#718078] pt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#003D2F] shrink-0" />
                      <span className="font-semibold text-[#102B24]">{voucher.startingLocation}</span>
                      <ArrowRight className="w-3 h-3 text-[#718078]" />
                      <span className="font-semibold text-[#102B24]">{voucher.destination}</span>
                    </div>
                    <span>•</span>
                    <div>
                      Total KM: <span className="font-bold text-[#003D2F]">{voucher.totalKM} km</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#003D2F]" />
                      <span>{voucher.totalHours || `${voucher.fromTime} - ${voucher.toTime}`}</span>
                    </div>
                  </div>
                </div>

                {/* Right financial & action buttons */}
                <div className="flex flex-row lg:flex-col items-end justify-between w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-[#DCE7E0] gap-3">
                  <div className="text-left lg:text-right">
                    <p className="text-[11px] uppercase tracking-wider text-[#718078] font-semibold">
                      Total: <span className="text-[#102B24] font-bold">{formatCurrency(voucher.totalAmount)}</span>
                    </p>
                    <p className="text-xs font-bold text-[#003D2F]">
                      Balance Due: {formatCurrency(voucher.balance)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectVoucher(voucher)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#003D2F] hover:bg-[#004B38] text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Edit this voucher"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#D8EB29]" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onPrintVoucher(voucher)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#003D2F] transition-colors border border-[#DCE7E0]"
                      title="Print voucher"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDownloadVoucherPDF(voucher)}
                      className="p-1.5 rounded-lg bg-[#D8EB29]/20 hover:bg-[#D8EB29]/40 text-[#003D2F] border border-[#D8EB29]/40 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {deleteConfirmId === voucher._id ? (
                      <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-300">
                        <span className="text-[10px] text-rose-800 font-bold px-1">Confirm?</span>
                        <button
                          onClick={() => {
                            onDeleteVoucher(voucher._id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-1.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 bg-slate-400 hover:bg-slate-500 text-white text-[10px] rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(voucher._id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete voucher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#F5F8F5] border-t border-[#DCE7E0] text-xs text-[#718078] flex items-center justify-between">
          <span>Showing {vouchers.length} records</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-[#DCE7E0] hover:bg-slate-50 text-[#102B24] font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SavedVouchersModal;
