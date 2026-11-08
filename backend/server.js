// ========================================================
// 📦 STEP 1: BRING IN ALL OUR TOOLS (IMPORTS)
// ========================================================
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto'; 
import { findIdempotencyRecord, saveTransactionRecord } from './database.js';
import { tokenizeCard, detokenizeCard } from './vault.js';
import { routePayment } from './paymentRouter.js';
import { 
  acquireAccountLock, 
  releaseAccountLock, 
  commitDoubleEntryTransaction 
} from './accountingLedger.js'; // 🌟 NEW: Bring in our Year 3 Ledger module!

// ========================================================
// 🏰 STEP 2: BUILD THE CASTLE & SET UP THE FORCEFIELDS
// ========================================================
export const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the compiled frontend view panel assets automatically from the unified port
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ========================================================
// 🪙 STEP 3: CREATE THE SLOTS (ROUTES)
// ========================================================

// Slot 1: Base Charges Route (Idempotency Protected)
app.post('/api/charges', (req, res) => {
  const idempotencyKey = req.header('Idempotency-Key');
  const { amount, currency, cardToken } = req.body;

  if (!idempotencyKey) return res.status(400).json({ error: 'Missing required Idempotency-Key header!' });
  if (!amount || !currency || !cardToken) return res.status(400).json({ error: 'Missing transactional parameters!' });

  const existingRecord = findIdempotencyRecord(idempotencyKey);
  if (existingRecord) return res.status(200).json({ ...existingRecord.response, isDuplicateCachedResponse: true });

  const cleanChargeId = 'ch_' + crypto.randomBytes(12).toString('hex');
  const productionResponse = { chargeId: cleanChargeId, amount, currency, status: 'CHARGED', processedAt: new Date().toISOString() };

  saveTransactionRecord(idempotencyKey, productionResponse);
  res.status(200).json({ ...productionResponse, isDuplicateCachedResponse: false });
});

// Slot 2: Intelligent Payment Orchestration & Smart Failover Gate
app.post('/api/charges/orchestrate', (req, res) => {
  const idempotencyKey = req.header('Idempotency-Key');
  const { amount, currency, cardToken, gatewayStatusOverride } = req.body;

  if (!idempotencyKey) return res.status(400).json({ error: 'Missing mandatory Idempotency-Key validation header!' });
  if (!amount || !currency || !cardToken) return res.status(400).json({ error: 'Missing target transactional payload parameters!' });

  const existingRecord = findIdempotencyRecord(idempotencyKey);
  if (existingRecord) return res.status(200).json({ ...existingRecord.response, isDuplicateCachedResponse: true });

  const routingReport = routePayment({ amount, currency }, gatewayStatusOverride);
  if (!routingReport.success) return res.status(502).json({ error: routingReport.error });

  const uniqueChargeId = 'ch_' + crypto.randomBytes(12).toString('hex');
  const optimizedResponse = {
    chargeId: uniqueChargeId,
    amount,
    currency,
    status: 'SETTLED',
    gatewayUsed: routingReport.gatewayUsed,
    feeCharged: routingReport.feeCharged,
    failoverTriggered: routingReport.failoverTriggered,
    alertMessage: routingReport.alertMessage || null,
    processedAt: new Date().toISOString()
  };

  saveTransactionRecord(idempotencyKey, optimizedResponse);
  res.status(200).json({ ...optimizedResponse, isDuplicateCachedResponse: false });
});

// 📊 Slot 3: NEW! Year 3 Bank-Grade Double-Entry Reconciliation Ledger Gate
app.post('/api/ledger/reconcile', (req, res) => {
  const idempotencyKey = req.header('Idempotency-Key');
  const { lockAccountId, debits, credits } = req.body;

  if (!idempotencyKey) return res.status(400).json({ error: 'Missing mandatory Idempotency-Key validation header!' });
  if (!lockAccountId || !debits || !credits) return res.status(400).json({ error: 'Missing required balanced ledger parameters!' });

  // Idempotency Interception Check
  const existingRecord = findIdempotencyRecord(idempotencyKey);
  if (existingRecord) return res.status(200).json({ ...existingRecord.response, isDuplicateCachedResponse: true });

  // 1. 🔒 ATOMIC LOCK HANDSHAKE: Attempt to lock down the target account row to avoid race condition writes
  const lockWon = acquireAccountLock(lockAccountId);
  if (!lockWon) {
    return res.status(423).json({ error: 'ACCOUNT_LOCKED: This account is currently busy processing an open transaction thread!' });
  }

  try {
    const txId = 'tx_' + crypto.randomBytes(10).toString('hex');

    // 2. 🧮 VALIDATE DOUBLE-ENTRY ACCOUNTING RULES: Enforce debit-credit balance equilibrium
    const ledgerReport = commitDoubleEntryTransaction({ transactionId: txId, debits, credits });

    if (!ledgerReport.success) {
      // Release mutex lock block on constraint failures before response dispatching
      releaseAccountLock(lockAccountId);
      return res.status(422).json({ error: ledgerReport.error });
    }

    const transactionResponse = {
      status: 'RECONCILED',
      transactionId: txId,
      lockAccountId,
      snapshot: ledgerReport.ledgerSnapshot,
      processedAt: new Date().toISOString()
    };

    // Save transaction state payload down to our local persistent storage cache
    saveTransactionRecord(idempotencyKey, transactionResponse);

    // 3. 🔓 RELEASE ACQUIRED MUTEX LOCK: Safely release account corridor back to the network pool
    releaseAccountLock(lockAccountId);

    res.status(200).json({ ...transactionResponse, isDuplicateCachedResponse: false });

  } catch (err) {
    // Structural safety net catch: Ensure mutex drops even if runtime compilation crashes occur
    releaseAccountLock(lockAccountId);
    res.status(500).json({ error: 'Internal system accounting transaction crash.' });
  }
});

// Slot 4: Card Tokenization Route (PCI-DSS Compliance)
app.post('/api/vault/tokenize', (req, res) => {
  const { cardNumber } = req.body;
  if (!cardNumber) return res.status(400).json({ error: 'Missing target card numbers entries!' });
  const tokensData = tokenizeCard(cardNumber);
  res.status(200).json(tokensData);
});

// Slot 5: Authenticated GCM Card Decryption Handshake Route
app.post('/api/vault/detokenize', (req, res) => {
  const { encryptedPayload } = req.body;
  if (!encryptedPayload) return res.status(400).json({ error: 'Missing target encrypted vault string!' });
  try {
    const originalCardNumber = detokenizeCard(encryptedPayload);
    res.status(200).json({ cardNumber: originalCardNumber });
  } catch {
    res.status(400).json({ error: 'Cryptographic AuthTag check failed!' });
  }
});

// ========================================================
// ⚡ STEP 4: START THE APPLIANCE CORE ENGINE (LISTEN)
// ========================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log('=========================================');
  console.log(`💳 NEXUSPAY Orchestration Engine Live on Port ${PORT}!`);
  console.log(`👉 Visit http://localhost:${PORT}/ in your browser`);
  console.log('=========================================');
});
