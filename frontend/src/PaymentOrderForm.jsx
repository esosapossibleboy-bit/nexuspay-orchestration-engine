import React from 'react';

export default function PaymentOrderForm({
  idempotencyKey, setIdempotencyKey,
  amount, setAmount,
  currency, setCurrency,
  cardToken, setCardToken,
  stripeHealthy, setStripeHealthy,
  handleProcessOrchestratedPayment
}) {
  return (
    <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '25px' }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem', color: '#38bdf8', borderBottom: '2px solid #334155', paddingBottom: '10px' }}>
        🧾 Process Smart Payment Order
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label htmlFor="idemp-key-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Unique Transaction Idempotency Key</label>
        <input id="idemp-key-input" type="text" value={idempotencyKey} onChange={(e) => setIdempotencyKey(e.target.value)} style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', fontWeight: 'bold' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label htmlFor="amount-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Amount</label>
            <input id="amount-input" type="number" placeholder="e.g. 150" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '85%' }} />
          </div>
          <div>
            <label htmlFor="currency-select" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Currency</label>
            <select id="currency-select" value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none', width: '100%' }}>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </div>

        <label htmlFor="card-token-input" style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#94a3b8' }}>Vault Customer Card Token</label>
        <input id="card-token-input" type="text" value={cardToken} onChange={(e) => setCardToken(e.target.value)} style={{ backgroundColor: '#0f172a', color: 'white', padding: '10px', borderRadius: '6px', border: '1px solid #475569', outline: 'none' }} />

        {/* 🛰️ SERVER INFRASTRUCTURE FAILOVER INTERCEPTOR */}
        <div style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '5px 0' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#f8fafc', display: 'block' }}>🛰️ Stripe Server Infrastructure Switch</span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Toggle off to trigger a critical provider failover event</span>
          </div>
          <button 
            onClick={() => setStripeHealthy(!stripeHealthy)} 
            style={{ padding: '6px 12px', backgroundColor: stripeHealthy ? '#064e3b' : '#7f1d1d', color: stripeHealthy ? '#4ade80' : '#f87171', border: `1px solid ${stripeHealthy ? '#047857' : '#b91c1c'}`, borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {stripeHealthy ? '🟢 HEALTHY' : '🔴 OUTAGE OUTAGE'}
          </button>
        </div>

        <button onClick={handleProcessOrchestratedPayment} style={{ padding: '14px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '5px' }}>
          Execute Orchestrated Charge Routing
        </button>
      </div>
    </div>
  );
}
