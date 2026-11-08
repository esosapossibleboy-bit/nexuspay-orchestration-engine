// ========================================================
// 📦 STEP 1: BRING IN ALL OUR TOOLS (IMPORTS)
// ========================================================
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto'; 
import { findIdempotencyRecord, saveTransactionRecord } from './database.js';
import { tokenizeCard, detokenizeCard } from './vault.js'; // 🌟 Import our GCM cogs!

// ========================================================
// 🏰 STEP 2: BUILD THE CASTLE & SET UP THE FORCEFIELDS
// ========================================================
export const app = express();
app.use(cors());
app.use(express.json());

// 🌟 FULL-STACK BRIDGE: Help the backend locate the frontend build box folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Instruct the server to automatically serve your compiled React dashboard assets!
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ========================================================
// 🪙 STEP 3: CREATE THE SLOTS (ROUTES)
// ========================================================

// Slot 1: Secure Charges Ingestion Inflow Route (Idempotency Protected)
app.post('/api/charges', (req, res) => {
  const idempotencyKey = req.header('Idempotency-Key');
  const { amount, currency, cardToken } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Missing required Idempotency-Key parameter in headers!' });
  }
  if (!amount || !currency || !cardToken) {
    return res.status(400).json({ error: 'Missing critical transactional parameters payload!' });
  }

  const existingRecord = findIdempotencyRecord(idempotencyKey);
  if (existingRecord) {
    return res.status(200).json({ ...existingRecord.response, isDuplicateCachedResponse: true });
  }

  const cleanChargeId = 'ch_' + crypto.randomBytes(12).toString('hex');
  const productionResponse = { chargeId: cleanChargeId, amount, currency, status: 'CHARGED', processedAt: new Date().toISOString() };

  saveTransactionRecord(idempotencyKey, productionResponse);
  res.status(200).json({ ...productionResponse, isDuplicateCachedResponse: false });
});

// 🔒 Slot 2: Card Tokenization Route (PCI-DSS Compliance)
app.post('/api/vault/tokenize', (req, res) => {
  const { cardNumber } = req.body;
  if (!cardNumber) return res.status(400).json({ error: 'Missing target card numbers entries!' });

  const tokensData = tokenizeCard(cardNumber);
  res.status(200).json(tokensData);
});

// 🔓 Slot 3: Authenticated GCM Card Decryption Handshake Route
app.post('/api/vault/detokenize', (req, res) => {
  const { encryptedPayload } = req.body;
  if (!encryptedPayload) return res.status(400).json({ error: 'Missing target encrypted vault string!' });

  try {
    const originalCardNumber = detokenizeCard(encryptedPayload);
    res.status(200).json({ cardNumber: originalCardNumber });
  } catch {
    res.status(400).json({ error: 'Cryptographic AuthTag check failed! Tampered file block or invalid key.' });
  }
});

// ========================================================
// ⚡ STEP 4: START THE APPLIANCE CORE ENGINE (LISTEN)
// ========================================================
const PORT = 3000;
app.listen(PORT, () => {
  console.log('=========================================');
  console.log(` 💳 NEXUSPAY Orchestration Engine Live on Port ${PORT}!`);
  console.log(` 👉 Visit http://localhost:${PORT}/ in your browser`);
  console.log('=========================================');
});
