import { expect, test } from 'vitest';
import { tokenizeCard, detokenizeCard } from './vault.js'; // We will build this file next!

test('PCI-DSS Cryptographic Security: Credit card numbers must be completely scrambled into authenticated GCM ciphertext', () => {
  const rawCardNumber = '4111222233334444'; // Standard Visa placeholder string

  // 1. Act: Tokenize and encrypt the credit card number payload
  const tokenReport = tokenizeCard(rawCardNumber);

  // 2. Assert: Verify the raw plaintext card number is destroyed and mapped to a safe token string
  expect(tokenReport.token).toBeDefined();
  expect(tokenReport.token.startsWith('tok_')).toBe(true);
  expect(tokenReport.encryptedPayload).not.toContain(rawCardNumber); // Asserts cleartext is gone!

  // 3. Act: Detokenize the secure hex string payload using our GCM cipher engine keys
  const decryptedCardNumber = detokenizeCard(tokenReport.encryptedPayload);

  // 4. Assert: Verify that our authorized decryption handshake perfectly restores the cleartext card number
  expect(decryptedCardNumber).toBe(rawCardNumber);
});
