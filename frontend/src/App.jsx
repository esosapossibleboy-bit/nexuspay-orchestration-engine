import React, { useState } from 'react';
import TokenVaultPanel from './TokenVaultPanel';

export default function App() {
  // 1. 🧠 State Management Memory Boxes
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [cardToken, setCardToken] = useState('tok_visa_4444');
  const [idempotencyKey, setIdempotencyKey] = useState('idemp_test_key_101');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Tokenization shared states
  const [rawCard, setRawCard] = useState('');
  const [vaultResult, setVaultResult] = useState(null);
  const [cipherText, setCipherText] = useState('');
  const [decryptedCard, setDecryptedCard] = useState('');

  // 2. 📝 Network Action: Dispatches a payment request stamped with an Idempotency-Key
  const handleProcessPayment = async () => {
    try {
      setError(''); setSuccess('');
      if (!amount || !cardToken || !idempotencyKey) { setError('Missing required charge parameters!'); return; }

      const response = await fetch('http://localhost:3000/api/charges', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({ amount: Number(amount), currency, cardToken })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(`Transaction Processed! Status: ${data.status} ${data.isDuplicateCachedResponse ? '(⚠️ IDEMPOTENCY REPLAY LOGGED)' : '(🟢 UNIQUE CHARGE)'}`);
        setTransactions((prev) => [data, ...prev]);
      } else { setError(data.error); }
    } catch { setError('Connection lost to orchestration core gate.'); }
  };

  // 3. 🔐 Network Action: Request tokenization from backend routes
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
      if (response.ok) { setVaultResult(data); setSuccess('Card encrypted successfully.'); } 
      else { setError(data.error); }
    } catch { setError('Vault tokenization engine offline.'); }
  };

  // 4. 🔑 Network Action: Request decryption from backend vault cogs
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
      if (response.ok) { setDecryptedCard(data.cardNumber); setSuccess('Decryption verified.'); } 
      else { setError(data.error); }
    } catch { setError('Vault decryption pipeline rejected request.'); }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '50px 20px', color: '#0f172a' }}>
      <center>
        <div style={{ textAlign: 'left', maxWidth: '950px', marginBottom: '25px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '1px' }}>NexusPay Orchestration Infrastructure</span>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '2.2rem', color: '#0f172a', fontWeight: '800' }}>💳 Payment Routing Core</h1>
        </div>

        {error && <p style={{ color: '#b91c1c', backgroundColor: '#fee2e2', padding: '12px', borderRadius: '8px', maxWidth: '950px', textAlign: 'left', fontWeight: 'bold' }}>⚠️ ERROR: {error}</p>}
        {success && <p style={{ color: '#15803d', backgroundColor: '#dcfce7', padding: '12px', borderRadius: '8px', maxWidth: '950px', textAlign: 'left', fontWeight: 'bold' }}>🎉 SUCCESS: {success}</p>}

        {/* --- Main Workspace Layout Grid Grid --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', width: '100%', maxWidth: '950px', textAlign: 'left', marginTop: '25px' }}>
          
          {/* 🧾 LEFT COLUMN: PAYMENT INGESTION WORKSPACE & HISTORY */}
          <div>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>🧾 Process Payment Order</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Unique Transaction Idempotency Key</label>
                <input type="text" value={idempotencyKey} onChange={(e) => { setIdempotencyKey(e.target.value); }} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', color: '#0ea5e9', fontWeight: 'bold' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Amount</label>
                    <input type="number" placeholder="e.g. 150" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', width: '85%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '4px' }}>Currency</label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', backgroundColor: 'white' }}>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>

                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569' }}>Vault Customer Card Token</label>
                <input type="text" value={cardToken} onChange={(e) => setCardToken(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />

                <button onClick={handleProcessPayment} style={{ padding: '12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>
                  Execute Safe Charge Transaction
                </button>
              </div>
            </div>

            {/* Live Ledger History List */}
            <h4 style={{ color: '#475569', margin: '20px 0 10px 0' }}>Active Transaction Stream Ledger:</h4>
            {transactions.length === 0 ? (
              <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>No settlement rows logged inside this operational window track.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {transactions.map((tx, index) => (
                  <div key={index} style={{ padding: '12px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🆔 <b>ID:</b> {tx.chargeId}</span>
                    <span>💰 <b>Value:</b> {tx.amount} {tx.currency}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔒 RIGHT COLUMN: DECOUPLED CRYPTOGRAPHIC VAULT PANEL MODULE */}
          <TokenVaultPanel 
            rawCard={rawCard} setRawCard={setRawCard}
            handleVaultTokenize={handleVaultTokenize} vaultResult={vaultResult}
            cipherText={cipherText} setCipherText={setCipherText}
            handleVaultDecrypt={handleVaultDecrypt} decryptedCard={decryptedCard}
          />

        </div>
      </center>
    </div>
  );
}
