import React from 'react';

export default function TokenVaultPanel({
  rawCard, setRawCard,
  handleVaultTokenize,
  vaultResult,
  cipherText, setCipherText,
  handleVaultDecrypt,
  decryptedCard
}) {
  return (
    <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', color: '#1e293b' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', fontSize: '1.2rem' }}>
        🔐 PCI-DSS Tokenization Vault Bench
      </h3>
      
      {/* SECTION A: CARD TOKENIZATION */}
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Raw Credit Card Number (PAN)</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="e.g. 4111222233334444" 
            value={rawCard} 
            onChange={(e) => setRawCard(e.target.value)} 
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
          <button onClick={handleVaultTokenize} style={{ padding: '10px 16px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Encrypt
          </button>
        </div>

        {vaultResult && (
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: '2px 0' }}><b>Generated Token:</b> <code style={{ color: '#0ea5e9', fontWeight: 'bold' }}>{vaultResult.token}</code></p>
            <p style={{ margin: '2px 0', wordBreak: 'break-all' }}><b>GCM Payload:</b> <code style={{ color: '#64748b' }}>{vaultResult.encryptedPayload}</code></p>
          </div>
        )}
      </div>

      {/* SECTION B: CARD DECRYPTION */}
      <div>
        <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', display: 'block', marginBottom: '6px' }}>Decrypt GCM Cipher String</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Paste raw GCM payload bundle..." 
            value={cipherText} 
            onChange={(e) => setCipherText(e.target.value)} 
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} 
          />
          <button onClick={handleVaultDecrypt} style={{ padding: '10px 16px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Decrypt
          </button>
        </div>

        {decryptedCard && (
          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #bbf7d0', color: '#15803d' }}>
            🎉 <b>Restored Card PAN:</b> <code>{decryptedCard}</code>
          </div>
        )}
      </div>

    </div>
  );
}
