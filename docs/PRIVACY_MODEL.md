# Confidential Credit Score Verification - Privacy Model & Threat Analysis

## Executive Summary

Traditional credit scoring systems require borrowers to disclose their complete financial dossiers: Full Social Security Numbers (SSN), exact 3-digit credit scores, outstanding credit card balances, mortgage payment histories, and employer records. Every loan application exposes this sensitive personal financial information (PII/PFI) to lenders, brokers, loan officers, and third-party processors, creating massive systemic attack surfaces (e.g. the 2017 Equifax data breach affecting 147 million consumers).

Confidential Credit Score Verification (CCSV) replaces this insecure paradigm with Zero-Knowledge Selective Disclosure powered by Midnight Network.

## Privacy Boundaries

| Attribute | State | Location | Disclosed to Lender / Public Chain? |
|---|---|---|---|
| Raw Credit Score (e.g., 785) | Private | Local Client Witness | NEVER |
| Account Balances & Credit Limits | Private | Local Client Witness | NEVER |
| Social Security Number (SSN) | Private | Local Client Witness | NEVER |
| Full Payment History | Private | Local Client Witness | NEVER |
| Holder Secret Keypair | Private | Local Browser Profile | NEVER |
| Bureau Digital Signature | Zero-Knowledge | Evaluated in ZK Circuit | Witness only; verified mathematically |
| Policy Compliance (score >= 720) | Public | Disclosed in Ledger State | YES (Boolean: Eligible = true) |
| Bureau Public Key Identity | Public | Midnight Public Ledger | YES (Issuer ID #101 - Experian) |
| Transaction Hash & Block Height | Public | Midnight Public Ledger | YES |
| Replay Nullifier | Public | Midnight Public Ledger | YES (One-time spend token) |

## Threat Vectors and Mitigations

### 1. Replay Attacks across Multiple Lenders
- **Threat**: A borrower with an approved credit score snapshot applies for 10 simultaneous ,000 loans before any new debt is reported.
- **Mitigation**: The Midnight Compact circuit requires a fresh, lender-provided 32-byte 
once. The resulting public nullifier persistentHash(nullifier_tag, holderSecret, nonce, policyHash) is recorded on-chain in usedNullifiers. Any attempt to reuse the credential with the same loan request is rejected on-chain by ssert(!usedNullifiers.member(publicNullifier)).

### 2. Side-Channel Information Leakage via Gas or Execution Trace
- **Threat**: Differences in ZK proving time or execution branches reveal the approximate score value.
- **Mitigation**: Midnight circuits use constant-time constraint evaluation and fixed-size Jubjub-Schnorr verification curves. The prover computation depends only on the public policy parameters and cryptographic circuit structure, not on the magnitude of the credit score.

### 3. Regulatory Compliance (FCRA, GLBA, GDPR)
- **FCRA (Fair Credit Reporting Act)**: Borrowers retain strict ownership over who inspects their creditworthiness. Verifications are purpose-bound and non-transferable.
- **GDPR Article 25 (Data Protection by Design)**: No personal identifiers are stored or processed by intermediate nodes. The public receipt registry stores strictly zero private attributes (private_attributes_stored = 0).
