import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import TripVoucherForm from './components/TripVoucherForm';
import VoucherPreview from './components/VoucherPreview';
import SavedVouchersModal from './components/SavedVouchersModal';
import AlertNotification from './components/AlertNotification';
import {
  fetchNextVoucherNumber,
  createVoucher,
  updateVoucher,
  getVouchers,
  deleteVoucher
} from './services/api';
import {
  calculateTotalKM,
  calculateTotalAmount,
  calculateBalance,
  calculateDuration,
  isValidIndianPhone
} from './utils/calculations';
import { formatDateInput } from './utils/formatters';
import { generateVoucherPDF, printVoucher } from './utils/pdfGenerator';
import DestinLogo from './components/DestinLogo';
import { Loader2, Download, AlertCircle, RefreshCw } from 'lucide-react';
import TripVoucherPrint from './components/TripVoucherPrint';

const initialFormState = {
  voucherNumber: '',
  date: formatDateInput(),
  vehicleNumber: '',
  driverName: '',
  driverPhone: '',
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  startingLocation: '',
  destination: '',
  startingKM: '',
  closingKM: '',
  totalKM: 0,
  fromTime: '08:00',
  toTime: '17:00',
  totalHours: '9 hrs',
  taxiCharges: '',
  tollParking: '',
  nightBata: '',
  totalAmount: 0,
  advance: '',
  balance: 0,
  guestSignature: '',
  driverSignature: ''
};

