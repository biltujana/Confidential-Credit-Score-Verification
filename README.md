# Confidential Credit Score Verification (CCSV)

> **Privacy-Preserving Zero-Knowledge Credit Score Verification and Lending Compliance on Midnight Network**

[![Midnight Compact](https://img.shields.io/badge/Midnight-Compact%20v0.31.1-7c3aed.svg)](https://midnight.network)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-13%20Passed-success.svg)](https://vitest.dev/)
[![Backend](https://img.shields.io/badge/FastAPI-9%20Passed-success.svg)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

---

## 🔗 Live On-Chain Deployment & Verification

| Property | Details |
|---|---|
| **Demo Contract Address** | [`48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa`](https://explorer.1am.xyz/contract/48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa) |
| **Demo 1AM Explorer** | [https://explorer.1am.xyz/contract/48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa](https://explorer.1am.xyz/contract/48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa) |
| **Target Network** | Midnight Preview Testnet / Preprod |
| **Product Proposal** | [PROPOSAL.md](PROPOSAL.md) |
| **Architecture Specification** | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| **Privacy Threat Model** | [docs/PRIVACY_MODEL.md](docs/PRIVACY_MODEL.md) |
| **Judge Demo Walkthrough** | [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md) |

---

## 🌟 Executive Summary

Every year, consumers and financial institutions lose tens of billions of dollars to data breaches, synthetic identity fraud, and credit credential theft. Traditional lending processes force loan applicants to expose their complete financial history—unencrypted Social Security Numbers, exact three-digit credit scores, active credit card balances, and payment records—to mortgage brokers, car dealerships, and fintech platforms.

**Confidential Credit Score Verification (CCSV)** replaces this high-risk paradigm with zero-knowledge selective disclosure built natively on **Midnight Network**. Using client-side ZK witnesses and Jubjub-Schnorr digital signatures issued by certified credit bureaus (Experian, Equifax, TransUnion), borrowers can prove their creditworthiness and loan tier compliance without disclosing a single piece of sensitive financial information.

Detailed product and market analysis is available in [PROPOSAL.md](PROPOSAL.md).

---

## 🎨 3D Neo-Glass Aesthetic & Design System

The application features a modern **Lumora 3D Neo-Glass Aesthetic**:
- **Floating Pill Capsule Navigation**: Frosted glassmorphism header with active 1AM wallet connection state, pill menus, and gradient 3D buttons.
- **3D Isometric Interactive Visual Centerpiece**: Soft clay-morphic cubes rendered in isometric perspective on a glowing curved dome stage:
  - 🧩 **ZK Circuit Prover**: Midnight Compact circuit compiler and prover.
  - ⚙️ **Lending Policy Engine**: On-chain cryptographic policy commitment hash.
  - 📊 **Bureau Attestation**: Jubjub-Schnorr digital signature verifier.
  - ✨ **Replay Nullifier**: One-time cryptographically bound nullifier preventing loan credential duplication.
- **Dual-Pane Privacy Boundary Matrix**: Real-time side-by-side inspection showing exactly what remains private in the browser witness vs. what becomes immutable on the Midnight public ledger.

---

## 🏗️ Protocol Architecture

```text
+-------------------------------------------------------------------------+
|                        Borrower Browser Client                          |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  |                 Client-Side Zero-Knowledge Witness                |  |
|  |   - Raw Credit Score (e.g., 785)       - Bureau Signature         |  |
|  |   - Debt-to-Income Ratio (e.g., 26%)   - Delinquency Flags: 0     |  |
|  |   - 32-Byte Secret Holder Key          - Bureau Issuer ID         |  |
|  +-------------------------------------------------------------------+  |
|                                  |                                      |
|                                  v                                      |
|  +-------------------------------------------------------------------+  |
|  |            Midnight Compact Circuit (Client Execution)            |  |
|  |   - Evaluates: scoreAboveThreshold == true                        |  |
|  |   - Evaluates: noActiveDefault == true                            |  |
|  |   - Verifies: Schnorr_schnorrVerify(message, sig, pk)             |  |
|  |   - Derives: Nullifier = persistentHash(holderSecret, nonce, ...) |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
                                   |
                     Discloses ONLY (Zero Leakage):
                     1. Boolean Result: Eligible = true
                     2. One-Time Public Nullifier
                     3. Valid Schnorr Signature Status
                                   |
                                   v
+-------------------------------------------------------------------------+
|                         Midnight Public Ledger                          |
|   - Contract: 48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa |
|   - 1AM Explorer: https://explorer.1am.xyz/contract/...                 |
|   - Policy Hash Commitment (`policyHash`)                               |
|   - Trusted Bureau Public Keys (`trustedIssuers`)                       |
|   - Replay Prevention Set (`usedNullifiers`)                            |
|   - Proof Counter (`finalizedProofs`)                                   |
+-------------------------------------------------------------------------+
```

---

## 🔒 Privacy Boundary Guarantee

| Data Element | Visibility | Location | Security Guarantee |
|---|---|---|---|
| **Raw Credit Score (e.g. 785)** | 🔒 Confidential | Client Witness | Never leaves user device |
| **Debt-to-Income (DTI)** | 🔒 Confidential | Client Witness | Never leaves user device |
| **Account Numbers & SSN** | 🔒 Confidential | Client Witness | Never leaves user device |
| **Holder Secret Key** | 🔒 Confidential | Browser Local Storage | Never leaves user device |
| **Tier Qualification Result** | 🌐 Public | Midnight Ledger | Disclosed as binary boolean |
| **Bureau Signature Validity** | 🌐 Public | Midnight Ledger | Proved via Jubjub curve |
| **One-Time Nullifier** | 🌐 Public | Midnight Ledger | Prevents multi-loan replay |
| **Block Height & Tx Hash** | 🌐 Public | Midnight Ledger | Immutable audit receipt |

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js 22+ & npm
- Python 3.12+ (or `uv`)
- Midnight 1AM Wallet Extension

### 1. Clone & Install Frontend
```bash
git clone https://github.com/biltujana/Confidential-Credit-Score-Verification.git
cd Confidential-Credit-Score-Verification
npm install
```

### 2. Verify Compact Smart Contract Artifacts
```bash
npm run contracts:verify
```
*Validates that all 14 compiled Compact artifacts, prover keys, verifier keys, and ZKIR binaries are present and match runtime versions.*

### 3. Run Frontend Tests (Vitest)
```bash
npm test
```
*Executes all 13 unit and integration tests across contracts, receipts, wallet discovery, and local private state.*

### 4. Run Backend Tests (FastAPI + pytest)
```bash
cd backend
uv run pytest
```
*Executes 9 privacy boundary, replay prevention, and public receipt persistence tests.*

### 5. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📂 Repository Structure

```text
├── PROPOSAL.md                            # Comprehensive product & market proposal
├── contracts/
│   ├── CreditScoreVerification.compact    # Midnight Compact smart contract
│   ├── schnorr.compact                    # Jubjub-Schnorr verification circuit
│   └── artifacts/                         # Pre-compiled ZKIR and proving keys
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                     # Floating pill navbar with 1AM wallet state
│   │   ├── Hero3D.tsx                     # 3D isometric interactive stage
│   │   ├── CreditStudio.tsx               # Verification console & 1AM approval flow
│   │   ├── ReceiptsExplorer.tsx           # Public Midnight receipt viewer
│   │   └── ArchitectureInfo.tsx           # Zero-knowledge protocol breakdown
│   ├── lib/
│   │   ├── api.ts                         # Public receipt and metrics client
│   │   ├── deployment.ts                  # Midnight contract deployment runner
│   │   ├── midnightDeployment.ts          # Midnight.js DApp connector bridge
│   │   ├── privateState.ts                # Client-side credit witness manager
│   │   ├── receipt.ts                     # Receipt parser and explorer links
│   │   ├── tiers.ts                       # Credit tier definitions (Prime, Super-Prime)
│   │   └── wallet.ts                      # 1AM wallet discovery and connection
│   ├── App.tsx                            # Root application component
│   └── styles.css                         # 3D Lumora styling system
├── backend/
│   ├── app/
│   │   ├── main.py                        # FastAPI zero-knowledge gateway
│   │   ├── schemas.py                     # Pydantic schemas with PII filters
│   │   ├── privacy.py                     # Strict financial redaction engine
│   │   ├── gemini.py                      # AI lending policy advisor
│   │   └── db.py                          # SQLite/PostgreSQL receipt storage
│   └── tests/
│       └── test_api.py                    # Backend test suite
├── docs/
│   ├── ARCHITECTURE.md                    # Formal architecture specification
│   ├── DEMO_SCRIPT.md                     # Step-by-step hackathon demo script
│   ├── PRIVACY_MODEL.md                   # Threat modeling & compliance analysis
│   └── PRODUCT_PROPOSAL.md                # Market analysis and business model
└── tests/
    ├── contract.test.ts                   # Compact circuit boundary tests
    ├── privateState.test.ts               # Local witness state tests
    ├── receipt.test.ts                    # Public receipt parsing tests
    └── wallet.test.ts                     # 1AM wallet session tests
```

---

## 🏆 Hackathon Submission Checklist

- [x] Zero-Knowledge Smart Contract in Midnight Compact
- [x] Live Contract Deployment on Midnight: [`48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa`](https://explorer.1am.xyz/contract/48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa)
- [x] Verified on 1AM Explorer: [https://explorer.1am.xyz/contract/48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa](https://explorer.1am.xyz/contract/48b84b636e8f09756b82a31f2bb36ca0c0d361b9412a30df2a8f91fac76facfa)
- [x] Complete Proposal Document: [PROPOSAL.md](PROPOSAL.md)
- [x] Client-side private witness generation with selective disclosure
- [x] Jubjub-Schnorr digital signature verification from credit bureaus
- [x] Replay attack mitigation via deterministic one-time nullifiers
- [x] Complete 3D Neo-Glass user interface matching Lumora design specifications
- [x] 1AM Wallet DApp connector integration with live connect and approve states
- [x] 13/13 Vitest tests passing
- [x] 9/9 FastAPI backend tests passing
- [x] Full production build passes with 0 warnings
- [x] Comprehensive documentation (Architecture, Privacy Model, Proposal, Demo Script)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.