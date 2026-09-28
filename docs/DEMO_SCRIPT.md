# Confidential Credit Score Verification - Hackathon Demo Script

## Step-by-Step Judge Walkthrough

### 1. Launch & Explore Overview
- Navigate to the application homepage.
- Observe the modern **Lumora 3D Neo-Glass Aesthetic**:
  - Top floating pill navbar with brand badge, section links, and 3D action buttons.
  - Interactive 3D Isometric stage featuring 4 floating clay cubes (ZK Circuit, Lending Policy, Bureau Attestation, ZK Nullifier).
  - Click on each 3D cube to inspect its role in the zero-knowledge verification pipeline.
  - Review ecosystem trust partners: Experian, Equifax, TransUnion, Midnight Network, Cardano, FICO.

### 2. Configure Lending Policy Tier
- Scroll to the **Confidential Verification Console**.
- Select the desired lending tier:
  - **Super-Prime Tier (780+)**: For jumbo loans & premium rates.
  - **Prime Lending Tier (720+)**: Standard financing.
  - **Near-Prime Tier (660+)**: Auto & personal loans.
  - **Credit Starter Tier (600+)**: Micro-credit.

### 3. Test Local Private Enclave (Witness)
- Adjust the **Credit Score Slider** (e.g. set score to 785).
- Notice how the status badge dynamically updates to **QUALIFIED FOR TIER**.
- Select the attesting bureau (Experian, Equifax, TransUnion).
- Verify that all attributes are marked with a green shield: **100% Client-Side. Stays in this browser.**

### 4. Review Cryptographic Privacy Boundary
- Inspect the side-by-side Dual Matrix:
  - Left: What remains completely private (Raw score: 785, DTI: 26%, account numbers).
  - Center: Zero-knowledge cryptographic circuit barrier.
  - Right: What becomes public on Midnight (disclose(true), Schnorr signature valid, one-time nullifier).

### 5. Synthesize Proof & Deploy to Midnight
- Click **Generate Proof & Deploy**.
- Observe the real-time laser scan animation and state progression (
eady -> proving -> inalized).
- Witness the immutable transaction receipt rendered with block height, transaction ID, transaction hash, and direct Midnight Block Explorer link.
