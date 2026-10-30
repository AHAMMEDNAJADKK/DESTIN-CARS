import React from 'react';
import {
  Car,
  User,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Hash
} from 'lucide-react';
import DestinLogo from './DestinLogo';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';

const VoucherPreview = ({ formData, previewRef }) => {
  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4">
      <div
        ref={previewRef}
        className="voucher-container bg-white w-full max-w-4xl shadow-xl rounded-xl border border-[#DCE7E0] overflow-hidden text-[#102B24] print:shadow-none print:border-2 print:border-[#003D2F] print:rounded-none"
      >
        {/* ============================================================== */}
        {/* HEADER: Official Logo, Legal Company Name & Contact           */}
        {/* ============================================================== */}
        <div className="bg-[#003D2F] text-white p-6 border-b-4 border-[#D8EB29] print-exact">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            {/* Authentic Brand Asset & Legal Details */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                <DestinLogo variant="dark" className="h-8 sm:h-9 w-auto" />
              </div>
              <div>
                <div className="text-[11px] font-extrabold tracking-widest text-[#D8EB29] uppercase">
                  DESTIN PRIVATE LIMITED
                </div>
                <div className="text-xs font-semibold text-emerald-200 tracking-wider uppercase mt-0.5">
                  PREMIUM DESTINATION CABS
                </div>
                <div className="flex items-center gap-3 text-[10px] text-emerald-300 mt-1 font-semibold tracking-wider">
                  <span>SAFE</span>
                  <span>•</span>
                  <span>COMFORTABLE</span>
                  <span>•</span>
                  <span>ON TIME</span>
                </div>
              </div>
            </div>

            {/* Document Title & Contact */}
            <div className="text-left sm:text-right flex flex-col sm:items-end">
              <div className="inline-block bg-[#D8EB29] text-[#003D2F] px-4 py-1 rounded font-black text-base sm:text-lg tracking-wider uppercase shadow-sm">
                TRIP VOUCHER
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#D8EB29] font-bold">
                <Phone className="w-3.5 h-3.5 text-[#D8EB29]" />
                <span>+91 95268 86600</span>
              </div>
              <p className="text-[10px] text-emerald-300/90 mt-0.5 font-medium">
                Official Passenger & Travel Receipt
              </p>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* METADATA STRIP: Voucher No, Date, Vehicle, Driver             */}
        {/* ============================================================== */}
        <div className="bg-[#F5F8F5] border-b border-[#DCE7E0] p-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Voucher Number */}
            <div className="bg-white p-2.5 rounded-lg border border-[#DCE7E0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block">
                Voucher Number
              </span>
              <span className="text-sm font-mono font-bold text-[#003D2F] block mt-0.5">
                {formData.voucherNumber || '—'}
              </span>
            </div>

            {/* Date */}
            <div className="bg-white p-2.5 rounded-lg border border-[#DCE7E0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block">
                Trip Date
              </span>
              <span className="text-sm font-medium text-[#102B24] block mt-0.5">
                {formatDateDisplay(formData.date) || '—'}
              </span>
            </div>

            {/* Vehicle Number */}
            <div className="bg-white p-2.5 rounded-lg border border-[#DCE7E0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block">
                Vehicle Number
              </span>
              <span className="text-sm font-mono font-bold uppercase text-[#003D2F] block mt-0.5">
                {formData.vehicleNumber || '—'}
              </span>
            </div>

            {/* Driver Name & Phone */}
            <div className="bg-white p-2.5 rounded-lg border border-[#DCE7E0]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#718078] block">
                Driver Details
              </span>
              <span className="text-sm font-semibold text-[#102B24] block mt-0.5 truncate">
                {formData.driverName || '—'}
              </span>
              {formData.driverPhone && (
                <span className="text-[11px] font-mono text-[#718078] block">
                  {formData.driverPhone}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* TWO-COLUMN DETAILS: Customer & Route                          */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#DCE7E0]">
          
          {/* Customer Details */}
          <div className="border border-[#DCE7E0] rounded-xl p-4 bg-[#F5F8F5]/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DCE7E0]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
                  Customer Details
                </h3>
                <span className="text-[10px] text-[#718078] font-medium">Passenger Information</span>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#718078] block">Passenger Name</span>
                  <p className="text-sm font-bold text-[#102B24]">{formData.customerName || '—'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#718078] block">Contact Number</span>
                  <p className="text-xs font-mono font-medium text-[#102B24]">{formData.customerPhone || '—'}</p>
                </div>

                <div>
                  <span className="text-[10px] font-semibold uppercase text-[#718078] block">Billing / Address</span>
                  <p className="text-xs text-[#102B24] whitespace-pre-wrap leading-relaxed">
                    {formData.customerAddress || 'Direct Passenger Dispatch'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details & Route */}
          <div className="border border-[#DCE7E0] rounded-xl p-4 bg-[#F5F8F5]/50 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DCE7E0]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
                  Trip Details & Route
                </h3>
                <span className="text-[10px] text-[#718078] font-medium">Travel Log</span>
              </div>

              {/* Origin to Destination */}
              <div className="bg-white p-3 rounded-lg border border-[#DCE7E0] mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#102B24]">
                  <MapPin className="w-3.5 h-3.5 text-[#003D2F] shrink-0" />
                  <span className="truncate">{formData.startingLocation || 'Origin'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#718078] shrink-0" />
                  <span className="truncate">{formData.destination || 'Destination'}</span>
                </div>
              </div>

              {/* Kilometer Breakdown */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded-lg border border-[#DCE7E0]">
                  <span className="text-[10px] font-bold text-[#718078] uppercase block">Start KM</span>
                  <span className="text-xs font-mono font-bold text-[#102B24] block mt-0.5">
                    {formData.startingKM !== '' && formData.startingKM !== undefined ? formData.startingKM : '—'}
                  </span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-[#DCE7E0]">
                  <span className="text-[10px] font-bold text-[#718078] uppercase block">Closing KM</span>
                  <span className="text-xs font-mono font-bold text-[#102B24] block mt-0.5">
                    {formData.closingKM !== '' && formData.closingKM !== undefined ? formData.closingKM : '—'}
                  </span>
                </div>

                <div className="bg-[#003D2F] text-white p-2 rounded-lg print-exact">
                  <span className="text-[10px] font-bold text-[#D8EB29] uppercase block">Total KM</span>
                  <span className="text-xs font-mono font-black text-white block mt-0.5">
                    {formData.totalKM || 0} km
                  </span>
                </div>
              </div>

              {/* Engagement Time */}
              <div className="mt-3 pt-2 border-t border-[#DCE7E0] flex items-center justify-between text-xs">
                <span className="text-[#718078] text-[11px] font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#003D2F]" />
                  Duration: {formData.fromTime || '00:00'} to {formData.toTime || '00:00'}
                </span>
                <span className="font-bold text-[#003D2F] bg-white px-2 py-0.5 rounded border border-[#DCE7E0]">
                  {formData.totalHours || '0 hr'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* CHARGES & FINANCIAL SUMMARY                                    */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 border-b border-[#DCE7E0]">
          <div className="border border-[#DCE7E0] rounded-xl overflow-hidden bg-white">
            <div className="bg-[#F5F8F5] px-4 py-2 border-b border-[#DCE7E0] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#003D2F]">
                Itemized Charges & Fare Summary
              </span>
              <span className="text-[10px] text-[#718078] font-semibold">All amounts in INR (₹)</span>
            </div>

            <div className="divide-y divide-[#DCE7E0] text-xs">
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[#718078]">Base Taxi / Hiring Charges</span>
                <span className="font-mono font-semibold text-[#102B24]">
                  {formatCurrency(formData.taxiCharges || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[#718078]">Toll Gate & Parking Charges</span>
                <span className="font-mono font-medium text-[#102B24]">
                  {formatCurrency(formData.tollParking || 0)}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-[#718078]">Driver Night Bata / Allowance</span>
                <span className="font-mono font-medium text-[#102B24]">
                  {formatCurrency(formData.nightBata || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* High-Contrast Corporate Total Box */}
          <div className="mt-4 bg-[#003D2F] text-white rounded-xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center print-exact">
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 block">
                Total Amount
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-white block mt-0.5">
                {formatCurrency(formData.totalAmount || 0)}
              </span>
            </div>

            <div className="text-center sm:text-left sm:border-l sm:border-[#004B38] sm:pl-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200 block">
                Advance Paid
              </span>
              <span className="text-lg sm:text-xl font-mono font-bold text-emerald-100 block mt-0.5">
                {formatCurrency(formData.advance || 0)}
              </span>
            </div>

            <div className="bg-[#D8EB29] text-[#003D2F] p-3 rounded-lg text-center sm:text-right shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest block">
                Net Balance Due
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-black tracking-tight block mt-0.5">
                {formatCurrency(formData.balance !== undefined ? formData.balance : formData.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SIGNATURES SECTION                                             */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 bg-[#F5F8F5]/60">
          <div className="grid grid-cols-2 gap-6">
            
            {/* Guest Signature */}
            <div className="bg-white border border-[#DCE7E0] rounded-xl p-3 text-center">
              <div className="h-20 flex items-center justify-center">
                {formData.guestSignature ? (
                  <img
                    src={formData.guestSignature}
                    alt="Guest Signature"
                    className="max-h-full max-w-full object-contain mx-auto"
                  />
                ) : (
                  <div className="text-[11px] text-[#718078] italic">Authorized Guest Signature</div>
                )}
              </div>
              <div className="border-t border-[#DCE7E0] pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#003D2F] block">
                  Guest Signature
                </span>
              </div>
            </div>

            {/* Driver Signature */}
            <div className="bg-white border border-[#DCE7E0] rounded-xl p-3 text-center">
              <div className="h-20 flex items-center justify-center">
                {formData.driverSignature ? (
                  <img
                    src={formData.driverSignature}
                    alt="Driver Signature"
                    className="max-h-full max-w-full object-contain mx-auto"
                  />
                ) : (
                  <div className="text-[11px] text-[#718078] italic">Driver Signature</div>
                )}
              </div>
              <div className="border-t border-[#DCE7E0] pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#003D2F] block">
                  Driver Signature
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================== */}
        {/* CORPORATE FOOTER                                               */}
        {/* ============================================================== */}
        <div className="bg-[#002B21] text-emerald-200 px-6 py-4 border-t border-[#003D2F] flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2 print-exact">
          <div>
            <div className="text-[11px] font-bold text-white tracking-wide">
              DESTIN CABS • A Division of DESTIN PRIVATE LIMITED
            </div>
            <div className="text-[9px] text-emerald-400 mt-0.5">
              Direct Contact: +91 95268 86600 • Premium Destination Mobility
            </div>
          </div>
          <div className="text-[10px] font-bold text-[#D8EB29] tracking-wider uppercase">
            SAFE • COMFORTABLE • ON TIME
          </div>
        </div>

      </div>
    </div>
  );
};

export default VoucherPreview;
