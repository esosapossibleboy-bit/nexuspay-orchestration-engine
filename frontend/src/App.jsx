import React, { useState } from 'react';
import TokenVaultPanel from './TokenVaultPanel';
import PaymentOrderForm from './PaymentOrderForm';
import AccountingLedgerMonitor from './AccountingLedgerMonitor'; // 🌟 Import Year 3 Box!

export default function App() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [cardToken, setCardToken] = useState('tok_visa_4444');
  const [idempotencyKey, setIdempotencyKey] = useState('idemp_orchestrate_101');
  const [stripeHealthy, setStripeHealthy] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Tokenization shared states
  const [rawCard, setRawCard] = useState('');
  const [vaultResult, setVaultResult] = useState(null);
  const [cipherText, setCipherText] = useState('');
  const [decryptedCard, setDecryptedCard] = useState('');

  // 🧠 YEAR 3: Accounting Ledger & Lock State Boxes
  const [recIdempotencyKey, setRecIdempotencyKey] = useState('idemp_rec_ticket_777');
  const [lockAccount, setLockAccount] = useState('acc_merchant_uber_01');
  const [debitAmount, setDebitAmount] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [latestReconciledTx, setLatestReconciledTx] = useState(null);

  const handleProcessOrchestratedPayment = async () => {
    try {
      setError(''); setSuccess('');
      if (!amount || !cardToken || !idempotencyKey) { setError('Missing required charge parameters!'); return; }
      const gatewayStatusOverride = { Stripe: { healthy: stripeHealthy, baseFeePercent: 2.9 }, Adyen: { healthy: true, baseFeePercent: 3.5 } };
      const response = await fetch('http://localhost:3000/api/charges/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
        body: JSON.stringify({ amount: Number(amount), currency, cardToken, gatewayStatusOverride })
      });
      const data = await response.json();
      if (response.ok) {
        let alertPrefix = data.failoverTriggered ? '⚠️ FAILOVER RECOVERY ACTIVE' : '🟢 OPTIMAL ROUTE';
        if (data.isDuplicateCachedResponse) alertPrefix = '🛑 IDEMPOTENCY LOCK';
        setSuccess(`Transaction Settled! [${alertPrefix}] Code: ${data.chargeId} via ${data.gatewayUsed} (Fee: $${data.feeCharged})`);
        setTransactions((prev) => [data, ...prev]);
      } else { setError(data.error); }
    } catch { setError('Connection lost to orchestration core gate.'); }
  };

  // 🧠 YEAR 3: Network Action: Dispatches a balanced Double-Entry Ledger Block
  const handleReconcileLedger = async () => {
    try {
      setError(''); setSuccess(''); setLatestReconciledTx(null);
      if (!lockAccount || !debitAmount || !creditAmount || !recIdempotencyKey) { setError('All reconciliation parameters required!'); return; }

      const response = await fetch('http://localhost:3000/api/ledger/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': recIdempotencyKey },
        body: JSON.stringify({
          lockAccountId: lockAccount,
          debits: [{ accountId: 'acc_cash_vault', amount: Number(debitAmount) }],
          credits: [{ accountId: 'acc_accounts_receivable', amount: Number(creditAmount) }]
        })
      });

      const data = await response.json();
      if (response.ok) {
        setLatestReconciledTx(data);
        setSuccess(`Ledger Audit Passed! Transaction ${data.transactionId} Reconciled and Locked under zero race-condition matrix.`);
        setDebitAmount(''); setCreditAmount('');
        setRecIdempotencyKey('idemp_rec_ticket_' + Math.floor(Math.random() * 1000));
      } else { setError(data.error); }
    } catch { setError('Ledger gateway reconciliation handshake failure.'); }
  };

  const handleVaultTokenize = async () => {
    try {
      setError(''); setSuccess(''); setVaultResult(null);
      if (!rawCard) { setError('Please enter a card number to encrypt!'); return; }
      const response = await fetch('http://localhost:3000/api/vault/tokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber: rawCard })
      });
      const data = await response.json();
      if (response.ok) { setVaultResult(data); setSuccess('Card encrypted successfully.'); } else { setError(data.error); }
    } catch { setError('Vault tokenization engine offline.'); }
  };

  const handleVaultDecrypt = async () => {
    try {
      setError(''); setSuccess(''); setDecryptedCard('');
      if (!cipherText) { setError('Please paste a cipher text string to decode!'); return; }
      const response = await fetch('http://localhost:3000/api/vault/detokenize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedPayload: cipherText })
      });
      const data = await response.json();
      if (response.ok) { setDecryptedCard(data.cardNumber); setSuccess('Decryption verified.'); } else { setError(data.error); }
    } catch { setError('Vault decryption pipeline rejected request.'); }
  };

  return (
    <div style={{ fontFamily: 'monospace', backgroundColor: '#0f172a', minHeight: '100vh', padding: '50px 20px', color: '#e2e8f0' }}>
      <center>
        <div style={{ textAlign: 'left', maxWidth: '1050px', marginBottom: '25px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>💎 Year 3 Complete FinTech Ecosystem Deployment</span>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '2.5rem', color: '#f8fafc', fontWeight: '800' }}>💳 NEXUSPAY MASTER CORE</h1>
        </div>

        {error && <p style={{ color: '#f87171', backgroundColor: '#7f1d1d', padding: '12px', borderRadius: '8px', maxWidth: '1050px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #b91c1c' }}>⚠️ ERROR_LOG: {error}</p>}
        {success && <p style={{ color: '#4ade80', backgroundColor: '#064e3b', padding: '12px', borderRadius: '8px', maxWidth: '1050px', textAlign: 'left', fontWeight: 'bold', border: '1px solid #047857' }}>🎉 CORE_LOG: {success}</p>}

        {/* --- Main 3-Column Enterprise Workspace Dashboard Grid --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', width: '100%', maxWidth: '1050px', textAlign: 'left', marginTop: '25px' }}>
          
          {/* COLUMN 1: PAYMENT FORM & SETTLED LEDGER HISTORY STREAM */}
          <div>
            <PaymentOrderForm 
              idempotencyKey={idempotencyKey} setIdempotencyKey={setIdempotencyKey}
              amount={amount} setAmount={setAmount}
              currency={currency} setCurrency={setCurrency}
              cardToken={cardToken} setCardToken={setCardToken}
              stripeHealthy={stripeHealthy} setStripeHealthy={setStripeHealthy}
              handleProcessOrchestratedPayment={handleProcessOrchestratedPayment}
            />

            <h4 style={{ color: '#94a3b8', margin: '20px 0 10px 0' }}>Active Transaction Routing Ledger:</h4>
            {transactions.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.9rem' }}>No automated settlement entries logged inside this session grid.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto' }}>
                {transactions.map((tx, index) => (
                  <div key={index} style={{ padding: '12px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🆔 <b>TX:</b> {tx.chargeId} via <b style={{ color: '#38bdf8' }}>{tx.gatewayUsed}</b></span>
                    <span style={{ color: tx.failoverTriggered ? '#f87171' : '#4ade80' }}>
                      {tx.failoverTriggered ? '⚠️ FAILOVER' : '🟢 OPTIMAL'} (${tx.amount})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMN 2: CRYPTOGRAPHIC VAULTS & DOUBLE-ENTRY LEDGER MONITORS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <TokenVaultPanel 
              rawCard={rawCard} setRawCard={setRawCard}
              handleVaultTokenize={handleVaultTokenize} vaultResult={vaultResult}
              cipherText={cipherText} setCipherText={setCipherText}
              handleVaultDecrypt={handleVaultDecrypt} decryptedCard={decryptedCard}
            />

            <AccountingLedgerMonitor 
              recIdempotencyKey={recIdempotencyKey} setRecIdempotencyKey={setRecIdempotencyKey}
              lockAccount={lockAccount} setLockAccount={setLockAccount}
              debitAmount={debitAmount} setDebitAmount={setDebitAmount}
              creditAmount={creditAmount} setCreditAmount={setCreditAmount}
              handleReconcileLedger={handleReconcileLedger}
              latestReconciledTx={latestReconciledTx}
            />
          </div>

        </div>
      </center>
    </div>
  );
}
