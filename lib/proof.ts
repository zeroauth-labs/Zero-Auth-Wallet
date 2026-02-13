import { Credential } from '@/store/auth-store';
import { VerificationRequest } from './qr-protocol';
// import { groth16 } from 'snarkjs'; // DISABLED
// import { Asset } from 'expo-asset'; // DISABLED
// import { poseidonHash } from './hashing'; // DISABLED
// import * as FileSystem from 'expo-file-system'; // DISABLED
// import { Platform } from 'react-native'; // DISABLED

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
 * MOCK IMPLEMENTATION due to snarkjs/circomlibjs installation value.
 */
export async function generateProof(
    request: VerificationRequest,
    credential: Credential,
    salt: string
): Promise<ProofPayload> {

    console.log("Starting proof generation (MOCK)...");

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentYear = new Date().getFullYear();
    const minAge = 18;

    const birthYearAttribute = credential.attributes['birth_year'] || credential.attributes['year_of_birth'] || 2000;
    const birthYear = Number(birthYearAttribute);

    if (!birthYear) throw new Error("Credential missing birth year");

    // Inputs matching the circuit
    const inputs = {
        currentYear: currentYear,
        minAge: minAge,
        birthYear: birthYear,
        salt: salt,
        commitment: "0xMockCommitment"
    };

    console.log("Circuit Inputs:", inputs);

    return {
        pi_a: ["123", "456", "789"],
        pi_b: [["1", "2"], ["3", "4"]],
        pi_c: ["9", "8"],
        protocol: "groth16",
        curve: "bn128",
        publicSignals: [
            inputs.currentYear.toString(),
            inputs.minAge.toString(),
            inputs.commitment
        ]
    };
}
