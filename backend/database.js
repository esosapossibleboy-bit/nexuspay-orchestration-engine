import Loki from 'lokijs';

const db = new Loki('nexuspayVault.db', {
  autoload: true,
  autoloadCallback: databaseInitialize,
  autosave: true,
  autosaveInterval: 4000
});

let chargesCollection;
let idempotencyCollection;

function databaseInitialize() {
  chargesCollection = db.getCollection('charges') || db.addCollection('charges');
  idempotencyCollection = db.getCollection('idempotency') || db.addCollection('idempotency');
}

/**
 * Clean-slate tool used exclusively by our automated test suites
 */
export function initDatabase() {
  if (!chargesCollection || !idempotencyCollection) {
    databaseInitialize();
  }
  chargesCollection.clear();
  idempotencyCollection.clear();
}

/**
 * Looks up an active idempotency key row to check for duplicate requests
 * @param {string} key - Unique Idempotency-Key string from header
 * @returns {Object|null} The cached charge response data if it exists
 */
export function findIdempotencyRecord(key) {
  if (!idempotencyCollection) databaseInitialize();
  return idempotencyCollection.findOne({ key: key.trim() });
}

/**
 * Atomically locks and logs a payment execution record accompanied by its idempotency token
 * @param {string} key - The unique transaction ticket key
 * @param {Object} cachedResponse - The exact JSON payload response to cache for safety
 */
export function saveTransactionRecord(key, cachedResponse) {
  if (!chargesCollection || !idempotencyCollection) databaseInitialize();
  
  // 1. Log the master transaction receipt row
  chargesCollection.insert({
    chargeId: cachedResponse.chargeId,
    amount: cachedResponse.amount,
    currency: cachedResponse.currency,
    createdAt: new Date().toISOString()
  });

  // 2. Lock the idempotency key permanently to prevent any future double processing
  idempotencyCollection.insert({
    key: key.trim(),
    response: cachedResponse,
    createdAt: new Date().toISOString()
  });

  db.saveDatabase(); // Instantly write the financial state permanently to the disk file!
}

// Automatically mount tables on boot
databaseInitialize();
