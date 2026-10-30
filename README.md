# DESTIN CABS — TRIP VOUCHER MANAGEMENT SYSTEM

A premium, production-ready Trip Voucher Management Web Application purpose-built for **DESTIN CABS** (A Division of **DESTIN PRIVATE LIMITED**).

---

## 🏢 Corporate Identity & Official Details

- **Brand:** DESTIN CABS
- **Company Legal Name:** DESTIN PRIVATE LIMITED
- **Registered Office:** Suite No.1067, 2nd, Kc Arcade, 24/1701, near TV Centre, P.O, CSEZ, Kakkanad, Kochi, Keralam 682037
- **Helpline / Contact:** +91 95268 86600
- **Service Pillars:** SAFE • COMFORTABLE • ON TIME
- **Brand Palette:** Deep Forest Green (`#003D2F`), Premium Dark Green (`#004B38`), Radiant Lime (`#D8EB29`), Soft Background (`#F5F8F5`), Dark Green Text (`#102B24`), Border (`#DCE7E0`).

---

## ⚡ Architecture & Technology Stack

- **Frontend:** React 18 + Vite 6 (JavaScript only, zero TypeScript)
- **Styling:** Tailwind CSS 3.4 with custom `@media print` A4 portrait optimization
- **Icons:** Lucide React
- **Signatures:** Touch-friendly HTML5 Canvas Signature Pad (Guest & Driver)
- **PDF Pipeline:** jsPDF + html2canvas with multi-tier image verification and single-page A4 auto-fit
- **Backend:** Node.js + Express.js 4 (Modular routes, controllers, middleware)
- **Database:** MongoDB Atlas (Cloud) / Local MongoDB via Mongoose 8
- **Security:** Helmet, strict dynamic CORS, Express-Rate-Limit, server-side recalculation & validation

---

## 📁 Repository Structure

```text
destin-cabs/
├── backend/                  # Express.js Backend Service
│   ├── src/
│   │   ├── config/db.js      # MongoDB Atlas connection with credential masking
│   │   ├── controllers/      # Voucher business logic & CRUD handlers
│   │   ├── middleware/       # Error handler & input validators
│   │   ├── models/           # Mongoose Voucher Schema
│   │   ├── routes/           # REST API routes (/api/vouchers)
│   │   └── utils/            # Server calculations (KM, hours, billing)
│   ├── tests/                # Automated test suites (58 total tests)
│   ├── .env.example          # Backend environment template
│   ├── package.json          # Node dependencies (engines: >=18.0.0)
│   └── server.js             # Root backend entry point (listens on 0.0.0.0)
│
├── frontend/                 # Vite + React Frontend Application
│   ├── public/               # Official vector logo assets (SVG, PDF)
│   ├── src/
│   │   ├── components/       # UI components (Header, Form, Preview, Modals)
│   │   ├── services/api.js   # Centralized API client supporting VITE_API_URL
│   │   ├── utils/            # PDF generator, image processor, formatters
│   │   ├── App.jsx           # Master application component
│   │   └── main.jsx          # React DOM entry point
│   ├── .env.example          # Frontend environment template
│   ├── vercel.json           # Vercel SPA routing & asset cache rules
│   ├── vite.config.js        # Vite build & local proxy configuration
│   └── package.json          # React dependencies & build scripts
│
├── render.yaml               # Optional Render Infrastructure-as-Code blueprint
├── .gitignore                # Comprehensive secrets protection
├── package.json              # Monorepo development scripts
└── README.md                 # Complete documentation & deployment guide
```

---

## 🚀 Production Deployment Guide

Target Architecture:
- **Frontend:** Vercel
- **Backend:** Render (Web Service)
- **Database:** MongoDB Atlas

---

### STEP 1: Set Up MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create or select a Cluster (Free M0 or higher).
3. Under **Security → Database Access**:
   - Create a database user (e.g. `destin_admin`) with password.
   - Assign `Read and write to any database` privileges.
4. Under **Security → Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere (`0.0.0.0/0`)** so Render cloud instances can connect.
5. Under **Deployments → Databases → Connect**:
   - Select **Drivers** (Node.js).
   - Copy your connection string:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/destin_cabs?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.

---

### STEP 2: Deploy Backend on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New + → Web Service**.
3. Connect your GitHub repository (`https://github.com/AHAMMEDNAJADKK/DESTIN-CARS.git`).
4. Configure the Web Service settings:
   - **Name:** `destin-cabs-api` (or your preferred name)
   - **Region:** Singapore / Frankfurt / Oregon (closest to users)
   - **Branch:** `main`
   - **Root Directory:** `backend` *(CRITICAL)*
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan Type:** `Free` (or higher)
5. Scroll down to **Environment Variables** and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `MONGODB_URI` | `mongodb+srv://<user>:<pwd>@cluster...` | Your MongoDB Atlas connection string |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | *Leave placeholder or add your Vercel URL* |
6. Click **Create Web Service**.
7. Once deployed, verify by opening in your browser:
   - Base endpoint: `https://destin-cabs-api.onrender.com/`
   - Health check: `https://destin-cabs-api.onrender.com/api/health`
   - Expected status: `{"application":"...","status":"healthy","database":{"connected":true}}`
8. Copy your Render backend URL (e.g., `https://destin-cabs-api.onrender.com`).

---

### STEP 3: Deploy Frontend on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New… → Project**.
3. Import your GitHub repository.
4. Configure the Project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click Edit → select `frontend` *(CRITICAL)*
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
   - **Install Command:** `npm install` (default)
5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://destin-cabs-api.onrender.com/api` |
   *(Note: Ensure it ends with `/api` without trailing slash)*
6. Click **Deploy**.
7. Once deployment finishes, copy your live Vercel domain (e.g. `https://destin-cabs.vercel.app`).

---

### STEP 4: Link Frontend Domain in Render CORS

1. Go back to your [Render Dashboard](https://dashboard.render.com/) → your Web Service (`destin-cabs-api`).
2. Navigate to **Environment**.
3. Update `FRONTEND_URL` to your actual Vercel domain:
   ```text
   FRONTEND_URL=https://destin-cabs.vercel.app
   ```
4. Click **Save Changes**. Render will automatically redeploy with the updated CORS origin.

---

## 🧪 Automated Test Suites

The codebase includes 58 automated tests spanning units, integration, acceptance matrix, and deployment configurations:

```bash
# 1. Run Unit Tests (14 tests)
node backend/tests/voucher.test.js

# 2. Run API Integration Tests (10 tests)
node backend/tests/integration.test.js

# 3. Run Acceptance Matrix Tests (20 tests)
node backend/tests/all20cases.test.js

# 4. Run Production Deployment Tests (14 tests)
node backend/tests/deployment.test.js

# 5. Build Frontend for Production
npm --prefix frontend run build
```

---

## 📄 License & Ownership

Copyright © 2026 **DESTIN PRIVATE LIMITED**. All Rights Reserved.
Official brand assets extracted from authentic corporate brand identity documents.
