# DESTIN CABS — TRIP VOUCHER MANAGEMENT SYSTEM

A dedicated, production-ready Trip Voucher Management Web Application purpose-built for **DESTIN.CABS** (Premium Destination Cabs).

---

## 🚕 Brand Identity

- **Brand:** DESTIN.CABS
- **Tagline:** PREMIUM DESTINATION CABS
- **Direct Contact:** +91 95268 86600
- **Service Pillars:** SAFE / COMFORTABLE / ON TIME
- **Color Palette:** Luxury Deep Racing Emerald (`#08291E`, `#0A3123`), Vibrant Lime/Neon Yellow Accents (`#A3E635`, `#BEF264`), Crisp Pristine Voucher Background (`#FFFFFF`, `#FBFDFB`), Dark Green Typography (`#062619`).

---

## ⚡ Tech Stack

- **Frontend:** React.js 18 + Vite 6
- **Styling:** Tailwind CSS 3.4 (with `@media print` A4 portrait optimization)
- **Icons:** Lucide React
- **Signatures:** Touch-friendly HTML5 Canvas Signature Pad
- **PDF Generation:** jsPDF + html2canvas (2x scale crisp rendering) & Native Print
- **Backend:** Node.js + Express.js 4 (JavaScript only, no TypeScript)
- **Database:** MongoDB + Mongoose 8 (Local or Cloud MongoDB)
- **Security:** Helmet, CORS, Express-Rate-Limit, Server-Side Recalculation & Validation

---

## 📋 Features Implemented

1. **Trip Voucher Form**:
   - Sequential unique voucher number auto-generator (`DC-YYYY-XXXX`).
   - Default current date with editable datepicker.
   - Vehicle number and driver details with Indian mobile phone validation.
   - Multi-line customer billing address and contact information.
   - Starting & Closing KM with instant automatic calculation of Total KM.
   - Validation ensuring Closing KM $\ge$ Starting KM.
   - Trip duration calculation supporting journeys that cross midnight.
   - Taxi Charges, Toll/Parking, and Night Bata with Indian Rupee formatting.
   - Prominently highlighted **TOTAL** and **BALANCE** calculations (`Balance = Total - Advance`).
   - Dual touch-friendly signature pads for Guest and Driver.
2. **Saved Vouchers Modal / Drawer**:
   - Instant search by Voucher Number, Customer Name, Vehicle Number, or Driver Name.
   - Single-date or date-range filtering.
   - 1-Click Load into Editor to modify existing vouchers.
   - Quick Print and Download PDF directly from saved list.
   - Confirmation prompt on voucher deletion.
3. **High-Fidelity PDF & Print**:
   - Formatted for exact A4 portrait printing.
   - Strips non-printable buttons, headers, and toasts during print.
   - Exports high-resolution 2x scaled PDF files containing vector typography and digital signatures.
4. **Backend Recalculations & Data Integrity**:
   - Frontend totals are never blindly trusted; backend recalculates all amounts, durations, and kilometer values before saving to MongoDB.
   - Duplicate voucher number detection and protection.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or custom URI in `backend/.env`)

### 1. Install Dependencies
```bash
npm run install:all
```
*(or `npm install` inside both `backend` and `frontend`)*

### 2. Configure Environment (Backend)
Check `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/destin_cabs
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run Application
Run the backend:
```bash
npm run backend
```
Run the frontend:
```bash
npm run frontend
```

Open your browser at: **`http://localhost:5173`**

---

## 🧪 Testing

The codebase includes comprehensive test suites covering unit calculations, integration APIs, and all 20 acceptance criteria:

1. **Unit Tests (14 tests):**
   ```bash
   node backend/tests/voucher.test.js
   ```

2. **Full API Integration Tests (10 tests):**
   ```bash
   node backend/tests/integration.test.js
   ```

3. **20-Case Acceptance Test Matrix (20 tests):**
   ```bash
   node backend/tests/all20cases.test.js
   ```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint |
| `GET` | `/api/vouchers/next-number` | Generates next sequential voucher ID |
| `POST` | `/api/vouchers` | Creates and saves a new voucher |
| `GET` | `/api/vouchers` | Retrieves vouchers (supports `search`, `date`, `page`) |
| `GET` | `/api/vouchers/:id` | Fetches a single voucher by Mongo ID or Voucher # |
| `PUT` | `/api/vouchers/:id` | Updates an existing voucher |
| `DELETE`| `/api/vouchers/:id` | Deletes a voucher |

---

## 📄 License
Destin Cabs Private Ltd. All Rights Reserved.
