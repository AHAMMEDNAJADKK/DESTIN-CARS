import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import TripVoucherForm from './components/TripVoucherForm';
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
  const [notification, setNotification] = useState(null);

  // Saved vouchers drawer state
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [savedVouchers, setSavedVouchers] = useState([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const voucherCardRef = useRef(null);

  // Show notification helper
  const notify = (type, title, message) => {
    setNotification({ type, title, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 6000);
  };

  // Initialize new voucher number on load
  const loadNextVoucherNumber = useCallback(async () => {
    try {
      const nextNumber = await fetchNextVoucherNumber();
      setFormData((prev) => ({
        ...prev,
        voucherNumber: nextNumber,
        date: formatDateInput()
      }));
    } catch (err) {
      console.error(err);
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

  // Initial load
  useEffect(() => {
    loadNextVoucherNumber();
    loadSavedVouchers();
  }, [loadNextVoucherNumber, loadSavedVouchers]);

  // Refresh saved vouchers when modal opens or filters change
  useEffect(() => {
    if (isSavedModalOpen) {
      loadSavedVouchers(searchTerm, dateFilter);
    }
  }, [isSavedModalOpen, searchTerm, dateFilter, loadSavedVouchers]);

  // Handle field change and run real-time dependent calculations
  const handleFieldChange = (field, value) => {
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
      notify('error', 'Validation Error', 'Please check the highlighted fields before saving.');
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
        // Update
        const updated = await updateVoucher(editingId, payload);
        notify('success', 'Voucher Updated', `Trip Voucher ${payload.voucherNumber} updated successfully.`);
        setFormData(updated.data);
      } else {
        // Create new
        const created = await createVoucher(payload);
        notify('success', 'Voucher Created', `Trip Voucher ${payload.voucherNumber} created and saved.`);
        setFormData(created.data);
        setEditingId(created.data._id);
      }

      loadSavedVouchers();
    } catch (err) {
      console.error(err);
      notify('error', 'Save Failed', err.message || 'Could not save voucher. Please check database connection.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form to blank / new voucher
  const handleResetForm = async () => {
    setEditingId(null);
    setErrors({});
    const nextNumber = await fetchNextVoucherNumber();
    setFormData({
      ...initialFormState,
      voucherNumber: nextNumber,
      date: formatDateInput()
    });
    notify('info', 'New Voucher Form Ready', 'Form reset with new sequential voucher number.');
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
    setIsSavedModalOpen(false);
    notify('info', 'Voucher Loaded', `Loaded voucher ${voucher.voucherNumber} into editor.`);
  };

  // Delete voucher
  const handleDeleteVoucher = async (id) => {
    try {
      await deleteVoucher(id);
      notify('success', 'Voucher Deleted', 'The voucher was deleted successfully.');
      loadSavedVouchers();
      if (editingId === id) {
        handleResetForm();
      }
    } catch (err) {
      notify('error', 'Delete Failed', err.message || 'Failed to delete voucher');
    }
  };

  // Print voucher
  const handlePrint = () => {
    printVoucher();
  };

  // Download high-resolution PDF
  const handleDownloadPDF = async () => {
    if (!voucherCardRef.current) return;
    try {
      notify('info', 'Generating PDF', 'Rendering high-resolution A4 voucher PDF...');
      await generateVoucherPDF(voucherCardRef.current, formData.voucherNumber);
      notify('success', 'PDF Downloaded', `Voucher ${formData.voucherNumber} saved successfully.`);
    } catch (err) {
      console.error(err);
      notify('error', 'PDF Error', err.message || 'Failed to generate PDF');
    }
  };

  return (
    <div className="min-h-screen bg-[#061e15] flex flex-col font-sans">
      
      {/* Top Application Header */}
      <Header
        onNewVoucher={handleResetForm}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedVouchers.length}
        onPrint={handlePrint}
        onDownloadPDF={handleDownloadPDF}
        isEditing={Boolean(editingId)}
        voucherNumber={formData.voucherNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <TripVoucherForm
          formData={formData}
          errors={errors}
          onChange={handleFieldChange}
          onSave={handleSaveVoucher}
          onPrint={handlePrint}
          onDownloadPDF={handleDownloadPDF}
          onReset={handleResetForm}
          isEditing={Boolean(editingId)}
          isSaving={isSaving}
          voucherCardRef={voucherCardRef}
        />
      </main>

      {/* Saved Vouchers Modal Drawer */}
      <SavedVouchersModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onSelectVoucher={handleSelectVoucherToEdit}
        onPrintVoucher={(voucher) => {
          handleSelectVoucherToEdit(voucher);
          setTimeout(() => printVoucher(), 400);
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

      {/* Toast Notification */}
      <AlertNotification
        notification={notification}
        onClose={() => setNotification(null)}
      />

    </div>
  );
}

export default App;
