import React from 'react';

export default function AccountingLedgerMonitor({
  recIdempotencyKey, setRecIdempotencyKey,
  lockAccount, setLockAccount,
  debitAmount, setDebitAmount,
  creditAmount, setCreditAmount,
  handleReconcileLedger,
  latestReconciledTx
}) {
  const drValue = Number(debitAmount) || 0;
  const crValue = Number(creditAmount) || 0;
  const isBalanced = drValue === crValue && drValue > 0;

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#10b981', borderBottom: '2px solid #334155', paddingBottom: '10px', fontSize: '1.2rem' }}>
        📊 Double-Entry Accounting Balancer
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '15px' }}>
        Performs bank-grade reconciliation. Acquires an atomic Mutex lock on the Account ID and enforces perfect debit-credit math equilibrium ($\sum Dr = \sum Cr$).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label htmlFor="rec-key-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Reconciliation Idempotency Ticket</label>
        <input id="rec-key-input" type="text" value={recIdempotencyKey} onChange={(e) => setRecIdempotencyKey(e.target.value)} style={{ backgroundColor: '#0f172a', color: '#10b981', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', fontWeight: 'bold' }} />

        <label htmlFor="lock-account-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Target Account ID to Mutex Lock</label>
        <input id="lock-account-input" type="text" placeholder="e.g. acc_merchant_uber_01" value={lockAccount} onChange={(e) => setLockAccount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor="debit-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Debit Entry (Dr) Amount ($)</label>
            <input id="debit-input" type="number" placeholder="0" value={debitAmount} onChange={(e) => setDebitAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '85%' }} />
          </div>
          <div>
            <label htmlFor="credit-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Credit Entry (Cr) Amount ($)</label>
            <input id="credit-input" type="number" placeholder="0" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '85%' }} />
          </div>
        </div>

        {/* Dynamic Balancer Status Monitor Strip */}
        <div style={{ padding: '10px', backgroundColor: '#0f172a', borderRadius: '6px', border: `1px solid ${isBalanced ? '#047857' : '#b91c1c'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
          <span>STATUS: <span style={{ color: isBalanced ? '#4ade80' : '#f87171' }}>{isBalanced ? '⚖️ MATRICES BALANCED' : '❌ ASYMMETRICAL DATA OUTLIER'}</span></span>
          <span style={{ color: '#cbd5e1' }}>Dr: ${drValue} | Cr: ${crValue}</span>
        </div>

        <button onClick={handleReconcileLedger} style={{ padding: '12px', backgroundColor: isBalanced ? '#10b981' : '#475569', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: isBalanced ? 'pointer' : 'not-allowed', marginTop: '5px' }} disabled={!isBalanced}>
          🔒 Commit Reconciled Ledger Rows
        </button>
      </div>

      {latestReconciledTx && (
        <div style={{ marginTop: '15px', padding: '12px', backgroundColor: '#064e3b', border: '1px solid #047857', borderRadius: '8px', fontSize: '0.8rem' }}>
          <span style={{ color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>📜 IMMUTABLE RECONCILIATION SNAPSHOT SECURED:</span>
          <p style={{ margin: '2px 0' }}><b>Tx Code:</b> {latestReconciledTx.transactionId}</p>
          <p style={{ margin: '2px 0' }}><b>Mutex Cleared on:</b> {latestReconciledTx.lockAccountId}</p>
          <p style={{ margin: '2px 0' }}><b>Timestamp Seal:</b> {latestReconciledTx.processedAt}</p>
        </div>
      )}
    </div>
  );
}
