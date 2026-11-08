import crypto from 'crypto';

// Master FinTech Security Key (In production environments, this lives strictly inside secret env variables!)
const VAULT_KEY = crypto.scryptSync('secret-fintech-orchestration-pass', 'salt-stamp-99', 32);
const ALGORITHM = 'aes-256-gcm'; // Strictest authenticated token encryption algorithm

/**
 * Tokenizes and cryptographically encrypts raw credit card payload rows using authenticated AES-256-GCM.
 * @param {string} cardNumber - 16-character credit card cleartext string lines
 * @returns {Object} { token: string, encryptedPayload: string }
 */
export function tokenizeCard(cardNumber) {
  const iv = crypto.randomBytes(12); // GCM standard initial vector byte size length
  const cipher = crypto.createCipheriv(ALGORITHM, VAULT_KEY, iv);

  let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Capture our unique authenticated tag verification signature block!
  const authTag = cipher.getAuthTag().toString('hex');

  // Combine IV, AuthTag, and Ciphertext together cleanly using colons
  const combinedPayload = `${iv.toString('hex')}:${authTag}:${encrypted}`;

  // Generate a safe tracking token matching the card's ending numbers
  const lastFour = cardNumber.slice(-4);
  const safeToken = `tok_visa_${lastFour}`;

  return {
    token: safeToken,
    encryptedPayload: combinedPayload
  };
}

/**
 * Decrypts authenticated GCM payload tokens back into readable string entries.
 * @param {string} encryptedPayload - Combined "iv:authTag:ciphertext" string token block
 * @returns {string} Restored plain text credit card string entry
 */
export function detokenizeCard(encryptedPayload) {
  const parts = encryptedPayload.split(':');
  
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const ciphertext = Buffer.from(parts[2], 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, VAULT_KEY, iv);
  decipher.setAuthTag(authTag); // 🛡️ CRITICAL CHECK: Verify file signature integrity before decrypting!

  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
