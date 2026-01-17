/**
 * Field Encryption Utilities
 * 
 * Encrypts/decrypts sensitive PII fields (emails, etc.)
 * Uses AES-256-GCM for authenticated encryption
 */

import crypto from 'crypto';
import { logger } from '@/lib/logger';

const ENCRYPTION_KEY = process.env.FIELD_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';

if (!ENCRYPTION_KEY) {
    logger.warn('FIELD_ENCRYPTION_KEY not set - encryption will fail. Set a 32-byte hex key.');
}

/**
 * Validate encryption key format
 */
function validateKey(): void {
    if (!ENCRYPTION_KEY) {
        throw new Error('Encryption key not configured. Set FIELD_ENCRYPTION_KEY or ENCRYPTION_KEY environment variable.');
    }
    
    // Key should be 64 hex characters (32 bytes)
    if (!/^[0-9a-f]{64}$/i.test(ENCRYPTION_KEY)) {
        throw new Error('Encryption key must be 64 hex characters (32 bytes).');
    }
}

/**
 * Encrypt a field value
 * 
 * Format: iv:authTag:encryptedData (all hex)
 */
export function encryptField(value: string): string {
    if (!value) {
        return value; // Don't encrypt empty values
    }

    try {
        validateKey();

        const key = Buffer.from(ENCRYPTION_KEY!, 'hex');
        const iv = crypto.randomBytes(16); // 128-bit IV
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

        let encrypted = cipher.update(value, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag();

        // Format: iv:authTag:encryptedData
        return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    } catch (error) {
        logger.error('Failed to encrypt field', error as Error);
        throw new Error('Encryption failed');
    }
}

/**
 * Decrypt a field value
 * 
 * Format: iv:authTag:encryptedData (all hex)
 */
export function decryptField(encrypted: string): string {
    if (!encrypted) {
        return encrypted; // Don't decrypt empty values
    }

    // Check if value is already decrypted (not in encrypted format)
    if (!encrypted.includes(':')) {
        // Might be a legacy unencrypted value
        return encrypted;
    }

    try {
        validateKey();

        const parts = encrypted.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted format');
        }

        const [ivHex, authTagHex, encryptedData] = parts;
        const key = Buffer.from(ENCRYPTION_KEY!, 'hex');
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        logger.error('Failed to decrypt field', error as Error);
        // Return original value if decryption fails (might be legacy unencrypted)
        return encrypted;
    }
}

/**
 * Check if a value is encrypted
 */
export function isEncrypted(value: string): boolean {
    if (!value) return false;
    
    // Encrypted format: iv:authTag:encryptedData (all hex, colon-separated)
    const parts = value.split(':');
    return parts.length === 3 && parts.every(part => /^[0-9a-f]+$/i.test(part));
}

/**
 * Encrypt multiple fields in an object
 */
export function encryptFields<T extends Record<string, any>>(
    obj: T,
    fieldsToEncrypt: (keyof T)[]
): T {
    const encrypted = { ...obj };
    
    for (const field of fieldsToEncrypt) {
        const value = encrypted[field];
        if (value && typeof value === 'string') {
            (encrypted as any)[field] = encryptField(value);
        }
    }
    
    return encrypted;
}

/**
 * Decrypt multiple fields in an object
 */
export function decryptFields<T extends Record<string, any>>(
    obj: T,
    fieldsToDecrypt: (keyof T)[]
): T {
    const decrypted = { ...obj };
    
    for (const field of fieldsToDecrypt) {
        const value = decrypted[field];
        if (value && typeof value === 'string') {
            (decrypted as any)[field] = decryptField(value);
        }
    }
    
    return decrypted;
}

/**
 * Generate a secure encryption key (64 hex characters = 32 bytes)
 * Use this once to generate a key, then store it securely in environment variables
 */
export function generateEncryptionKey(): string {
    const key = crypto.randomBytes(32); // 256 bits
    return key.toString('hex');
}
