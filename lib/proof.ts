import { Credential } from '@/store/auth-store';
import { VerificationRequest } from './qr-protocol';
// import { groth16 } from 'snarkjs'; // Moved to lazy-import inside generateProof
import { Asset } from 'expo-asset';
import { commitAttribute } from './hashing';
import * as FileSystem from 'expo-file-system';

export interface ProofPayload {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
    protocol: string;
    curve: string;
    publicSignals: string[];
}

/**
 * Generates a Zero-Knowledge Proof for the Age Verification circuit.
 */
export async function generateProof(
    request: VerificationRequest,
    credential: Credential,
    salt: string
): Promise<ProofPayload> {

    console.log("Loading ZK engine...");
    const { groth16 } = require('snarkjs');
    console.log("Starting REAL ZK proof generation...");

    const currentYear = new Date().getFullYear();
    const minAge = 18;

    const birthYearAttribute = credential.attributes['birth_year'] || credential.attributes['year_of_birth'];
    if (!birthYearAttribute) {
        // FALLBACK for demo if birth_year is missing (e.g. from government docs flow)
        // In production, issuance MUST include birth_year
        console.warn("Credential missing birth_year, using dummy value for demo");
    }

    const birthYear = Number(birthYearAttribute || 2000);

    // Re-calculate commitment to ensure validity
    const commitment = commitAttribute(birthYear, salt);

    // Inputs matching the circuit
    const inputs = {
        currentYear: currentYear,
        minAge: minAge,
        birthYear: birthYear,
        salt: salt,
        commitment: commitment
    };

    // Load Circuit Assets
    const wasmAsset = Asset.fromModule(require('../circuits/age_check_js/age_check.wasm'));
    const zkeyAsset = Asset.fromModule(require('../circuits/age_check_final.zkey'));

    await Promise.all([wasmAsset.downloadAsync(), zkeyAsset.downloadAsync()]);

    if (!wasmAsset.localUri || !zkeyAsset.localUri) {
        throw new Error("Failed to load circuit assets");
    }

    // Read assets as base64 and convert to Uint8Array/Buffer
    // This is necessary because snarkjs in a 'browser' env (mocked fs) cannot read file paths directly.
    console.log("Reading circuit assets into memory...");
    const wasmB64 = await FileSystem.readAsStringAsync(wasmAsset.localUri, { encoding: 'base64' });
    const zkeyB64 = await FileSystem.readAsStringAsync(zkeyAsset.localUri, { encoding: 'base64' });

    // Create Uint8Array from base64 (Buffer polyfill handles this)
    const wasmBuffer = new Uint8Array(Buffer.from(wasmB64, 'base64'));
    const zkeyBuffer = new Uint8Array(Buffer.from(zkeyB64, 'base64'));

    console.log(`Assets loaded. WASM: ${wasmBuffer.length} bytes, ZKey: ${zkeyBuffer.length} bytes`);

    // Generate Proof
    console.log("Computing Witness & Proof...");
    const { proof, publicSignals } = await groth16.fullProve(
        inputs,
        wasmBuffer,
        zkeyBuffer
    );

    console.log("Proof Generated Successfully!");

    return {
        pi_a: proof.pi_a,
        pi_b: proof.pi_b,
        pi_c: proof.pi_c,
        protocol: proof.protocol,
        curve: proof.curve,
        publicSignals: publicSignals
    };
}
