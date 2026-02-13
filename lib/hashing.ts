import { buildPoseidon } from 'circomlibjs';

let poseidon: any = null;

/**
 * Initializes the Poseidon hash library.
 */
export async function initPoseidon() {
    if (poseidon) return;
    try {
        poseidon = await buildPoseidon();
        console.log("Poseidon Initialized");
    } catch (error) {
        console.error("Failed to initialize Poseidon:", error);
    }
}

/**
 * Computes a Poseidon hash of an array of inputs.
 */
export function poseidonHash(inputs: (bigint | number | string)[]): string {
    if (!poseidon) throw new Error("Poseidon not initialized");

    const bigIntInputs = inputs.map(i => BigInt(i));
    const hash = poseidon(bigIntInputs);
    return poseidon.F.toString(hash);
}

/**
 * Creates a commitment for a specific attribute value.
 * Commitment = Poseidon([value, salt])
 */
export function commitAttribute(value: string | number | boolean, salt: string): string {
    const val = BigInt(value);
    const s = BigInt(salt);
    return poseidonHash([val, s]);
}
