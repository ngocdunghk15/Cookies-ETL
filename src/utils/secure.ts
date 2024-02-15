import CryptoJS from 'crypto-js';

export function encryptPayload( payload: any, password: string ) {
	try {
		const payloadString = typeof payload === 'string' ? payload : JSON.stringify(payload);
		const encrypted = CryptoJS.AES.encrypt(payloadString, password);
		const encryptedString = encrypted.toString();
		return encryptedString;
	} catch (error) {
		console.error('Error encrypting payload:', error.message);
		throw error;
	}
}
