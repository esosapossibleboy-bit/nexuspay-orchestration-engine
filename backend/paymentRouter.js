/**
 * @fileoverview Year 2 Dynamic Cost Optimization & Multi-Gateway Failover Matrix.
 * Automatically evaluates transaction fees and handles resilient system failovers.
 */

// Default mock gateway status configurations
const DEFAULT_GATEWAYS = {
  Stripe: { healthy: true, baseFeePercent: 2.9 },
  Adyen: { healthy: true, baseFeePercent: 3.5 }
};

/**
 * Evaluates payment metrics, selects the optimal gateway, and handles downstream failover loops.
 * 
 * @param {Object} charge - { amount, currency }
 * @param {Object} gatewayStatusOverride - Optional status override mapping for testing outages
 * @returns {Object} Full transaction routing and settlement report
 */
export function routePayment(charge, gatewayStatusOverride = null) {
  const status = gatewayStatusOverride || DEFAULT_GATEWAYS;
  const { amount, currency } = charge;

  // 1. DYNAMIC COST OPTIMIZATION: Choose preferred primary route based on fee constraints
  // Stripe is preferred for smaller standard amounts due to better baseline transaction scales.
  let primaryGateway = 'Stripe';
  let backupGateway = 'Adyen';

  if (amount >= 500) {
    // Large commercial amounts shift to Adyen due to corporate bulk volume rates
    primaryGateway = 'Adyen';
    backupGateway = 'Stripe';
  }

  // 2. PRIMARY ATTEMPT: Check if our optimal selection is healthy and ready to ingest
  if (status[primaryGateway].healthy) {
    const fee = (amount * (status[primaryGateway].baseFeePercent / 100));
    return {
      success: true,
      gatewayUsed: primaryGateway,
      feeCharged: Number(fee.toFixed(2)),
      failoverTriggered: false,
      timestamp: new Date().toISOString()
    };
  }

  // 3. AUTOMATED FAILOVER LOOP: If primary fails, instantly reroute traffic to backup cluster!
  if (status[backupGateway].healthy) {
    const fee = (amount * (status[backupGateway].baseFeePercent / 100));
    return {
      success: true,
      gatewayUsed: backupGateway,
      feeCharged: Number(fee.toFixed(2)),
      failoverTriggered: true,
      alertMessage: `WARNING: Primary gateway ${primaryGateway} failed! Automated failover executed to ${backupGateway}.`,
      timestamp: new Date().toISOString()
    };
  }

  // 🚨 CRITICAL TOTAL OUTAGE: Both payment lanes are offline!
  return {
    success: false,
    error: 'CRITICAL ERROR: Total payment infrastructure failure! All gateways are returning outage status blocks.',
    timestamp: new Date().toISOString()
  };
}
