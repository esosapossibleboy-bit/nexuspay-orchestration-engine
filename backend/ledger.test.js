import { expect, test, beforeEach } from 'vitest';
import { acquireAccountLock, releaseAccountLock, commitDoubleEntryTransaction, initLedgerTable } from './accountingLedger.js'; // We will build this next!

beforeEach(() => {
  initLedgerTable(); // Clean slate before each test run
});

test('Mutex Lock Challenge: The engine must block concurrent overlapping locks on the same account id', () => {
  const accountId = 'acc_netflix_01';

  // 1. Act: Primary transaction acquires the lock on the target account
  const firstLock = acquireAccountLock(accountId);
  expect(firstLock).toBe(true); // Successfully locked!

  // 2. Act: A secondary concurrent thread attempts to lock the exact same account instantly
  const secondLock = acquireAccountLock(accountId);
  
  // 3. Assert: The Mutex Grid must deny the second thread to prevent race conditions!
  expect(secondLock).toBe(false); // Locked out! Must wait in queue.

  // 4. Clean up: Release the lock for next operations
  releaseAccountLock(accountId);
});

test('Double-Entry Balance Rule: Asymmetrical debits and credits must be rejected by the accountant matrix', () => {
  // 1. Arrange: Input an unbalanced fraudulent ledger entry block (Debits don't match Credits!)
  const badTransaction = {
    transactionId: 'tx_reconcile_01',
    debits: [{ accountId: 'acc_cash_vault', amount: 500 }],
    credits: [{ accountId: 'acc_revenue_stream', amount: 450 }] // 🚨 MISMATCH! Missing $50!
  };

  // 2. Act: Pass the transaction through our compliance validator matrix
  const result = commitDoubleEntryTransaction(badTransaction);

  // 3. Assert: The accountant engine checks the mathematical parameters and blocks the entry!
  expect(result.success).toBe(false);
  expect(result.error).toBe('Accounting Ledger Error: Transaction is unbalanced! Total Debits must perfectly equal Total Credits.');
});
