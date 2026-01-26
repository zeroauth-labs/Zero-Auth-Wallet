import { ed25519 } from '@noble/curves/ed25519';
import { bytesToHex } from '@noble/hashes/utils';
import { decode as fromBase64, encode as toBase64 } from '@stablelib/base64';
import { getRandomValues } from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const PRIVATE_KEY_ALIAS = 'zero_auth_sk';

// Polyfill for random values
// @ts-ignore
if (!global.crypto) global.crypto = {};
// @ts-ignore
if (!global.crypto.getRandomValues) global.crypto.getRandomValues = getRandomValues;

/**
 * Generates a new Ed25519 keypair and persists the private key.
 */
export async function generateAndStoreIdentity(): Promise<{ publicKey: Uint8Array; did: string }> {
    // 1. Generate Private Key (32 random bytes)
    const privateKey = new Uint8Array(32);
    getRandomValues(privateKey);

    // 2. Derive Public Key
    const publicKey = ed25519.getPublicKey(privateKey);

    // 3. Store Private Key securely
    await SecureStore.setItemAsync(PRIVATE_KEY_ALIAS, toBase64(privateKey), {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });

    const did = deriveDID(publicKey);

    // SECURITY WARNING: LOGGING KEYS FOR DEV PURPOSES ONLY
    console.log('\n--- 🔐 ZERO AUTH NEW WALLET 🔐 ---');
    console.log('DID:', did);
    console.log('Public Key (Hex):', bytesToHex(publicKey));
    console.log('Private Key (Hex):', bytesToHex(privateKey));
    console.log('----------------------------------\n');

    // 4. Return Public Info
    return {
        publicKey,
        did: did,
    };
}

/**
 * Checks if a wallet identity already exists.
 */
export async function isWalletInitialized(): Promise<boolean> {
    const stored = await SecureStore.getItemAsync(PRIVATE_KEY_ALIAS);
    return !!stored;
}

/**
 * Retrieves the public key and DID from the stored private key.
 */
export async function getWalletIdentity(): Promise<{ publicKey: Uint8Array; did: string } | null> {
    const storedSk = await SecureStore.getItemAsync(PRIVATE_KEY_ALIAS);
    if (!storedSk) return null;

    try {
        const privateKey = fromBase64(storedSk);
        const publicKey = ed25519.getPublicKey(privateKey);
        return {
            publicKey,
            did: deriveDID(publicKey),
        };
    } catch (e) {
        console.error('Failed to restore wallet identity:', e);
        return null;
    }
}

/**
 * Signs a message with the stored private key.
 */
export async function signMessage(message: Uint8Array | string): Promise<Uint8Array> {
    const storedSk = await SecureStore.getItemAsync(PRIVATE_KEY_ALIAS);
    if (!storedSk) throw new Error('Wallet not initialized');

    const privateKey = fromBase64(storedSk);
    const msgBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;

    return ed25519.sign(msgBytes, privateKey);
}

/**
 * Purges the wallet (irreversible!).
 */
export async function purgeWallet(): Promise<void> {
    await SecureStore.deleteItemAsync(PRIVATE_KEY_ALIAS);
}

/**
 * Derives a did:key from an Ed25519 public key.
 */
export function deriveDID(publicKey: Uint8Array): string {
    const hex = bytesToHex(publicKey).substring(0, 16);
    return `did:key:z6Mk...${hex}`;
}
