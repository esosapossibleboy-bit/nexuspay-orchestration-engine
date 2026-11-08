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
