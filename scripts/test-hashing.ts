import { commitAttribute, initPoseidon, poseidonHash } from '../lib/hashing.ts';

async function main() {
    console.log("Initializing Poseidon...");
    await initPoseidon();

    console.log("--- Testing Basic Hashing ---");
    const h1 = poseidonHash([1, 2]);
    console.log("Poseidon([1, 2]):", h1);

    // Test known value if possible, or just consistency
    // e.g. h(1, 2) should be deterministic

    console.log("\n--- Testing Attribute Commitments ---");
    const salt = "123456789";
    const ageCommitment = commitAttribute(25, salt); // Age 25
    console.log(`Commitment(Age=25, Salt=${salt}):`, ageCommitment);

    const birthYearCommitment = commitAttribute(2000, salt); // Birth Year 2000
    console.log(`Commitment(Year=2000, Salt=${salt}):`, birthYearCommitment);

    console.log("\n✅ Hashing verification complete.");
}

main().catch(console.error);
