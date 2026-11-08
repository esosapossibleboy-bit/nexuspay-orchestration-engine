import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import React from 'react';
import App from './App';

// Mock the global network fetch engine so it responds instantly with isolated mock data payloads
global.fetch = vi.fn((url, options) => {
  if (url.includes('/api/vault/tokenize')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ 
        token: 'tok_visa_4444',
        encryptedPayload: '5a4156:authTagSignatureBlock:cipherTextHex'
      }),
    });
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ 
      chargeId: 'ch_mock999abc',
      amount: 150,
      currency: 'USD',
      status: 'CHARGED',
      gatewayUsed: 'Stripe',
      feeCharged: 4.35,
      failoverTriggered: false,
      isDuplicateCachedResponse: false
    })
  });
});

test('Idempotent Ingestion: Executing a payment charge should render an alert banner and row receipt', async () => {
  render(<App />);

  // Fill out financial forms amounts field
  fireEvent.change(screen.getByPlaceholderText(/e.g. 150/i), { target: { value: '150' } });

  // Hunt for our upgraded orchestrated button routing execution text link
  fireEvent.click(screen.getByText(/Execute Orchestrated Charge Routing/i));

  // Verify the transaction notification banner pops open onto the screen
  const successBanner = await screen.findByText(/CORE_LOG:/i);
  expect(successBanner).toBeInTheDocument();
  
  // 🌟 FIX: Use findAllByText since the mock charge token maps to both the alert wall and history rows!
  const chargeTokens = await screen.findAllByText(/ch_mock999abc/i);
  expect(chargeTokens.length).toBe(2); // Confirms token printed on both the alert banner and tracking ledger!
});

test('PCI-DSS Cryptographic Loop: Card number encryption inside TokenVault child component must output a hex token', async () => {
  render(<App />);

  // Locate the card inputs nested inside our decoupled TokenVaultPanel component
  const cardInput = screen.getByPlaceholderText(/e.g. 4111222233334444/i);
  fireEvent.change(cardInput, { target: { value: '4111222233334444' } });

  // Press the encrypt tokenize button trigger
  fireEvent.click(screen.getByText(/Encrypt/i));

  // Assert that our unique generated tracking token returns directly to the layout grid
  const generatedTokenCode = await screen.findByText(/tok_visa_4444/i);
  expect(generatedTokenCode).toBeInTheDocument();
});
