import React, { useRef, useState } from 'react';
import {
  Car,
  User,
  Phone,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  Award,
  Hash,
  AlertCircle,
  Save,
  Printer,
  Download,
  RotateCcw,
  CheckCircle2,
  Navigation,
  FileText
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
  isEditing = false,
  isSaving = false,
  voucherCardRef
}) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-3 sm:px-6">
      
      {/* Edit Mode Notification Banner */}
      {isEditing && (
        <div className="no-print mb-4 p-3.5 bg-lime-400 text-emerald-950 rounded-xl font-semibold flex items-center justify-between shadow-lg shadow-lime-950/20 border border-lime-300">
          <div className="flex items-center gap-2 text-sm">
            <span className="p-1 rounded-md bg-emerald-950 text-lime-400">
              <FileText className="w-4 h-4" />
            </span>
            <span>
              Currently editing Voucher: <strong className="font-mono underline">{formData.voucherNumber}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="text-xs bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-1 px-3 rounded-lg transition-colors"
          >
            Cancel Edit & Create New
          </button>
        </div>
      )}

      {/* Main Printable Trip Voucher Container */}
      <div
        ref={voucherCardRef}
        className="voucher-container bg-white rounded-2xl shadow-2xl border-2 border-emerald-800/80 overflow-hidden text-emerald-950 print:border print:shadow-none print:rounded-none"
      >
        {/* ============================================================== */}
        {/* HEADER SECTION                                                */}
        {/* ============================================================== */}
        <div className="bg-[#08291e] text-white p-5 sm:p-6 border-b-4 border-lime-400 print-exact">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-lime-400 text-emerald-950 font-black text-2xl flex items-center justify-center shadow-md">
                DC
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
                  DESTIN<span className="text-lime-400">.</span>CABS
                </h1>
                <p className="text-[11px] font-bold tracking-widest text-lime-300 uppercase">
                  PREMIUM DESTINATION CABS
                </p>
                <div className="flex items-center gap-3 text-[10px] text-emerald-200 mt-1 font-semibold tracking-wider">
                  <span>SAFE</span>
                  <span>•</span>
                  <span>COMFORTABLE</span>
                  <span>•</span>
                  <span>ON TIME</span>
                </div>
              </div>
            </div>

            {/* Voucher Title & Contact */}
            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <div className="inline-block bg-lime-400 text-emerald-950 px-4 py-1 rounded-lg font-black text-lg sm:text-xl tracking-wider uppercase shadow">
                TRIP VOUCHER
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-lime-300 font-semibold">
                <Phone className="w-3.5 h-3.5 text-lime-400" />
                <span>+91 95268 86600</span>
              </div>
              <p className="text-[10px] text-emerald-300 mt-0.5">
                Official Passenger & Travel Receipt
              </p>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* METADATA STRIP: Voucher No, Date, Vehicle, Driver             */}
        {/* ============================================================== */}
        <div className="bg-[#f0fdf4] border-b border-emerald-200 p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            
            {/* Voucher Number */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1 mb-1">
                <Hash className="w-3.5 h-3.5 text-emerald-700" />
                Voucher No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.voucherNumber || ''}
                onChange={(e) => handleChange('voucherNumber', e.target.value.toUpperCase())}
                placeholder="e.g. DC-2026-0001"
                className={`w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.voucherNumber
                    ? 'border-rose-500 ring-1 ring-rose-500 text-rose-900'
                    : 'border-emerald-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 text-emerald-950'
                }`}
              />
              {errors.voucherNumber && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.voucherNumber}</span>
              )}
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date ? formatDateInput(formData.date) : formatDateInput()}
                onChange={(e) => handleChange('date', e.target.value)}
                className={`w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.date
                    ? 'border-rose-500 ring-1 ring-rose-500 text-rose-900'
                    : 'border-emerald-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 text-emerald-950'
                }`}
              />
              {errors.date && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.date}</span>
              )}
            </div>

            {/* Vehicle Number */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1 mb-1">
                <Car className="w-3.5 h-3.5 text-emerald-700" />
                Vehicle No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.vehicleNumber || ''}
                onChange={(e) => handleChange('vehicleNumber', e.target.value.toUpperCase())}
                placeholder="e.g. KL 07 CD 1234"
                className={`w-full px-3 py-2 text-xs sm:text-sm font-mono font-bold uppercase rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.vehicleNumber
                    ? 'border-rose-500 ring-1 ring-rose-500 text-rose-900'
                    : 'border-emerald-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 text-emerald-950'
                }`}
              />
              {errors.vehicleNumber && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.vehicleNumber}</span>
              )}
            </div>

            {/* Driver Name */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-emerald-700" />
                Driver Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.driverName || ''}
                onChange={(e) => handleChange('driverName', e.target.value)}
                placeholder="Driver's Full Name"
                className={`w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border bg-white focus:outline-none transition-colors ${
                  errors.driverName
                    ? 'border-rose-500 ring-1 ring-rose-500 text-rose-900'
                    : 'border-emerald-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 text-emerald-950'
                }`}
              />
              {errors.driverName && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.driverName}</span>
              )}
            </div>

            {/* Driver Phone */}
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
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
                    ? 'border-rose-500 ring-1 ring-rose-500 text-rose-900'
                    : 'border-emerald-300 focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 text-emerald-950'
                }`}
              />
              {errors.driverPhone && (
                <span className="text-[10px] text-rose-600 font-semibold mt-0.5">{errors.driverPhone}</span>
              )}
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* TWO-COLUMN CORE BODY: Customer Details & Trip Route           */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-emerald-100">
          
          {/* Section B: CUSTOMER DETAILS */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-[#fbfdfb]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 font-display">
                Customer Details
              </h2>
            </div>

            <div className="space-y-3">
              {/* Customer Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName || ''}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                  placeholder="Enter passenger/client name"
                  className={`w-full px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.customerName
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-emerald-300 focus:border-emerald-700'
                  }`}
                />
                {errors.customerName && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.customerName}</span>
                )}
              </div>

              {/* Customer Phone */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
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
                      : 'border-emerald-300 focus:border-emerald-700'
                  }`}
                />
                {errors.customerPhone && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.customerPhone}</span>
                )}
              </div>

              {/* Customer Address */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Customer Address / Company
                </label>
                <textarea
                  rows={3}
                  value={formData.customerAddress || ''}
                  onChange={(e) => handleChange('customerAddress', e.target.value)}
                  placeholder="Billing address, hotel, or residence details..."
                  className="w-full px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-emerald-300 focus:border-emerald-700 bg-white focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section C: TRIP DETAILS / ROUTE & KILOMETERS */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-[#fbfdfb]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 font-display">
                Trip Details / Route
              </h2>
            </div>

            <div className="space-y-3">
              {/* Starting Location */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Starting Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.startingLocation || ''}
                    onChange={(e) => handleChange('startingLocation', e.target.value)}
                    placeholder="e.g. Cochin Airport (COK)"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                      errors.startingLocation
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-emerald-300 focus:border-emerald-700'
                    }`}
                  />
                </div>
                {errors.startingLocation && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.startingLocation}</span>
                )}
              </div>

              {/* Destination */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Destination <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.destination || ''}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    placeholder="e.g. Munnar Hill Station"
                    className={`w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                      errors.destination
                        ? 'border-rose-500 ring-1 ring-rose-500'
                        : 'border-emerald-300 focus:border-emerald-700'
                    }`}
                  />
                </div>
                {errors.destination && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.destination}</span>
                )}
              </div>

              {/* Starting KM, Closing KM, and Auto-calculated Total KM */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
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
                        : 'border-emerald-300 focus:border-emerald-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
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
                        : 'border-emerald-300 focus:border-emerald-700'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                    Total KM
                  </label>
                  <div className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-black rounded-lg border border-emerald-400 bg-emerald-100/70 text-emerald-950 flex items-center justify-center">
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
        {/* SECTION D: TIME OF ENGAGEMENT & SECTION E: TAXI CHARGES        */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-emerald-100">
          
          {/* Section D: TIME OF ENGAGEMENT */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-[#fbfdfb]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 font-display">
                Time of Engagement
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  From Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.fromTime || ''}
                  onChange={(e) => handleChange('fromTime', e.target.value)}
                  className={`w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.fromTime
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-emerald-300 focus:border-emerald-700'
                  }`}
                />
                {errors.fromTime && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.fromTime}</span>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  To Time <span className="text-rose-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.toTime || ''}
                  onChange={(e) => handleChange('toTime', e.target.value)}
                  className={`w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border bg-white focus:outline-none transition-colors ${
                    errors.toTime
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-emerald-300 focus:border-emerald-700'
                  }`}
                />
                {errors.toTime && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.toTime}</span>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Total Duration
                </label>
                <div className="w-full px-2.5 py-2 text-xs font-bold rounded-lg border border-emerald-400 bg-emerald-100/70 text-emerald-950 flex items-center justify-center text-center">
                  {formData.totalHours || '0 hr'}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-emerald-700 mt-2 italic">
              * Supports journeys extending past midnight
            </p>
          </div>

          {/* Section E: TAXI CHARGES */}
          <div className="border border-emerald-200 rounded-xl p-4 bg-[#fbfdfb]">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-900 font-display">
                Taxi Charges
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Taxi Charges */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
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
                      : 'border-emerald-300 focus:border-emerald-700'
                  }`}
                />
                {errors.taxiCharges && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.taxiCharges}</span>
                )}
              </div>

              {/* Toll / Parking */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Toll / Parking (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.tollParking !== undefined ? formData.tollParking : ''}
                  onChange={(e) => handleChange('tollParking', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border border-emerald-300 focus:border-emerald-700 bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* Night Bata */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block mb-1">
                  Night Bata (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={formData.nightBata !== undefined ? formData.nightBata : ''}
                  onChange={(e) => handleChange('nightBata', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 text-xs sm:text-sm font-mono font-medium rounded-lg border border-emerald-300 focus:border-emerald-700 bg-white focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* SECTION F: TOTAL AND PAYMENT DETAILS (HIGHLIGHTED)             */}
        {/* ============================================================== */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#0a3123] to-emerald-900 text-white p-5 sm:p-6 border-b border-emerald-950 print-exact">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
            
            {/* Grand Total */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20 text-center sm:text-left">
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

            {/* Advance Amount (Editable) */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">
                  Advance Paid (₹)
                </span>
                <span className="text-[10px] text-lime-300 font-semibold">Editable</span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                value={formData.advance !== undefined ? formData.advance : ''}
                onChange={(e) => handleChange('advance', e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-1.5 text-base sm:text-lg font-mono font-bold text-white bg-black/30 border border-emerald-400/50 rounded-lg focus:outline-none focus:border-lime-400 transition-colors"
              />
              {errors.advance && (
                <span className="text-[10px] text-rose-300 font-semibold">{errors.advance}</span>
              )}
            </div>

            {/* Balance Due (Highlighted in Lime) */}
            <div className="bg-lime-400 text-emerald-950 rounded-xl p-3.5 border-2 border-lime-300 text-center sm:text-right shadow-lg shadow-lime-950/20">
              <span className="text-[10px] uppercase font-black tracking-widest text-emerald-950 block">
                Net Balance Due
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono mt-0.5 tracking-tight">
                {formatCurrency(formData.balance !== undefined ? formData.balance : (formData.totalAmount || 0))}
              </div>
              <span className="text-[10px] font-bold text-emerald-900">
                Payable on Trip Completion
              </span>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION G: SIGNATURES                                          */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-6 bg-[#fbfdfb]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Guest Signature */}
            <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
              <SignaturePad
                label="Guest Signature"
                value={formData.guestSignature}
                onChange={(sig) => handleChange('guestSignature', sig)}
              />
            </div>

            {/* Driver Signature */}
            <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm">
              <SignaturePad
                label="Driver Signature"
                value={formData.driverSignature}
                onChange={(sig) => handleChange('driverSignature', sig)}
              />
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* FOOTER STRIP                                                   */}
        {/* ============================================================== */}
        <div className="bg-[#09271d] text-emerald-200 px-5 py-3.5 border-t border-emerald-800 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 print-exact">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-white">
              DESTIN CABS • +91 95268 86600
            </p>
            <p className="text-[9px] text-emerald-400">
              Thank you for traveling with us! Safe journeys always.
            </p>
          </div>
          <div className="text-[10px] font-semibold text-lime-300">
            SAFE • COMFORTABLE • ON TIME
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* FORM ACTION TOOLBAR (Non-Printable)                           */}
      {/* ============================================================== */}
      <div className="no-print mt-6 bg-[#0a271c] border border-emerald-800/80 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-emerald-300 font-medium">
          {isEditing ? (
            <span>Updating voucher: <strong className="text-lime-300 font-mono">{formData.voucherNumber}</strong></span>
          ) : (
            <span>Ready to generate client voucher</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onReset}
            className="px-3.5 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700 transition-all flex items-center gap-1.5"
            title="Reset form"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="px-3.5 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold border border-emerald-700 transition-all flex items-center gap-1.5 hover:text-white"
            title="Print Voucher"
          >
            <Printer className="w-3.5 h-3.5 text-lime-400" />
            <span>Print Voucher</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPDF}
            className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold border border-emerald-600 transition-all flex items-center gap-1.5"
            title="Export high-res PDF"
          >
            <Download className="w-3.5 h-3.5 text-lime-400" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs font-black shadow-lg shadow-lime-950/30 transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : isEditing ? 'Update Voucher' : 'Save Trip Voucher'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default TripVoucherForm;
