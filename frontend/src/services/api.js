/**
 * Centralized API Client for Destin Cabs Trip Voucher Management System
 * Supports both Vercel Production deployment via VITE_API_URL and local Vite development proxy.
 */

// Retrieve configured API base URL (defaults to '/api' for Vite local proxy)
const RAW_API_URL = import.meta.env.VITE_API_URL || '/api';
const BASE_URL = RAW_API_URL.replace(/\/+$/, '');
const API_BASE = `${BASE_URL}/vouchers`;

/**
 * Checks backend health endpoint
 * @returns {Promise<Object>} Health status payload
 */
export const checkApiHealth = async () => {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return { ok: false, status: 0, error: error.message };
  }
};

/**
 * Fetches the next sequential voucher number from backend
 * Fallback generates formatted number if offline
 */
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

/**
 * Creates a new trip voucher
 * @param {Object} voucherData
 */
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

/**
 * Updates an existing trip voucher
 * @param {string} id
 * @param {Object} voucherData
 */
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

/**
 * Retrieves vouchers list with search and filter parameters
 * @param {Object} params - { search, date, startDate, endDate, page }
 */
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

/**
 * Retrieves a single voucher by MongoDB ID
 * @param {string} id
 */
export const getVoucherById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch voucher');
  return data.data;
};

/**
 * Deletes a voucher permanently
 * @param {string} id
 */
export const deleteVoucher = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete voucher');
  return data;
};
