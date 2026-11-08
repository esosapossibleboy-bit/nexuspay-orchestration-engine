# 💳 NexusPay: Global Payment Orchestration & Smart Routing Engine 🌍

Welcome to **NexusPay**, an industrial-scale, low-latency **B2B FinTech Payment Orchestration Layer** designed for global enterprise platforms processing high-volume multi-currency transactions. It intercepts checkout requests, blocks transaction duplication anomalies via an in-memory idempotency lock layer, tokenizes credit cards under strict **PCI-DSS Compliance**, and routes entries using dynamic fee optimization and automatic infrastructure failover circuits.

---

## 📂 Project Directory Structure

```text
nexuspay-orchestration-engine/
├── .gitignore                      # Active tracking safety matrix (Excludes node_modules/db files)
├── README.md                       # Master homepage documentation billboard
├── backend/                        # 🏰 High-Performance Core Ingestion Node (Year 1-3)
│   ├── node_modules/               # Installed server tool bundles
│   ├── accountingLedger.js         # Year 3 Double-Entry Accounting & Mutex Locking Matrix
│   ├── database.js                 # Idempotency Ledger & Cache Storage Node (LokiJS)
│   ├── paymentRouter.js            # Year 2 Cost Optimization & Failover Router Matrix
│   ├── vault.js                    # PCI-DSS Authenticated AES-256-GCM Tokenization Vault
│   ├── ledger.test.js              # Automated Year 3 Double-Entry Integrity Tests
│   ├── router.test.js              # Automated Year 2 Fee Optimization & Fallback Tests
│   ├── vault.test.js               # Automated PCI-DSS GCM Cryptographic Tests
│   ├── nexuspay.test.js            # Automated End-to-End Core Ingestion Tests
│   ├── server.js                   # Express Ingestion Gates & Unified Production Bridge
│   ├── package.json                # Backend configuration manifest blueprint
│   └── nexuspayVault.db            # Local hard drive database file container
│
├── frontend/                       # 🎨 Payment Control Terminal Dashboard Panel
│   ├── src/
│   │   ├── App.jsx                 # Master Command Hub Workspace Screen Controller
│   │   ├── App.test.jsx            # Frontend Integration Event Interaction Tests
│   │   ├── TokenVaultPanel.jsx     # Decoupled Cryptographic Tokenizer Component (Year 1)
│   │   ├── PaymentOrderForm.jsx    # Decoupled Order Ingestion Form Component (Year 2)
│   │   ├── AccountingLedgerMonitor.jsx # Decoupled Double-Entry Balancer Component (Year 3)
│   │   ├── setupTests.js           # Headless JSDOM Browser Vocabulary Definitions
│   │   └── main.jsx
│   ├── dist/                       # Compressed high-performance production build assets
│   ├── package.json                # Frontend configuration manifest blueprint
│   └── vite.config.js              # Vite browser engine testing environment settings
│
└── analytics-service/              # 🌟 NEW! Integrated Sub-Repository Workspace Node
    ├── .git                        # Isolated standalone git history index track
    ├── server.js                   # Standalone service logic entry port
    └── ...                         # Decoupled analytical telemetry configuration streams
```

---

## 🗺️ Multi-Month Enterprise Engineering Roadmap

NexusPay is architected to scale systematically across three production development milestones:
* **Year 1 (Active Core Ingestion Baseline):** Strict transaction idempotency ledger cogs, full-stack network header bridges, and PCI-DSS authenticated card tokenization vaults (`aes-256-gcm`).
* **Year 2 (Smart Routing Matrix):** Dynamic fee optimization parameters and multi-gateway failover clusters (switching streams dynamically between Stripe and Adyen nodes based on amount tiers and gateway health).
* **Year 3 (Reconciliation Engine):** Bank-grade double-entry accounting ledger transaction states and distributed local Mutex locking matrices to prevent ledger sync drift and concurrent race condition writes.

---

## 🛡️ Core Financial Engineering Cogs

### 1. Zero-Double-Charge Idempotency Shield
Enforces mathematical consistency across global channels by filtering unique incoming `Idempotency-Key` headers. Duplicate requests are trapped at the database ledger layer, immediately returning the original cached checkout receipt without re-executing down-stream charge triggers.

### 2. PCI-DSS Authenticated Card Tokenization Vault
Credit card numbers are strictly banned from plaintext file storage. The platform's cipher engine leverages symmetric **AES-256-GCM** encryption alongside random 12-byte initialization vectors (IV). An explicit **Authentication Tag** is generated and verified dynamically during decryption handshakes to isolate data rows from file-tampering breaches.

### 3. Year 2 Smart Fee Routing & Failover Matrix
Automatically evaluates incoming payment parameters to optimize processing costs. Transactions under \$500 route to Stripe to leverage optimized micro-fees, while transactions at or above \$500 scale to Adyen for corporate volume pricing. Includes a dashboard simulation toggle to force an artificial gateway outage and witness automatic, sub-millisecond route replication to the backup node.

### 4. Year 3 Double-Entry & Mutex Lock Validation
Enforces a strict debit-credit equilibrium check ($\sum \text{Debits} = \sum \text{Credits}$) on incoming reconciliation ledger streams. To completely neutralize concurrent transaction race conditions, the API gate commands an atomic local `Mutex Lock` on the target account ID, keeping the pipeline thread isolated until rows are committed into the unalterable transaction stream.

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

* **Test Idempotency Replays:** Execute a payment charge using the **Process Smart Payment Order** workspace form on the left. Press it twice under the same key string. The system will catch the duplicate instantly, flagging the second attempt as a safe `(🛑 IDEMPOTENCY LOCK)` re-fetch response block.
* **Test Outage Failovers:** Flip the **Stripe Server Infrastructure Switch** to an outage state on your left panel form. Send a transaction, and watch the system instantly bypass the down gateway and settle the payment via Adyen.
* **Test Ledger Balancers:** Drop unequal values into the Debit/Credit fields of the **Double-Entry Accounting Balancer** box. The system blocks transaction execution until your entries match perfectly and achieve matrix equilibrium!
