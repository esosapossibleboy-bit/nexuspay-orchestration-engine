import { expect, test, vi } from 'vitest';
import { routePayment } from './paymentRouter.js'; // We will build this module next!

test('Smart Routing: Transactions under $500 should route to Stripe due to lower micro-fees', () => {
  const chargePayload = { amount: 100, currency: 'USD' };

  // Act: Run the transaction through our router matrix
  const report = routePayment(chargePayload);

  // Assert: Verify it correctly identified the most cost-efficient route
  expect(report.success).toBe(true);
  expect(report.gatewayUsed).toBe('Stripe');
  expect(report.feeCharged).toBe(2.9); // Stripe flat rate check
});

test('Automated Failover: If Stripe fails, the engine must immediately recover using the Adyen backup loop', () => {
  const chargePayload = { amount: 100, currency: 'USD' };

  // Arrange: Mock a system where Stripe throws a critical network error block
  const deadGatewaysConfig = {
    Stripe: { healthy: false }, // Simulating an active Stripe outage!
    Adyen: { healthy: true }
  };

  // Act: Force the transaction pipeline through the simulated outage context
  const report = routePayment(chargePayload, deadGatewaysConfig);

  // Assert: Verify the engine successfully recovered using the failover channel
  expect(report.success).toBe(true);
  expect(report.gatewayUsed).toBe('Adyen'); // Recovered!
  expect(report.failoverTriggered).toBe(true);
  expect(report.alertMessage).toBe('WARNING: Primary gateway Stripe failed! Automated failover executed to Adyen.');
});
