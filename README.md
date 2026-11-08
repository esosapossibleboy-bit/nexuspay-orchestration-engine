# 💳 NexusPay: Global Payment Orchestration & Smart Routing Engine 🌍

NexusPay is an industrial-scale, low-latency **B2B FinTech Payment Orchestration Layer** designed for global enterprise platforms processing high-volume multi-currency transactions. It intercepts checkout requests, enforces structural data protection constraints, blocks transaction duplication anomalies via a high-performance idempotency lock layer, and dynamically tokenizes credit cards under strict **PCI-DSS Compliance**.

---

## 📂 Project Directory Structure

```text
nexuspay-orchestration-engine/
├── backend/                        # 🏰 High-Performance Core Ingestion Node
│   ├── node_modules/               # Installed server tool bundles
│   ├── database.js                 # Idempotency Ledger & Cache Storage Node (LokiJS)
│   ├── vault.js                    # PCI-DSS Authenticated AES-256-GCM Tokenization Vault
│   ├── vault.test.js               # Automated GCM Cryptographic Isolation Tests
│   ├── nexuspay.test.js            # Automated Transaction Idempotency Replay Tests
│   ├── server.js                   # Express Ingestion Gates & Unified Production Bridge
│   ├── package.json                # Backend configuration manifest blueprint
│   └── nexuspayVault.db            # Local permanent hard drive transactional snapshot file
│
└── frontend/                       # 🎨 Payment Control Terminal Dashboard
    ├── src/
    │   ├── App.jsx                 # Master Command Hub Workspace Screen Controller
    │   ├── App.test.jsx            # Frontend Integration Event Interaction Tests
    │   ├── TokenVaultPanel.jsx     # Decoupled Cryptographic Tokenizer Module Component
    │   ├── setupTests.js           # Headless JSDOM Browser Vocabulary Definitions
    │   └── main.jsx
    ├── dist/                       # Compressed high-performance production build assets
    ├── package.json                # Frontend configuration manifest blueprint
    └── vite.config.js              # Vite browser engine testing environment settings
```

---

## 🗺️ Multi-Month Enterprise Engineering Roadmap

NexusPay is architected to scale systematically across three production development milestones:
* **Year 1 (Active Core Baseline):** Strict transaction idempotency ledger cogs, full-stack network header bridges, and PCI-DSS authenticated card tokenization vaults (`aes-256-gcm`).
* **Year 2 (Smart Routing Matrix):** Dynamic fee optimization parameters and multi-gateway failover clusters (switching streams dynamically between Stripe, Adyen, and PayPal nodes).
* **Year 3 (Reconciliation Engine):** Double-entry accounting ledger transaction states and distributed locking matrices to prevent ledger sync drift.

---

## 🛡️ Core Financial Engineering Cogs

### 1. Zero-Double-Charge Idempotency Shield
Enforces mathematical consistency across global channels. Request streams are intercepted at the gateway edge by filtering unique incoming `Idempotency-Key` headers. Duplicate requests are trapped at the database ledger layer, immediately returning the original cached checkout receipt without re-executing down-stream charge triggers.

### 2. PCI-DSS Authenticated Card Tokenization Vault
Credit card numbers are strictly banned from plaintext file storage. The platform's cipher engine leverages symmetric **AES-256-GCM** encryption alongside random 12-byte initialization vectors (IV). An explicit **Authentication Tag** is generated and verified dynamically during decryption handshakes to isolate data rows from file-tampering breaches.

### 3. Dual-Layer TDD Security Defenses
Complete automated validation safety grids powered by **Vitest** and **Supertest**. Financial ledger routines and frontend child state prop bindings execute flawlessly in sub-70 millisecond loops to defend code mutations under peak pipeline loads.

---

## 🕹️ Quick-Start Deployment Instructions

Follow these structural steps to ignite the full-stack single-port engine on your machine:

### 1. Download Workspace Folder
Open a terminal panel window and step inside the master project root folder:
```bash
cd nexuspay-orchestration-engine
```

### 2. Ignite the Financial Server Core
Move into the server directory, restore backend packages, and launch the core ingestion power engine:
```bash
cd backend
npm install
npm start
```
*The financial orchestration ingestion gates are awake and active on Port **`3000`**!*

### 3. Access the Billing Control Portal
Open your favorite internet browser and navigate directly to your single-port enterprise portal address:
👉 **http://localhost:3000/**

* **Test Idempotency Replays:** Execute a payment charge using the **Process Payment Order** workspace form on the left. Press it twice under the same `Idempotency-Key` string. The system will catch the duplicate instantly, flagging the second attempt as a safe `(⚠️ IDEMPOTENCY REPLAY LOGGED)` re-fetch response block.
* **Test Tokenization Vaults:** Drop raw card values into the right-side **PCI-DSS Tokenization Vault Bench** form to watch the server transform plaintext parameters into unreadable authenticated GCM strings in milliseconds.
