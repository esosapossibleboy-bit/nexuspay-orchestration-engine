import { expect, test, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from './server.js'; // We will build this server gate next!
import { initDatabase } from './database.js'; // We will build this database module next!

beforeEach(() => {
  // Wipe our transaction grids clean before every single test run to keep blocks isolated
  initDatabase();
});

test('FinTech Idempotency Challenge: Duplicate checkout requests must return the original cached response to prevent double-charging', async () => {
  const duplicateIdempotencyKey = 'idemp_key_999a';
  
  const paymentPayload = {
    amount: 150,
    currency: 'USD',
    cardToken: 'tok_visa_4444'
  };

  // 1. Act: Submit the first payment request stamped with our unique idempotency token
  const firstRequest = await request(app)
    .post('/api/charges')
    .set('Idempotency-Key', duplicateIdempotencyKey) // 🛡️ Stamped with the unique processing ticket key
    .send(paymentPayload);
  
  expect(firstRequest.status).toBe(200);
  expect(firstRequest.body.status).toBe('CHARGED');
  const originalChargeId = firstRequest.body.chargeId;

  // 2. Act: Instantly submit the EXACT same request again (Simulating a double-tap glitch)
  const secondRequest = await request(app)
    .post('/api/charges')
    .set('Idempotency-Key', duplicateIdempotencyKey) // 🚨 Same Key!
    .send(paymentPayload);

  // 3. Assert: The Guard Dog checks if the engine safely intercepted the double-charge!
  // The second request must succeed with 200 OK but return the EXACT same original charge ID record row!
  expect(secondRequest.status).toBe(200);
  expect(secondRequest.body.status).toBe('CHARGED');
  expect(secondRequest.body.chargeId).toBe(originalChargeId); // 🔒 Confirms double-charging is structurally impossible!
  expect(secondRequest.body.isDuplicateCachedResponse).toBe(true); // Verifies it loaded the cached safety ticket
});

test('Orchestration Gate Pass: Processing an order must calculate cost weights and attach settlement parameters', async () => {
  const customKey = 'idemp_key_orchestrate_77';

  // Act: Submit an order payload to our brand-new orchestration route slot
  const response = await request(app)
    .post('/api/charges/orchestrate')
    .set('Idempotency-Key', customKey)
    .send({
      amount: 600, // Large amount should dynamically trigger Adyen preferential bulk rates!
      currency: 'EUR',
      cardToken: 'tok_visa_5555'
    });

  // Assert: Verify it calculated costs and successfully routed to Adyen
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('SETTLED');
  expect(response.body.gatewayUsed).toBe('Adyen'); // Cost optimization passed!
  expect(response.body.feeCharged).toBe(21); // 3.5% of 600 check
  expect(response.body.failoverTriggered).toBe(false);
});

test('Reconciliation Ingestion Gate: Submitting balanced double-entries must pass checks and release locks cleanly', async () => {
  const reconciliationKey = 'idemp_key_rec_year3';

  // Act: Post a perfectly balanced transaction batch to our new accounting path slot
  const response = await request(app)
    .post('/api/ledger/reconcile')
    .set('Idempotency-Key', reconciliationKey)
    .send({
      lockAccountId: 'acc_merchant_uber_01',
      debits: [{ accountId: 'acc_cash_vault', amount: 300 }],
      credits: [{ accountId: 'acc_accounts_receivable', amount: 300 }] // Perfectly Balanced!
    });

  // Assert: Verify it maps to a successful balanced state and prints out 200 OK
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('RECONCILED');
  expect(response.body.lockAccountId).toBe('acc_merchant_uber_01');
  expect(response.body.snapshot.entries.length).toBe(2);
});
