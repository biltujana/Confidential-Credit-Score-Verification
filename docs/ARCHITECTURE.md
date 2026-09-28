# Confidential Credit Score Verification (CCSV) - Architecture Specification

## Overview

Confidential Credit Score Verification (CCSV) is a privacy-first decentralized credit qualification system engineered for the Midnight Network. It enables borrowers to prove to lenders, financial institutions, and DeFi protocols that they meet specific lending tier criteria (e.g. Credit Score >= 720, Debt-to-Income <= 40%, zero active defaults) without ever exposing their raw credit score, exact debt balances, account numbers, or personal identifying information.

`	ext
Borrower Browser (Client)
   |
   +---> Local Credential / Private Witness (Score, Bureau Attestation, DTI, Delinquency flags)
   |        |
   |        v
   |     Midnight Compact ZK Circuit (evaluates scoreAboveThreshold && noActiveDefault)
   |        |
   |        v
   |     Midnight Wallet (1AM) + Proof Server
   |        |
   |        v
   +---> Finalized Public Receipt (Contract Address, Tx Hash, One-Time Nullifier, Block Height)
            |
            v
   FastAPI Receipt Registry + Midnight Indexer
            |
            v
   Lender / Verifier (Learns only: ELIGIBLE = TRUE, Valid Bureau Signature, Unused Nullifier)
`

## Core Architectural Pillars

### 1. Client-Side Zero-Knowledge Witness
- All sensitive financial data resides exclusively within the borrower's local browser memory or secure hardware enclave.
- The witness supplies:
  - CreditScoreCredential containing boolean predicates signed by an authorized bureau:
    - scoreAboveThreshold: Boolean
    - noActiveDefault: Boolean
  - HolderSecret: A 32-byte cryptographic secret known only to the borrower.
  - Schnorr_SchnorrSignature: A Jubjub-Schnorr signature issued by a registered bureau (e.g., Experian, Equifax, TransUnion).
  - issuerId: Registered numerical identifier of the bureau.

### 2. Midnight Compact Smart Contract (CreditScoreVerification.compact)
- The Compact contract formalizes the verification rules:
  - policyHash: Public cryptographic commitment to the lending rules (minimum score, maximum DTI).
  - trustedIssuers: Mapping of approved bureau IDs to Jubjub public keys.
  - usedNullifiers: Public set of consumed one-time nullifiers preventing double-spending / multi-loan replay attacks.
  - finalizedProofs: Ledger counter tracking verified credit qualifications.
  - proveEligibility(nonce: Bytes<32>): Boolean: Public circuit verifying that:
    1. The bureau signature is cryptographically valid under the bureau's Jubjub public key.
    2. The predicates scoreAboveThreshold and noActiveDefault evaluate to true.
    3. The derived nullifier has not been previously consumed on the public ledger.

### 3. Replay Protection & Nullifier Derivation
- To prevent a borrower from re-submitting a single qualification proof across dozens of simultaneous unapproved loan applications, each proof produces an on-chain nullifier:
  Nullifier = persistentHash([pad(32, 'creditscore:nullifier:v1'), holderSecret, nonce, policyHash])
- Because holderSecret is private, external observers cannot link nullifiers to borrower identities or link separate applications from the same borrower.

### 4. Public Receipt Registry (FastAPI + SQLAlchemy)
- The backend serves as a public receipt aggregator and audit log for finalized transactions.
- Zero private data policy:
  - Requests containing SSNs, raw credit scores, account balances, or private witness keys are immediately rejected with HTTP 422.
  - Only immutable chain metadata (transaction_id, transaction_hash, contract_address, block_height, nullifier) is recorded.
