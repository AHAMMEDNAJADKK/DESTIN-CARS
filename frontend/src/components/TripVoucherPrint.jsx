import React from 'react';
import DestinLogo from './DestinLogo';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import './TripVoucherPrint.css';

/**
 * Dedicated Print Component for Destin Cabs Trip Voucher
 * Renders ONLY during browser printing (window.print()) on standard A4 portrait.
 * 
 * @param {Object} props
 * @param {Object} props.voucher - The voucher data object to print
 */
const TripVoucherPrint = ({ voucher = {} }) => {
  // Safe default accessors
  const voucherNumber = voucher.voucherNumber || '—';
  const tripDate = formatDateDisplay(voucher.date) || '—';
  const vehicleNumber = voucher.vehicleNumber || '—';
  const driverName = voucher.driverName || '—';
  const driverPhone = voucher.driverPhone || '—';
  const customerName = voucher.customerName || '—';
  const customerPhone = voucher.customerPhone || '—';
  const customerAddress = voucher.customerAddress || '—';
  const startingLocation = voucher.startingLocation || '—';
  const destination = voucher.destination || '—';
  const startingKM = voucher.startingKM !== undefined && voucher.startingKM !== '' ? voucher.startingKM : '—';
  const closingKM = voucher.closingKM !== undefined && voucher.closingKM !== '' ? voucher.closingKM : '—';
  const totalKM = voucher.totalKM !== undefined && voucher.totalKM !== '' ? `${voucher.totalKM} km` : '—';
  const fromTime = voucher.fromTime || '—';
  const toTime = voucher.toTime || '—';
  const totalHours = voucher.totalHours || '—';
  const taxiCharges = Number(voucher.taxiCharges) || 0;
  const tollParking = Number(voucher.tollParking) || 0;
  const nightBata = Number(voucher.nightBata) || 0;
  const totalAmount = Number(voucher.totalAmount) || (taxiCharges + tollParking + nightBata);
  const advance = Number(voucher.advance) || 0;
  const balance = voucher.balance !== undefined ? Number(voucher.balance) : (totalAmount - advance);

  const hasGuestSig = Boolean(voucher && voucher.guestSignature && typeof voucher.guestSignature === 'string' && voucher.guestSignature.length > 20);
  const hasDriverSig = Boolean(voucher && voucher.driverSignature && typeof voucher.driverSignature === 'string' && voucher.driverSignature.length > 20);

  return (
    <div className="tv-print-doc">
      
      {/* ============================================================== */}
      {/* 1. CORPORATE HEADER: Official Logo, Legal Name & Contact       */}
      {/* ============================================================== */}
      <div className="tv-print-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo & Legal Entity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '6px', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <DestinLogo variant="dark" style={{ height: '34px', width: 'auto', display: 'block' }} />
            </div>
            <div>
              <div style={{ fontSize: '11pt', fontWeight: 900, color: '#D8EB29', letterSpacing: '1px', textTransform: 'uppercase' }}>
                DESTIN PRIVATE LIMITED
              </div>
              <div style={{ fontSize: '8pt', fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: '2px' }}>
                DESTIN CABS • PREMIUM DESTINATION MOBILITY
              </div>
              <div style={{ fontSize: '7.5pt', color: '#D1FAE5', marginTop: '3px', maxWidth: '380px', lineHeight: 1.25 }}>
                Suite No.1067, 2nd, Kc Arcade, 24/1701, near TV Centre, P.O, CSEZ, Kakkanad, Kochi, Keralam 682037
              </div>
            </div>
          </div>

          {/* Document Title & Contact */}
          <div style={{ textAlign: 'right', shrink: 0 }}>
            <div style={{ display: 'inline-block', backgroundColor: '#D8EB29', color: '#003D2F', padding: '4px 12px', borderRadius: '4px', fontWeight: 900, fontSize: '12pt', letterSpacing: '1px', textTransform: 'uppercase' }}>
              TRIP VOUCHER
            </div>
            <div style={{ fontSize: '9pt', fontWeight: 800, color: '#D8EB29', marginTop: '5px' }}>
              📞 +91 95268 86600
            </div>
            <div style={{ fontSize: '7pt', color: '#A7F3D0', fontWeight: 600, letterSpacing: '0.8px', marginTop: '2px' }}>
              SAFE • COMFORTABLE • ON TIME
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. METADATA STRIP: Voucher No, Trip Date, Vehicle Number       */}
      {/* ============================================================== */}
      <table className="tv-print-table" style={{ borderTop: 'none' }}>
        <tbody>
          <tr>
            <th style={{ width: '33.33%' }}>Voucher Number</th>
            <th style={{ width: '33.33%' }}>Trip Date</th>
            <th style={{ width: '33.34%' }}>Vehicle Number</th>
          </tr>
          <tr>
            <td style={{ fontSize: '11pt', fontWeight: 800, color: '#003D2F', fontFamily: 'Arial, Helvetica, sans-serif' }}>
              {voucherNumber}
            </td>
            <td style={{ fontSize: '10pt', fontWeight: 600 }}>
              {tripDate}
            </td>
            <td style={{ fontSize: '10pt', fontWeight: 800, color: '#003D2F', textTransform: 'uppercase' }}>
              {vehicleNumber}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ============================================================== */}
      {/* 3. CUSTOMER & DRIVER DETAILS (2-Column Grid)                  */}
      {/* ============================================================== */}
      <table className="tv-print-table" style={{ borderTop: 'none' }}>
        <tbody>
          <tr>
            <th style={{ width: '50%' }}>Guest / Customer Details</th>
            <th style={{ width: '50%' }}>Driver Information</th>
          </tr>
          <tr>
            <td style={{ verticalAlign: 'top', height: '62px' }}>
              <div style={{ fontSize: '9.5pt', fontWeight: 800, color: '#003D2F' }}>
                {customerName}
              </div>
              <div style={{ fontSize: '8.5pt', color: '#4B5563', marginTop: '2px' }}>
                <strong>Contact:</strong> {customerPhone}
              </div>
              <div style={{ fontSize: '8pt', color: '#6B7280', marginTop: '2px', lineHeight: 1.25 }}>
                <strong>Address:</strong> {customerAddress}
              </div>
            </td>
            <td style={{ verticalAlign: 'top', height: '62px' }}>
              <div style={{ fontSize: '9.5pt', fontWeight: 800, color: '#003D2F' }}>
                {driverName}
              </div>
              <div style={{ fontSize: '8.5pt', color: '#4B5563', marginTop: '2px' }}>
                <strong>Mobile:</strong> {driverPhone}
              </div>
              <div style={{ fontSize: '7.5pt', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                ✓ Verified Authorized Destin Mobility Pilot
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ============================================================== */}
      {/* 4. TRIP ROUTE, KILOMETER LOG & TIME DURATION                  */}
      {/* ============================================================== */}
      <table className="tv-print-table" style={{ borderTop: 'none' }}>
        <tbody>
          <tr>
            <th colSpan="3" style={{ width: '50%' }}>Journey Route</th>
            <th colSpan="3" style={{ width: '50%' }}>Time & Duration Log</th>
          </tr>
          <tr>
            <td colSpan="3">
              <div style={{ fontSize: '8.5pt', color: '#374151' }}>
                <strong>From:</strong> {startingLocation}
              </div>
              <div style={{ fontSize: '8.5pt', color: '#374151', marginTop: '2px' }}>
                <strong>To:</strong> {destination}
              </div>
            </td>
            <td colSpan="3">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt' }}>
                <span><strong>Start:</strong> {fromTime}</span>
                <span><strong>End:</strong> {toTime}</span>
                <span><strong>Total:</strong> <strong style={{ color: '#003D2F' }}>{totalHours}</strong></span>
              </div>
            </td>
          </tr>
          <tr>
            <th style={{ width: '16.66%' }}>Starting KM</th>
            <th style={{ width: '16.66%' }}>Closing KM</th>
            <th style={{ width: '16.68%' }}>Total KM</th>
            <th style={{ width: '16.66%' }}>Starting Time</th>
            <th style={{ width: '16.66%' }}>Closing Time</th>
            <th style={{ width: '16.68%' }}>Trip Duration</th>
          </tr>
          <tr style={{ textAlign: 'center' }}>
            <td style={{ fontWeight: 600 }}>{startingKM}</td>
            <td style={{ fontWeight: 600 }}>{closingKM}</td>
            <td style={{ fontWeight: 800, color: '#003D2F', backgroundColor: '#F0FDF4' }}>{totalKM}</td>
            <td>{fromTime}</td>
            <td>{toTime}</td>
            <td style={{ fontWeight: 700, color: '#003D2F' }}>{totalHours}</td>
          </tr>
        </tbody>
      </table>

      {/* ============================================================== */}
      {/* 5. PAYMENT & CHARGES BREAKDOWN                                */}
      {/* ============================================================== */}
      <table className="tv-print-table" style={{ borderTop: 'none' }}>
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Charge Description</th>
            <th style={{ width: '20%', textAlign: 'right' }}>Rate / Type</th>
            <th style={{ width: '40%', textAlign: 'right' }}>Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Taxi Hire Charges (Base / Distance / Time)</td>
            <td style={{ textAlign: 'right', color: '#6B7280', fontSize: '8.5pt' }}>Tariff</td>
            <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'Arial, Helvetica, sans-serif' }}>
              {formatCurrency(taxiCharges)}
            </td>
          </tr>
          <tr>
            <td>Toll Gates & Parking Charges</td>
            <td style={{ textAlign: 'right', color: '#6B7280', fontSize: '8.5pt' }}>Actuals</td>
            <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'Arial, Helvetica, sans-serif' }}>
              {formatCurrency(tollParking)}
            </td>
          </tr>
          <tr>
            <td>Night Bata / Driver Allowance</td>
            <td style={{ textAlign: 'right', color: '#6B7280', fontSize: '8.5pt' }}>Allowance</td>
            <td style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'Arial, Helvetica, sans-serif' }}>
              {formatCurrency(nightBata)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Financial Summary Highlight Box */}
      <div style={{ backgroundColor: '#003D2F', color: '#ffffff', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #D8EB29', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <div>
          <div style={{ fontSize: '7.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#A7F3D0' }}>
            Total Charges
          </div>
          <div style={{ fontSize: '13pt', fontWeight: 900, fontFamily: 'Arial, Helvetica, sans-serif', color: '#ffffff', marginTop: '1px' }}>
            {formatCurrency(totalAmount)}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
          <div style={{ fontSize: '7.5pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#A7F3D0' }}>
            Advance Paid
          </div>
          <div style={{ fontSize: '11pt', fontWeight: 800, fontFamily: 'Arial, Helvetica, sans-serif', color: '#E0E7FF', marginTop: '1px' }}>
            {formatCurrency(advance)}
          </div>
        </div>

        <div style={{ backgroundColor: '#D8EB29', color: '#003D2F', padding: '6px 14px', borderRadius: '6px', textAlign: 'right', minWidth: '160px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
          <div style={{ fontSize: '7pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Net Balance Due
          </div>
          <div style={{ fontSize: '14pt', fontWeight: 900, fontFamily: 'Arial, Helvetica, sans-serif', marginTop: '1px' }}>
            {formatCurrency(balance)}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. SIGNATURES (Guest & Driver)                                */}
      {/* ============================================================== */}
      <table className="tv-print-table" style={{ borderTop: 'none' }}>
        <tbody>
          <tr>
            <th style={{ width: '50%', textAlign: 'center' }}>Authorized Guest Signature</th>
            <th style={{ width: '50%', textAlign: 'center' }}>Driver / Representative Signature</th>
          </tr>
          <tr>
            <td style={{ height: '70px', verticalAlign: 'bottom', textAlign: 'center', padding: '8px' }}>
              {hasGuestSig ? (
                <img
                  src={voucher.guestSignature}
                  alt="Guest Signature"
                  style={{ maxHeight: '52px', maxWidth: '180px', display: 'block', margin: '0 auto' }}
                />
              ) : (
                <div style={{ color: '#9CA3AF', fontSize: '8pt', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px dashed #9CA3AF', margin: '0 30px' }}>
                  (Physical Sign Above)
                </div>
              )}
              <div style={{ fontSize: '7.5pt', fontWeight: 700, color: '#003D2F', textTransform: 'uppercase', marginTop: '4px' }}>
                Customer Signature
              </div>
            </td>
            <td style={{ height: '70px', verticalAlign: 'bottom', textAlign: 'center', padding: '8px' }}>
              {hasDriverSig ? (
                <img
                  src={voucher.driverSignature}
                  alt="Driver Signature"
                  style={{ maxHeight: '52px', maxWidth: '180px', display: 'block', margin: '0 auto' }}
                />
              ) : (
                <div style={{ color: '#9CA3AF', fontSize: '8pt', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px dashed #9CA3AF', margin: '0 30px' }}>
                  (Physical Sign Above)
                </div>
              )}
              <div style={{ fontSize: '7.5pt', fontWeight: 700, color: '#003D2F', textTransform: 'uppercase', marginTop: '4px' }}>
                Driver Signature
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ============================================================== */}
      {/* 7. LEGAL FOOTER & REGISTERED BUSINESS DETAILS                  */}
      {/* ============================================================== */}
      <div style={{ backgroundColor: '#00261D', color: '#D1FAE5', padding: '8px 14px', fontSize: '7pt', lineHeight: 1.3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #003D2F', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
        <div>
          <strong>DESTIN CABS</strong> • A Division of <strong>DESTIN PRIVATE LIMITED</strong><br />
          <span>Registered Office: Suite No.1067, 2nd, Kc Arcade, 24/1701, near TV Centre, P.O, CSEZ, Kakkanad, Kochi, Keralam 682037</span>
        </div>
        <div style={{ textAlign: 'right', shrink: 0, fontWeight: 700, color: '#D8EB29' }}>
          OFFICIAL TRIP RECEIPT<br />
          <span>Helpline: +91 95268 86600</span>
        </div>
      </div>

    </div>
  );
};

export default TripVoucherPrint;
