import React, { useState, useEffect } from 'react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-[#0b281d] border border-emerald-800/80 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-800/70 bg-[#072117] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-lime-400/20 text-lime-400 border border-lime-400/30">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Saved Trip Vouchers
              </h3>
              <p className="text-xs text-emerald-300">
                Search, view, print, or load previously generated vouchers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
              title="Refresh list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-emerald-400 hover:text-white rounded-lg hover:bg-emerald-900/50 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-[#0a261c] border-b border-emerald-900/60 grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Keyword Search */}
          <div className="relative sm:col-span-8">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Voucher #, Customer Name, Vehicle #, Phone..."
              className="w-full bg-[#061e15] border border-emerald-700/60 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-emerald-500/70 focus:outline-none focus:border-lime-400 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="relative sm:col-span-4">
            <Calendar className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-[#061e15] border border-emerald-700/60 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-lime-400 transition-colors"
            />
            {dateFilter && (
              <button
                onClick={() => onDateChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-lime-400 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {isLoading ? (
            <div className="py-16 text-center">
              <RefreshCw className="w-8 h-8 text-lime-400 animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-emerald-300">Loading saved vouchers...</p>
            </div>
          ) : vouchers.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-emerald-800/60 rounded-2xl p-6 bg-[#072016]/40">
              <FileCheck className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h4 className="text-base font-semibold text-white mb-1">No vouchers found</h4>
              <p className="text-xs text-emerald-400 max-w-sm mx-auto">
                {searchTerm || dateFilter
                  ? 'No trip vouchers match your search criteria. Try clearing the filters.'
                  : 'No vouchers saved in the database yet. Fill out the form and click "Save Voucher".'}
              </p>
            </div>
          ) : (
            vouchers.map((voucher) => (
              <div
                key={voucher._id || voucher.voucherNumber}
                className="bg-[#092218] border border-emerald-800/60 hover:border-lime-400/50 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-black/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Left info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-lime-400/20 text-lime-300 border border-lime-400/40 font-mono font-bold text-xs">
                      {voucher.voucherNumber}
                    </span>
                    <span className="text-xs text-emerald-300 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-lime-400" />
                      {formatDateDisplay(voucher.date)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-200 border border-emerald-800 font-semibold flex items-center gap-1">
                      <Car className="w-3 h-3 text-emerald-400" />
                      {voucher.vehicleNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-1">
                    <div>
                      <p className="text-xs text-emerald-400">Customer</p>
                      <p className="text-sm font-semibold text-white">
                        {voucher.customerName}
                        {voucher.customerPhone && (
                          <span className="text-xs font-normal text-emerald-300 ml-1.5">
                            ({voucher.customerPhone})
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-emerald-400">Driver</p>
                      <p className="text-sm font-medium text-emerald-100">
                        {voucher.driverName}
                        {voucher.driverPhone && (
                          <span className="text-xs text-emerald-400 ml-1.5">
                            ({voucher.driverPhone})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200 pt-1">
                    <div className="flex items-center gap-1 text-emerald-300">
                      <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                      <span className="font-semibold text-white">{voucher.startingLocation}</span>
                      <ArrowRight className="w-3 h-3 text-emerald-400" />
                      <span className="font-semibold text-white">{voucher.destination}</span>
                    </div>
                    <span className="text-emerald-700 hidden sm:inline">•</span>
                    <div>
                      Total KM: <span className="font-semibold text-lime-300">{voucher.totalKM} km</span>
                    </div>
                    <span className="text-emerald-700 hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-lime-400" />
                      <span>{voucher.totalHours || `${voucher.fromTime} - ${voucher.toTime}`}</span>
                    </div>
                  </div>
                </div>

                {/* Right financial & action buttons */}
                <div className="flex flex-row lg:flex-col items-end justify-between w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-emerald-900 gap-3">
                  <div className="text-left lg:text-right">
                    <p className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                      Total: <span className="text-white font-bold">{formatCurrency(voucher.totalAmount)}</span>
                    </p>
                    <p className="text-xs font-bold text-lime-400">
                      Balance: {formatCurrency(voucher.balance)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectVoucher(voucher)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      title="Edit this voucher"
                    >
                      <Edit className="w-3.5 h-3.5 text-lime-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onPrintVoucher(voucher)}
                      className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
                      title="Print voucher"
                    >
                      <Printer className="w-3.5 h-3.5 text-lime-400" />
                    </button>

                    <button
                      onClick={() => onDownloadVoucherPDF(voucher)}
                      className="p-1.5 rounded-lg bg-lime-400/20 hover:bg-lime-400/30 text-lime-300 border border-lime-400/30 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {deleteConfirmId === voucher._id ? (
                      <div className="flex items-center gap-1 bg-rose-950 p-1 rounded-lg border border-rose-800">
                        <span className="text-[10px] text-rose-200 font-bold px-1">Confirm?</span>
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
                          className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] rounded"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(voucher._id)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
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
        <div className="p-3 bg-[#072117] border-t border-emerald-900 text-xs text-emerald-400/80 flex items-center justify-between">
          <span>Showing {vouchers.length} vouchers</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default SavedVouchersModal;
