/**
 * Centralized API Client for Destin Cabs Trip Voucher Management System
 * Production-ready for Vercel Frontend and Render Backend.
 */

/**
 * Intelligently resolves and normalizes the backend API base URL.
 * Handles trailing slashes, missing '/api' suffixes, and local Vite dev proxy.
 * 
 * @returns {string} Normalized API base URL (e.g. 'https://destin-cabs-api.onrender.com/api' or '/api')
 */
export const resolveApiBase = () => {
  let url = (import.meta.env.VITE_API_URL || '').trim();

  // If no URL is provided
  if (!url) {
    if (import.meta.env.DEV) {
      // In local development, use Vite proxy to localhost:5000
      return '/api';
    }
    // In production on Vercel, alert the developer via console
    console.warn(
      '[Destin Cabs API Warning] VITE_API_URL is not set in Vercel environment variables. ' +
      'Requests will target current origin /api. Please configure VITE_API_URL=https://<your-render-backend>.onrender.com/api in Vercel and redeploy.'
    );
    return '/api';
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  // Handle case where user configured '.../api/vouchers' or '.../vouchers'
  if (url.endsWith('/api/vouchers')) {
    return url.slice(0, -'/vouchers'.length);
  }
  if (url.endsWith('/vouchers')) {
    const withoutVouchers = url.slice(0, -'/vouchers'.length);
    return withoutVouchers.endsWith('/api') ? withoutVouchers : `${withoutVouchers}/api`;
  }

  // Handle case where user provided only host e.g. 'https://destin-cabs-api.onrender.com'
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
};

/**
 * Universal safe request wrapper.
 * Prevents "Unexpected token 'T', 'The page c'... is not valid JSON" errors by:
 * 1. Validating network response headers and content-type before attempting JSON parsing.
 * 2. Distinguishing between network connectivity errors, HTML 404 pages, and API business errors.
 * 3. Extracting clean, actionable error messages.
 * 
 * @param {string} endpoint - Relative API endpoint (e.g. '/vouchers' or '/health')
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Parsed JSON response payload
 */
export const safeApiRequest = async (endpoint, options = {}) => {
  const base = resolveApiBase();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${base}${cleanEndpoint}`;

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });
  } catch (networkError) {
    console.error(`[Destin Cabs Network Error] Failed to connect to API at: ${url}`, networkError);
    const err = new Error(
      'Unable to connect to Destin Cabs server. The backend service may be offline or waking up from sleep (Render free tier). Please check your internet connection and try again.'
    );
    err.isNetworkError = true;
    err.originalError = networkError;
    throw err;
  }

  // Inspect Content-Type before parsing
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  let data = null;
  let textBody = '';

  if (isJson) {
    try {
      data = await res.json();
    } catch (parseErr) {
      console.error(`[Destin Cabs Parse Error] Invalid JSON payload received from ${url}`);
      data = null;
    }
  } else {
    // Read text safely (crucial when cloud host returns HTML 404 or 502/503 error page)
    textBody = await res.text();
  }

  // Handle non-2xx HTTP responses
  if (!res.ok) {
    let errorMessage = '';

    if (data && (data.message || data.error || (Array.isArray(data.errors) && data.errors.join(', ')))) {
      errorMessage = data.message || data.error || data.errors.join(', ');
    } else if (res.status === 404) {
      if (!isJson && textBody.includes('The page')) {
        errorMessage = `API route not found (404). Frontend is receiving HTML 404 from Vercel instead of Render. Verify VITE_API_URL is configured in Vercel to point to your Render backend URL.`;
      } else {
        errorMessage = `API endpoint not found: ${cleanEndpoint} (HTTP 404).`;
      }
    } else if (res.status === 502 || res.status === 503) {
      errorMessage = `Backend service is temporarily unavailable (HTTP ${res.status}). If hosted on Render free tier, please allow ~30 seconds for the service to wake up.`;
    } else {
      errorMessage = `Server request failed (HTTP ${res.status}): ${res.statusText || 'Unknown error'}`;
    }

    const err = new Error(errorMessage);
    err.status = res.status;
    err.isHtmlResponse = !isJson;
    err.data = data;
    throw err;
  }

  return data;
};

/**
 * Checks backend health endpoint
 * @returns {Promise<{ ok: boolean, status: number, data?: Object, error?: string }>}
 */
export const checkApiHealth = async () => {
  try {
    const data = await safeApiRequest('/health');
    return { ok: true, status: 200, data };
  } catch (error) {
    return { ok: false, status: error.status || 0, error: error.message };
  }
};

/**
 * Fetches the next sequential voucher number from backend.
 * Distinguishes between connection failure and generation failure.
 * 
 * @returns {Promise<string>} Next sequential voucher number (e.g. 'DC-2026-0001')
 */
export const fetchNextVoucherNumber = async () => {
  try {
    const data = await safeApiRequest('/vouchers/next-number');
    if (!data || !data.voucherNumber) {
      throw new Error('Server returned an empty voucher number');
    }
    return data.voucherNumber;
  } catch (error) {
    console.error('[Destin Cabs API Error] Could not generate sequential voucher number:', error.message);
    throw error;
  }
};

/**
 * Creates a new trip voucher in MongoDB
 * @param {Object} voucherData
 * @returns {Promise<Object>} Created voucher document
 */
export const createVoucher = async (voucherData) => {
  const data = await safeApiRequest('/vouchers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(voucherData)
  });
  return data;
};

/**
 * Updates an existing trip voucher in MongoDB
 * @param {string} id - MongoDB ObjectId
 * @param {Object} voucherData
 * @returns {Promise<Object>} Updated voucher document
 */
export const updateVoucher = async (id, voucherData) => {
  const data = await safeApiRequest(`/vouchers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(voucherData)
  });
  return data;
};

/**
 * Retrieves vouchers list with search and date filtering
 * @param {Object} params - { search, date, startDate, endDate, page }
 * @returns {Promise<Object>} Voucher list and pagination info
 */
export const getVouchers = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.date) query.append('date', params.date);
  if (params.startDate) query.append('startDate', params.startDate);
  if (params.endDate) query.append('endDate', params.endDate);
  if (params.page) query.append('page', params.page);

  const qs = query.toString();
  const endpoint = qs ? `/vouchers?${qs}` : '/vouchers';
  const data = await safeApiRequest(endpoint);
  return data;
};

/**
 * Retrieves a single voucher by MongoDB ID or Voucher Number
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getVoucherById = async (id) => {
  const data = await safeApiRequest(`/vouchers/${id}`);
  return data.data;
};

/**
 * Deletes a voucher permanently
 * @param {string} id - MongoDB ObjectId
 * @returns {Promise<Object>}
 */
export const deleteVoucher = async (id) => {
  const data = await safeApiRequest(`/vouchers/${id}`, {
    method: 'DELETE'
  });
  return data;
};
