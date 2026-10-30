const API_BASE = '/api/vouchers';

export const fetchNextVoucherNumber = async () => {
  try {
    const res = await fetch(`${API_BASE}/next-number`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch next voucher number');
    return data.voucherNumber;
  } catch (error) {
    console.warn('[API Warning] Could not fetch next number from server, falling back to local format', error);
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `DC-${year}-${rand}`;
  }
};

export const createVoucher = async (voucherData) => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(voucherData)
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.errors ? data.errors.join(', ') : data.message || 'Failed to create voucher';
    throw new Error(errorMsg);
  }
  return data;
};

export const updateVoucher = async (id, voucherData) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(voucherData)
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.errors ? data.errors.join(', ') : data.message || 'Failed to update voucher';
    throw new Error(errorMsg);
  }
  return data;
};

export const getVouchers = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.date) query.append('date', params.date);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.page) query.append('page', params.page);

  const res = await fetch(`${API_BASE}?${query.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to retrieve vouchers');
  return data;
};

export const getVoucherById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch voucher');
  return data.data;
};

export const deleteVoucher = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete voucher');
  return data;
};
