const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * Generate a random encryption key
 */
function generateKey() {
  return crypto.randomBytes(KEY_LENGTH);
}

/**
 * Generate a random initialization vector
 */
function generateIV() {
  return crypto.randomBytes(IV_LENGTH);
}

/**
 * Encrypt data using AES-256-GCM
 * @param {Buffer} data - Data to encrypt
 * @param {Buffer} key - Optional encryption key (generates new one if not provided)
 * @returns {Object} - Encrypted data with key, iv, and authTag
 */
function encrypt(data, key = null) {
  try {
    const encryptionKey = key || generateKey();
    const iv = generateIV();
    
    const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    return {
      data: encrypted,
      key: encryptionKey.toString('base64'),
      iv: iv.toString('base64'),
      authTag: authTag.toString('base64')
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param {Object} encryptedData - Object containing encrypted data, key, iv, and authTag
 * @returns {Buffer} - Decrypted data
 */
function decrypt(encryptedData) {
  try {
    const { data, key, iv, authTag } = encryptedData;
    
    const keyBuffer = Buffer.from(key, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const authTagBuffer = authTag ? Buffer.from(authTag, 'base64') : null;
    
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, ivBuffer);
    
    if (authTagBuffer) {
      decipher.setAuthTag(authTagBuffer);
    }
    
    const decrypted = Buffer.concat([
      decipher.update(data),
      decipher.final()
    ]);
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Hash data using SHA-256
 * @param {string|Buffer} data - Data to hash
 * @returns {string} - Hash in hexadecimal format
 */
function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a secure random token
 * @param {number} length - Token length in bytes
 * @returns {string} - Random token in hexadecimal format
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

module.exports = {
  encrypt,
  decrypt,
  hash,
  generateKey,
  generateIV,
  generateToken
};