function App() {
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeView, setActiveView] = useState('form'); // 'form' | 'preview'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [apiConnectionError, setApiConnectionError] = useState(null);
  const [printVoucherData, setPrintVoucherData] = useState(null);

  // Saved vouchers drawer state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedVouchers, setSavedVouchers] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const printablePreviewRef = useRef(null);

  // Show notification toast
  const notify = (type, title, message) => {
    setNotification({ type, title, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 6000);
  };

  // Initialize new sequential voucher number from MongoDB
  const loadNextVoucherNumber = useCallback(async () => {
    try {
      setApiConnectionError(null);
      const nextNumber = await fetchNextVoucherNumber();
      setFormData((prev) => ({
        ...prev,
        voucherNumber: nextNumber,
        date: formatDateInput()
      }));
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('[Destin Cabs API Error] Could not load next voucher number:', err);
      setApiConnectionError(err.message || 'Could not connect to Destin Cabs server');
      setFormData((prev) => ({
        ...prev,
        voucherNumber: prev.voucherNumber || 'DC-OFFLINE-DRAFT',
        date: formatDateInput()
      }));
      notify('error', 'API Connection Failure', err.message || 'Backend server is not responding. Check VITE_API_URL or wait if Render is waking up.');
    }
  }, []);

  // Fetch list of saved vouchers
  const loadSavedVouchers = useCallback(async (search = searchTerm, date = dateFilter) => {
    setIsLoadingSaved(true);
    try {
      const res = await getVouchers({ search, date });
      setSavedVouchers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSaved(false);
    }
  }, [searchTerm, dateFilter]);

  // Initial mount
  useEffect(() => {
    loadNextVoucherNumber();
    loadSavedVouchers();
  }, [loadNextVoucherNumber, loadSavedVouchers]);

  // Refresh saved vouchers when modal opens or filter changes
  useEffect(() => {
    if (isSavedModalOpen) {
      loadSavedVouchers(searchTerm, dateFilter);
    }
  }, [isSavedModalOpen, searchTerm, dateFilter, loadSavedVouchers]);

  // Handle field change with safe real-time dependent calculations
  const handleFieldChange = (field, value) => {
    setHasUnsavedChanges(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Clear field specific error
      if (errors[field]) {
        setErrors((prevErr) => {
          const newErr = { ...prevErr };
          delete newErr[field];
          return newErr;
        });
      }

      // KM calculation
      if (field === 'startingKM' || field === 'closingKM') {
        const start = field === 'startingKM' ? value : updated.startingKM;
        const close = field === 'closingKM' ? value : updated.closingKM;
        if (start !== '' && close !== '') {
          if (Number(close) >= Number(start)) {
            updated.totalKM = calculateTotalKM(start, close);
          } else {
            updated.totalKM = 0;
          }
        } else {
          updated.totalKM = 0;
        }
      }

      // Time duration calculation
      if (field === 'fromTime' || field === 'toTime') {
        const from = field === 'fromTime' ? value : updated.fromTime;
        const to = field === 'toTime' ? value : updated.toTime;
        if (from && to) {
          const duration = calculateDuration(from, to);
          updated.totalHours = duration.formatted || '0 hr';
        }
      }

      // Taxi charges calculation
      if (field === 'taxiCharges' || field === 'tollParking' || field === 'nightBata') {
        const taxi = field === 'taxiCharges' ? value : updated.taxiCharges;
        const toll = field === 'tollParking' ? value : updated.tollParking;
        const bata = field === 'nightBata' ? value : updated.nightBata;
        const total = calculateTotalAmount(taxi, toll, bata);
        updated.totalAmount = total;
        updated.balance = calculateBalance(total, updated.advance || 0);
      }

      // Advance and Balance calculation
      if (field === 'advance') {
        updated.balance = calculateBalance(updated.totalAmount, value || 0);
      }

      return updated;
    });
  };

  // Client-side form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.voucherNumber || !formData.voucherNumber.trim()) {
      newErrors.voucherNumber = 'Voucher number is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.vehicleNumber || !formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }
    if (!formData.driverName || !formData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }
    if (!formData.driverPhone || !formData.driverPhone.trim()) {
      newErrors.driverPhone = 'Driver phone is required';
    } else if (!isValidIndianPhone(formData.driverPhone)) {
      newErrors.driverPhone = 'Invalid Indian mobile number (10 digits)';
    }

    if (!formData.customerName || !formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.customerPhone || !formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Customer phone is required';
    } else if (!isValidIndianPhone(formData.customerPhone)) {
      newErrors.customerPhone = 'Invalid Indian mobile number (10 digits)';
    }

    if (!formData.startingLocation || !formData.startingLocation.trim()) {
      newErrors.startingLocation = 'Starting location is required';
    }
    if (!formData.destination || !formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.startingKM === '' || formData.startingKM === null || formData.startingKM === undefined) {
      newErrors.startingKM = 'Starting KM is required';
    } else if (Number(formData.startingKM) < 0) {
      newErrors.startingKM = 'Starting KM cannot be negative';
    }

    if (formData.closingKM === '' || formData.closingKM === null || formData.closingKM === undefined) {
      newErrors.closingKM = 'Closing KM is required';
    } else if (Number(formData.closingKM) < 0) {
      newErrors.closingKM = 'Closing KM cannot be negative';
    } else if (Number(formData.closingKM) < Number(formData.startingKM)) {
      newErrors.closingKM = 'Closing KM cannot be less than Starting KM';
    }

    if (!formData.fromTime) {
      newErrors.fromTime = 'From time is required';
    }
    if (!formData.toTime) {
      newErrors.toTime = 'To time is required';
    }

    if (formData.taxiCharges === '' || formData.taxiCharges === null || formData.taxiCharges === undefined) {
      newErrors.taxiCharges = 'Taxi charges are required';
    } else if (Number(formData.taxiCharges) < 0) {
      newErrors.taxiCharges = 'Taxi charges cannot be negative';
    }

    if (formData.tollParking !== '' && Number(formData.tollParking) < 0) {
      newErrors.tollParking = 'Toll / Parking cannot be negative';
    }
    if (formData.nightBata !== '' && Number(formData.nightBata) < 0) {
      newErrors.nightBata = 'Night Bata cannot be negative';
    }
    if (formData.advance !== '' && Number(formData.advance) < 0) {
      newErrors.advance = 'Advance cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save / Update Voucher
  const handleSaveVoucher = async () => {
    if (!validateForm()) {
      notify('error', 'Validation Check', 'Please fill in all required fields marked with * before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        startingKM: Number(formData.startingKM),
        closingKM: Number(formData.closingKM),
        taxiCharges: Number(formData.taxiCharges),
        tollParking: Number(formData.tollParking) || 0,
        nightBata: Number(formData.nightBata) || 0,
        advance: Number(formData.advance) || 0
      };

      if (editingId) {
        const updated = await updateVoucher(editingId, payload);
        notify('success', 'Voucher Updated', `Trip Voucher ${payload.voucherNumber} successfully updated.`);
        setFormData(updated.data);
      } else {
        const created = await createVoucher(payload);
        notify('success', 'Voucher Saved', `Trip Voucher ${payload.voucherNumber} created and saved in MongoDB.`);
        setFormData(created.data);
        setEditingId(created.data._id);
      }

      setHasUnsavedChanges(false);
      setApiConnectionError(null);
      loadSavedVouchers();
    } catch (err) {
      console.error('[Destin Cabs Save Error]', err);
      if (err.isNetworkError) {
        notify('error', 'Network Connection Error', 'Could not reach server. The backend may be offline or sleeping on Render.');
      } else if (err.status === 404) {
        notify('error', 'API 404 Error', err.message || 'API endpoint not found. Verify VITE_API_URL in Vercel.');
      } else if (err.status === 409) {
        notify('error', 'Duplicate Number', err.message);
      } else {
        notify('error', 'MongoDB Save Error', err.message || 'Could not save voucher to MongoDB.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form to create a new voucher
  const handleResetForm = async () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes on this voucher. Discard and create new?');
      if (!confirmDiscard) return;
    }
    setEditingId(null);
    setErrors({});
    let nextNum = '';
    try {
      nextNum = await fetchNextVoucherNumber();
      setApiConnectionError(null);
    } catch (err) {
      nextNum = 'DC-OFFLINE-DRAFT';
      setApiConnectionError(err.message);
      notify('error', 'Connection Notice', 'Could not retrieve voucher number from server. Backend may be offline.');
    }
    setFormData({
      ...initialFormState,
      voucherNumber: nextNum,
      date: formatDateInput()
    });
    setHasUnsavedChanges(false);
    setActiveView('form');
    notify('info', 'New Voucher Form Ready', 'Form initialized.');
  };

  // Select voucher from saved list to edit
  const handleSelectVoucherToEdit = (voucher) => {
    setEditingId(voucher._id);
    setFormData({
      ...voucher,
      date: formatDateInput(voucher.date),
      startingKM: voucher.startingKM !== undefined ? voucher.startingKM : '',
      closingKM: voucher.closingKM !== undefined ? voucher.closingKM : '',
      taxiCharges: voucher.taxiCharges !== undefined ? voucher.taxiCharges : '',
      tollParking: voucher.tollParking !== undefined ? voucher.tollParking : '',
      nightBata: voucher.nightBata !== undefined ? voucher.nightBata : '',
      advance: voucher.advance !== undefined ? voucher.advance : ''
    });
    setErrors({});
    setHasUnsavedChanges(false);
    setIsSavedModalOpen(false);
    setActiveView('form');
    notify('info', 'Voucher Loaded', `Voucher ${voucher.voucherNumber} loaded for editing.`);
  };

  // Delete voucher
  const handleDeleteVoucher = async (id) => {
    try {
      await deleteVoucher(id);
      notify('success', 'Voucher Deleted', 'The voucher was permanently removed.');
      loadSavedVouchers();
      if (editingId === id) {
        handleResetForm();
      }
    } catch (err) {
      notify('error', 'Delete Failed', err.message || 'Failed to delete voucher');
    }
  };

  // Print voucher using the dedicated TripVoucherPrint component
  const handlePrint = (voucherData = null) => {
    const targetVoucher = voucherData || formData;
    setPrintVoucherData(targetVoucher);
    // Allow state to flush before opening native print dialog
    setTimeout(() => {
      window.print();
    }, 80);
  };

  // Download high-resolution PDF
  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return;

    // Use dedicated offscreen preview, or fallback to any mounted voucher preview in DOM
    const targetElement =
      printablePreviewRef.current || document.querySelector('.voucher-container');

    if (!targetElement) {
      notify('error', 'PDF Error', 'Voucher document preview is not ready for export.');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      notify('info', 'Rendering PDF', 'Generating high-resolution official A4 trip voucher...');
      const voucherNum = formData.voucherNumber || 'DRAFT';
      await generateVoucherPDF(targetElement, voucherNum);
      notify('success', 'PDF Ready', `Voucher ${voucherNum} exported successfully.`);
    } catch (err) {
      console.error('[App PDF Download Error]', err);
      notify('error', 'PDF Error', err.message || 'Failed to generate PDF document');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F5] text-[#102B24] flex flex-col font-sans">
      
      {/* Top Corporate Header */}
      <Header
        onNewVoucher={handleResetForm}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedVouchers.length}
        onPrint={() => handlePrint(formData)}
        onDownloadPDF={handleDownloadPDF}
        activeView={activeView}
        onToggleView={setActiveView}
        isEditing={Boolean(editingId)}
        voucherNumber={formData.voucherNumber}
        isGeneratingPDF={isGeneratingPDF}
      />

      {/* Offline / Server Wake-up Notice Banner */}
      {apiConnectionError && (
        <div className="no-print bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Server Connection Notice:</strong> {apiConnectionError}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              loadNextVoucherNumber();
              loadSavedVouchers();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-200 hover:bg-amber-300 rounded font-bold text-amber-950 transition-colors shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Main Working View */}
      <main className="flex-1 pb-12">
        {activeView === 'form' ? (
          <div className="no-print">
            <TripVoucherForm
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
              onSave={handleSaveVoucher}
              onPrint={handlePrint}
              onDownloadPDF={handleDownloadPDF}
              onReset={handleResetForm}
              onPreview={() => setActiveView('preview')}
              isEditing={Boolean(editingId)}
              isSaving={isSaving}
              hasUnsavedChanges={hasUnsavedChanges}
              isGeneratingPDF={isGeneratingPDF}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto my-6 px-3 sm:px-6">
            <div className="no-print mb-4 flex items-center justify-between bg-white p-3.5 rounded-xl border border-[#DCE7E0] shadow-sm">
              <span className="text-xs font-semibold text-[#003D2F]">
                Viewing Live Official Voucher Document: <strong>{formData.voucherNumber}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveView('form')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#102B24] transition-colors"
                >
                  Back to Form
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#DCE7E0] hover:bg-slate-50 text-xs font-semibold text-[#003D2F] transition-colors"
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-3 py-1.5 rounded-lg bg-[#D8EB29] hover:bg-[#C6D922] text-xs font-black text-[#003D2F] transition-colors flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#003D2F]" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF'}</span>
                </button>
              </div>
            </div>

            <VoucherPreview formData={formData} />
          </div>
        )}

        {/* Dedicated Off-Screen A4 Container for High-Res PDF capture & Native Print */}
        <div
          className="fixed -left-[9999px] top-0 print:static print:left-auto"
          style={{
            width: '800px',
            minWidth: '800px',
            maxWidth: '800px',
            visibility: 'visible',
            pointerEvents: 'none',
            zIndex: -9999
          }}
          aria-hidden="true"
        >
          <VoucherPreview formData={formData} previewRef={printablePreviewRef} />
        </div>
      </main>

      {/* Minimal Professional Page Footer */}
      <footer className="no-print bg-white border-t border-[#DCE7E0] py-6 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <DestinLogo variant="light" className="h-5 w-auto" />
            <div className="text-xs">
              <span className="font-bold text-[#003D2F]">DESTIN CABS</span>
              <span className="text-[#718078] mx-1.5">•</span>
              <span className="font-semibold text-[#102B24]">DESTIN PRIVATE LIMITED</span>
            </div>
          </div>

          <p className="text-[11px] text-[#718078] max-w-xl leading-relaxed">
            Suite No.1067, 2nd, Kc Arcade, 24/1701, near TV Centre, P.O, CSEZ, Kakkanad, Kochi, Keralam 682037
          </p>

          <div className="text-[11px] text-[#718078] font-medium shrink-0">
            Helpline: <a href="tel:+919526886600" className="text-[#003D2F] font-bold hover:underline">+91 95268 86600</a>
          </div>
        </div>
      </footer>

      {/* Saved Vouchers Modal Drawer */}
      <SavedVouchersModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onSelectVoucher={handleSelectVoucherToEdit}
        onPrintVoucher={(voucher) => {
          handlePrint(voucher);
        }}
        onDownloadVoucherPDF={(voucher) => {
          handleSelectVoucherToEdit(voucher);
          setTimeout(() => handleDownloadPDF(), 400);
        }}
        onDeleteVoucher={handleDeleteVoucher}
        vouchers={savedVouchers}
        isLoading={isLoadingSaved}
        onRefresh={() => loadSavedVouchers(searchTerm, dateFilter)}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
      />

      {/* Floating Alert Notification Toast */}
      <AlertNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />

      {/* Dedicated Print-Only Voucher Document (Hidden on screen, exclusively visible during browser print) */}
      <div className="trip-voucher-print-wrapper" aria-hidden="true">
        <TripVoucherPrint voucher={printVoucherData || formData} />
      </div>

    </div>
  );
}

export default App;
