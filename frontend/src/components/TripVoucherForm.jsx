import React from 'react';
import {
  Car,
  User,
  Phone,
  Calendar,
  MapPin,
  Clock,
  Save,
  Printer,
  Download,
  RotateCcw,
  Navigation,
  FileText,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import SignaturePad from './SignaturePad';
import { formatCurrency, formatDateInput } from '../utils/formatters';

const TripVoucherForm = ({
  formData,
  errors = {},
  onChange,
  onSave,
  onPrint,
  onDownloadPDF,
  onReset,
  onPreview,
  isEditing = false,
  isSaving = false,
  hasUnsavedChanges = false
}) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-3 sm:px-6">
      
      {/* Editing or Unsaved Changes Notice Banner */}
      {isEditing && (
        <div className="no-print mb-4 p-3.5 bg-[#D8EB29] text-[#003D2F] rounded-xl font-semibold flex items-center justify-between shadow-md border border-[#C6D922]">
          <div className="flex items-center gap-2 text-sm">
            <span className="p-1 rounded-md bg-[#003D2F] text-[#D8EB29]">
              <FileText className="w-4 h-4" />
            </span>
            <span>
              Editing Saved Voucher: <strong className="font-mono underline">{formData.voucherNumber}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs bg-[#003D2F] hover:bg-[#002B21] text-white font-bold py-1 px-3 rounded-lg transition-colors"
          >
            Cancel & New Voucher
          </button>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#DCE7E0] overflow-hidden text-[#102B24]">
        
        {/* Form Title Strip */}
        <div className="bg-[#003D2F] text-white p-5 sm:p-6 border-b border-[#004B38] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D8EB29]">
                DESTIN PRIVATE LIMITED
              </span>
              <span className="text-emerald-500">•</span>
              <span className="text-xs text-emerald-200">Trip Dispatch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
              Trip Voucher Creation
            </h2>
            <p className="text-xs text-emerald-200/80 mt-1">
              Fill in client journey and billing details. All calculations update in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#004B38] hover:bg-[#075943] text-[#D8EB29] text-xs font-bold border border-[#D8EB29]/30 transition-all hover:scale-105"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Voucher</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION A: VOUCHER & DRIVER DETAILS                           */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 bg-[#F5F8F5]/60 border-b border-[#DCE7E0]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#003D2F]"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
              Section A — Voucher & Vehicle Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Voucher Number */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                Voucher No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.voucherNumber || ''}
                onChange={(e) => handleChange('voucherNumber', e.target.value.toUpperCase())}
                placeholder="e.g. DC-2026-0001"
                className={`w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.voucherNumber
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-[#DCE7E0] focus:border-[#003D2F] focus:ring-1 focus:ring-[#003D2F]'
                }`}
              />
              {errors.voucherNumber && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.voucherNumber}</span>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date ? formatDateInput(formData.date) : formatDateInput()}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.date
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-[#DCE7E0] focus:border-[#003D2F] focus:ring-1 focus:ring-[#003D2F]'
                }`}
              />
              {errors.date && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.date}</span>
              )}
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                Vehicle No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vehicleNumber || ''}
                onChange={(e) => handleChange('vehicleNumber', e.target.value.toUpperCase())}
                placeholder="KL 07 CD 1234"
                className={`w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold uppercase rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.vehicleNumber
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-[#DCE7E0] focus:border-[#003D2F] focus:ring-1 focus:ring-[#003D2F]'
                }`}
              />
              {errors.vehicleNumber && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.vehicleNumber}</span>
              )}
            </div>

            {/* Driver Name */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                Driver Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.driverName || ''}
                onChange={(e) => handleChange('driverName', e.target.value)}
                placeholder="Driver full name"
                className={`w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.driverName
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-[#DCE7E0] focus:border-[#003D2F] focus:ring-1 focus:ring-[#003D2F]'
                }`}
              />
              {errors.driverName && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.driverName}</span>
              )}
            </div>

            {/* Driver Phone */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                Driver Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.driverPhone || ''}
                onChange={(e) => handleChange('driverPhone', e.target.value)}
                placeholder="10-digit mobile"
                maxLength={13}
                className={`w-full px-3 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.driverPhone
                    ? 'border-rose-500 ring-1 ring-rose-500'
                    : 'border-[#DCE7E0] focus:border-[#003D2F] focus:ring-1 focus:ring-[#003D2F]'
                }`}
              />
              {errors.driverPhone && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.driverPhone}</span>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION B: CUSTOMER & SECTION C: TRIP DETAILS                 */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#DCE7E0]">
          
          {/* SECTION B: CUSTOMER DETAILS */}
          <div className="border border-[#DCE7E0] rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#DCE7E0]">
              <span className="w-2 h-2 rounded-full bg-[#003D2F]"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
                Section B — Customer Details
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName || ''}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  placeholder="Passenger or Corporate Client"
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.customerName
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-[#DCE7E0] focus:border-[#003D2F]'
                  }`}
                />
                {errors.customerName && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.customerName}</span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Customer Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.customerPhone || ''}
                  onChange={(e) => handleChange('customerPhone', e.target.value)}
                  placeholder="10-digit mobile number"
                  maxLength={13}
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.customerPhone
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-[#DCE7E0] focus:border-[#003D2F]'
                  }`}
                />
                {errors.customerPhone && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.customerPhone}</span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Customer Address / Company Details
                </label>
                <textarea
                  rows={3}
                  value={formData.customerAddress || ''}
                  onChange={(e) => handleChange('customerAddress', e.target.value)}
                  placeholder="Billing address, room number, hotel or residence..."
                  className="w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-[#DCE7E0] focus:border-[#003D2F] bg-white focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION C: TRIP DETAILS / ROUTE */}
          <div className="border border-[#DCE7E0] rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#DCE7E0]">
              <span className="w-2 h-2 rounded-full bg-[#003D2F]"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
                Section C — Trip Details / Route
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Starting Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#003D2F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.startingLocation || ''}
                    onChange={(e) => handleChange('startingLocation', e.target.value)}
                    placeholder="e.g. Cochin Airport (COK)"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                      errors.startingLocation
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-[#DCE7E0] focus:border-[#003D2F]'
                    }`}
                  />
                </div>
                {errors.startingLocation && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.startingLocation}</span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Destination <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Navigation className="w-3.5 h-3.5 text-[#003D2F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.destination || ''}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    placeholder="e.g. Munnar Hill Resort"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                      errors.destination
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-[#DCE7E0] focus:border-[#003D2F]'
                    }`}
                  />
                </div>
                {errors.destination && (
                  <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{errors.destination}</span>
                )}
              </div>

              {/* Starting KM, Closing KM & Total KM */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                    Start KM <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.startingKM !== undefined ? formData.startingKM : ''}
                    onChange={(e) => handleChange('startingKM', e.target.value)}
                    placeholder="0"
                    className={`w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border bg-white focus:outline-none transition-colors ${
                      errors.startingKM
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-[#DCE7E0] focus:border-[#003D2F]'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                    Closing KM <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.closingKM !== undefined ? formData.closingKM : ''}
                    onChange={(e) => handleChange('closingKM', e.target.value)}
                    placeholder="0"
                    className={`w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border bg-white focus:outline-none transition-colors ${
                      errors.closingKM
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-[#DCE7E0] focus:border-[#003D2F]'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                    Total KM
                  </label>
                  <div className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-black rounded-lg border border-[#003D2F] bg-[#003D2F]/5 text-[#003D2F] flex items-center justify-center">
                    {formData.totalKM || 0} km
                  </div>
                </div>
              </div>

              {errors.closingKM && (
                <span className="text-[10px] text-rose-600 font-semibold block">{errors.closingKM}</span>
              )}
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* SECTION D: TIME & SECTION E: TAXI CHARGES                     */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#DCE7E0]">
          
          {/* SECTION D: TIME OF ENGAGEMENT */}
          <div className="border border-[#DCE7E0] rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#DCE7E0]">
              <span className="w-2 h-2 rounded-full bg-[#003D2F]"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
                Section D — Time of Engagement
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  From Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.fromTime || ''}
                  onChange={(e) => handleChange('fromTime', e.target.value)}
                  className={`w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.fromTime
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-[#DCE7E0] focus:border-[#003D2F]'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  To Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.toTime || ''}
                  onChange={(e) => handleChange('toTime', e.target.value)}
                  className={`w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.toTime
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-[#DCE7E0] focus:border-[#003D2F]'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Duration
                </label>
                <div className="w-full px-2.5 py-2 text-xs font-bold rounded-lg border border-[#003D2F] bg-[#003D2F]/5 text-[#003D2F] flex items-center justify-center text-center">
                  {formData.totalHours || '0 hr'}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[#718078] mt-2 italic">
              * Supports overnight journeys crossing midnight
            </p>
          </div>

          {/* SECTION E: TAXI CHARGES */}
          <div className="border border-[#DCE7E0] rounded-xl p-4 bg-white">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#DCE7E0]">
              <span className="w-2 h-2 rounded-full bg-[#003D2F]"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
                Section E — Taxi Charges
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Taxi Charges (₹) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.taxiCharges !== undefined ? formData.taxiCharges : ''}
                  onChange={(e) => handleChange('taxiCharges', e.target.value)}
                  placeholder="0.00"
                  className={`w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.taxiCharges
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-[#DCE7E0] focus:border-[#003D2F]'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Toll / Parking (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.tollParking !== undefined ? formData.tollParking : ''}
                  onChange={(e) => handleChange('tollParking', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border border-[#DCE7E0] focus:border-[#003D2F] bg-white focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block mb-1">
                  Night Bata (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.nightBata !== undefined ? formData.nightBata : ''}
                  onChange={(e) => handleChange('nightBata', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border border-[#DCE7E0] focus:border-[#003D2F] bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* SECTION F: PAYMENT SUMMARY (HIGHLIGHTED CORPORATE STRIP)       */}
        {/* ============================================================== */}
        <div className="bg-[#003D2F] text-white p-5 sm:p-6 border-b border-[#004B38]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
            
            {/* Total */}
            <div className="bg-white/10 rounded-xl p-3.5 border border-white/20 text-center sm:text-left">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
                Total Charges
              </span>
              <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
                {formatCurrency(formData.totalAmount || 0)}
              </div>
              <span className="text-[10px] text-emerald-300/80">
                Taxi + Toll + Night Bata
              </span>
            </div>

            {/* Advance */}
            <div className="bg-white/10 rounded-xl p-3.5 border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                  Advance Paid (₹)
                </span>
                <span className="text-[10px] text-[#D8EB29] font-bold">Editable</span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.advance !== undefined ? formData.advance : ''}
                onChange={(e) => handleChange('advance', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-1.5 text-base sm:text-lg font-mono font-bold text-white bg-black/30 border border-emerald-400/50 rounded-lg focus:outline-none focus:border-[#D8EB29] transition-colors"
              />
            </div>

            {/* Balance */}
            <div className="bg-[#D8EB29] text-[#003D2F] rounded-xl p-3.5 border border-[#C6D922] text-center sm:text-right shadow-md">
              <span className="text-[10px] uppercase font-black tracking-widest block">
                Net Balance Due
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5 tracking-tight">
                {formatCurrency(formData.balance !== undefined ? formData.balance : formData.totalAmount || 0)}
              </div>
              <span className="text-[10px] font-bold text-[#003D2F]/80">
                Payable on completion
              </span>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION G: SIGNATURES                                          */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 bg-[#F5F8F5]/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="bg-white border border-[#DCE7E0] rounded-xl p-4 shadow-sm">
              <SignaturePad
                label="Guest Signature"
                value={formData.guestSignature}
                onChange={(sig) => handleChange('guestSignature', sig)}
              />
            </div>

            <div className="bg-white border border-[#DCE7E0] rounded-xl p-4 shadow-sm">
              <SignaturePad
                label="Driver Signature"
                value={formData.driverSignature}
                onChange={(sig) => handleChange('driverSignature', sig)}
              />
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* ACTION TOOLBAR                                                 */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 bg-[#F5F8F5] border-t border-[#DCE7E0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#718078] font-medium">
            {isEditing ? (
              <span>Updating record: <strong className="text-[#003D2F] font-mono">{formData.voucherNumber}</strong></span>
            ) : (
              <span>New corporate voucher draft</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onReset}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#718078] hover:text-[#102B24] text-xs font-semibold border border-[#DCE7E0] transition-colors flex items-center gap-1.5"
              title="Reset form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={onPreview}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#003D2F] text-xs font-bold border border-[#DCE7E0] transition-colors flex items-center gap-1.5 shadow-sm"
              title="View formatted voucher"
            >
              <Eye className="w-3.5 h-3.5 text-[#003D2F]" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={onPrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#003D2F] text-xs font-bold border border-[#DCE7E0] transition-colors flex items-center gap-1.5 shadow-sm"
              title="Print voucher"
            >
              <Printer className="w-3.5 h-3.5 text-[#003D2F]" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onDownloadPDF}
              className="px-3.5 py-2 rounded-xl bg-[#004B38] hover:bg-[#003D2F] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#D8EB29]" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#D8EB29] hover:bg-[#C6D922] text-[#003D2F] text-xs font-black shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : isEditing ? 'Update Voucher' : 'Save Voucher'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TripVoucherForm;
