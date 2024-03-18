import CryptoJS from 'crypto-js';

export function encryptPayload(payload: any, password: string) {
  try {
    const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const encrypted = CryptoJS.AES.encrypt(payloadString, password);
    return encrypted.toString();
  } catch (error) {
    console.error('Error encrypting payload:', error.message);
    throw error;
  }
}

export function decryptPayload(encryptedPayload: any, password: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPayload, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Error decrypting payload:', error.message);
    throw error;
  }
}
