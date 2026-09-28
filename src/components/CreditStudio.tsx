import { useState, type ChangeEvent } from 'react'
import {
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Fingerprint,
  Sparkles,
  Check,
  ArrowRight,
  Wallet
} from 'lucide-react'
import type { LocalCredential } from '../lib/privateState'
import { rotateCredential, updateLocalCreditProfile } from '../lib/privateState'
import type { Network, WalletState } from '../lib/wallet'
import { LENDING_TIERS, type LendingTier } from '../lib/tiers'

interface CreditStudioProps {
  credential: LocalCredential
  setCredential: (c: LocalCredential) => void
  network: Network
  setNetwork: (n: Network) => void
  proofState: 'ready' | 'proving' | 'awaiting' | 'finalized' | 'failed'
  walletState: WalletState
  statusMessage: string
  onDeployAndProve: () => void
  onConnectWallet: () => void
}

export function CreditStudio({
  credential,
  setCredential,
  network,
  setNetwork,
  proofState,
  walletState,
  statusMessage,
  onDeployAndProve,
  onConnectWallet,
}: CreditStudioProps) {
  const [selectedTier, setSelectedTier] = useState<LendingTier>(LENDING_TIERS[1])
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantAnswer, setAssistantAnswer] = useState<string | null>(null)

  const handleScoreChange = (newScore: number) => {
    const updated = updateLocalCreditProfile({ creditScore: newScore })
    setCredential({ ...updated })
  }

  const handleBureauChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const bureau = e.target.value as 'Experian' | 'Equifax' | 'TransUnion'
    const updated = updateLocalCreditProfile({ bureau })
    setCredential({ ...updated })
  }

  const isEligibleForSelectedTier =
    credential.creditScore >= selectedTier.minScore &&
    credential.debtToIncomeRatio <= selectedTier.maxDti &&
    credential.activeDelinquencies === 0

  const askAssistant = (question: string) => {
    setAssistantOpen(true)
    if (question.includes('score')) {
      setAssistantAnswer(
        'In Midnight Compact circuits, the credit bureau signs the predicate (scoreAboveThreshold: Boolean) with Jubjub-Schnorr. The actual numeric score (e.g. ' +
          credential.creditScore +
          ') is strictly private in the witness and is NEVER written to the public ledger.'
      )
    } else if (question.includes('delinquency')) {
      setAssistantAnswer(
        'Delinquency checks are evaluated locally inside the ZK proof circuit. The smart contract validates that noActiveDefault is true without receiving transaction histories or debt balances.'
      )
    } else {
      setAssistantAnswer(
        'Lenders receive only a verified Boolean eligibility proof and a single-use nullifier. This prevents credential re-use and protects against identity theft.'
      )
    }
  }

  return (
    <section className="studio-section" id="verification">
      <div className="section-header">
        <span className="section-tag">Interactive Studio</span>
        <h2 className="section-title">Confidential Verification Console</h2>
        <p className="section-description">
          Select a lending policy tier and test how client-side zero-knowledge proofs verify compliance
          while keeping your credit score and financial records 100% private.
        </p>
      </div>

      {/* Tier Selector */}
      <div className="tiers-selector" id="tiers">
        {LENDING_TIERS.map((tier) => (
          <div
            key={tier.id}
            className={`tier-card ${selectedTier.id === tier.id ? 'selected' : ''}`}
            onClick={() => setSelectedTier(tier)}
          >
            <div className="tier-header">
              <span className="tier-name">{tier.name}</span>
              <span className="tier-pill">{tier.tag}</span>
            </div>
            <p className="tier-requirement">Min Score: {tier.minScore} • Max DTI: {tier.maxDti}%</p>
            <p className="tier-subtext">{tier.rate}</p>
          </div>
        ))}
      </div>

      {/* Split Panes: Private Witness vs Public Ledger */}
      <div className="studio-grid">
        {/* Left: Private Client-Side Enclave */}
        <div className="panel-card">
          <div className="panel-badge-row">
            <span className="panel-badge badge-private">
              <LockKeyhole size={14} /> Local Private Enclave
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Stays in this browser</span>
          </div>

          <h3 className="panel-title">Borrower Credit Witness</h3>
          <p className="panel-subtext">
            Simulate your financial profile. This data remains strictly in your local device memory and is never
            sent to lenders, APIs, or the Midnight public chain.
          </p>

          <div className="score-control-box">
            <div className="score-display">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  Current Credit Score
                </span>
                <div className="score-number">{credential.creditScore}</div>
              </div>
              <span className="score-tier-label">{credential.tier}</span>
            </div>

            <input
              type="range"
              min="550"
              max="850"
              value={credential.creditScore}
              onChange={(e) => handleScoreChange(Number(e.target.value))}
              className="range-slider"
            />

            <div className="range-labels">
              <span>550 (Poor)</span>
              <span>670 (Good)</span>
              <span>740 (Very Good)</span>
              <span>850 (Exceptional)</span>
            </div>
          </div>

          <div className="attributes-grid">
            <div className="attribute-item">
              <span className="attr-label">Attesting Bureau</span>
              <div className="attr-value">
                <select
                  value={credential.bureau}
                  onChange={handleBureauChange}
                  style={{ border: 'none', background: 'transparent', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="Experian">Experian (Issuer #101)</option>
                  <option value="Equifax">Equifax (Issuer #102)</option>
                  <option value="TransUnion">TransUnion (Issuer #103)</option>
                </select>
              </div>
            </div>

            <div className="attribute-item">
              <span className="attr-label">Debt-to-Income (DTI)</span>
              <span className="attr-value">{credential.debtToIncomeRatio}% (Healthy)</span>
            </div>

            <div className="attribute-item">
              <span className="attr-label">Active Delinquencies</span>
              <span className="attr-value">0 Flags</span>
            </div>

            <div className="attribute-item">
              <span className="attr-label">Local Holder Key</span>
              <span className="attr-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                {credential.keyId}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn-3d-secondary"
              onClick={() => setCredential(rotateCredential())}
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <RotateCcw size={14} /> Regenerate Keypair
            </button>

            <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} /> 100% Client-Side Witness
            </div>
          </div>
        </div>

        {/* Right: Privacy Boundary Matrix & Verification */}
        <div className="panel-card">
          <div className="panel-badge-row">
            <span className="panel-badge badge-public">
              <Fingerprint size={14} /> Zero-Knowledge Boundary
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Selective Disclosure</span>
          </div>

          <h3 className="panel-title">Cryptographic Disclosure</h3>
          <p className="panel-subtext">
            The smart contract evaluates predicates against the lending policy without ever receiving raw values.
          </p>

          <div className="boundary-graphic">
            <div className="boundary-side">
              <LockKeyhole size={28} color="#059669" />
              <h4>REMAINS PRIVATE</h4>
              <p>Score: {credential.creditScore}</p>
              <p>DTI Ratio: {credential.debtToIncomeRatio}%</p>
              <p>Account Numbers & SSN</p>
              <p>Bureau Account Identity</p>
            </div>

            <div className="boundary-divider"></div>

            <div className="boundary-side">
              <ShieldCheck size={28} color="#7c3aed" />
              <h4>PUBLIC ON-CHAIN</h4>
              <p>Eligible: {isEligibleForSelectedTier ? 'TRUE (disclosed)' : 'FALSE'}</p>
              <p>Schnorr Signature: VALID</p>
              <p>One-Time Nullifier Hash</p>
              <p>Finalized Block Height</p>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tier Compliance Status:</span>
              <span style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '0.82rem',
                background: isEligibleForSelectedTier ? '#ecfdf5' : '#fee2e2',
                color: isEligibleForSelectedTier ? '#059669' : '#dc2626'
              }}>
                {isEligibleForSelectedTier ? 'QUALIFIED FOR TIER' : 'BELOW TIER THRESHOLD'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {isEligibleForSelectedTier
                ? `Your score of ${credential.creditScore} satisfies ${selectedTier.name} (>=${selectedTier.minScore}).`
                : `Your score of ${credential.creditScore} does not meet the minimum requirement of ${selectedTier.minScore} for this tier.`}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Target Network:</span>
            <button
              className={`btn-3d-secondary ${network === 'preview' ? 'active' : ''}`}
              onClick={() => setNetwork('preview')}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: network === 'preview' ? 'var(--brand-purple)' : undefined }}
            >
              Preview Testnet
            </button>
            <button
              className={`btn-3d-secondary ${network === 'preprod' ? 'active' : ''}`}
              onClick={() => setNetwork('preprod')}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderColor: network === 'preprod' ? 'var(--brand-purple)' : undefined }}
            >
              Preprod
            </button>
          </div>
        </div>
      </div>

      {/* Midnight Proving & Deployment Station */}
      <div className="proving-panel">
        {proofState === 'proving' && <div className="scan-line"></div>}

        <div className="proving-header">
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-purple)', textTransform: 'uppercase' }}>
              Midnight Network Execution
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4 }}>
              Zero-Knowledge Proof & Deployment Engine
            </h3>
          </div>

          <span className={`proving-status-pill status-${proofState}`}>
            {proofState === 'ready' && (walletState === 'connected' ? 'Ready to Prove' : 'Wallet Not Connected')}
            {proofState === 'proving' && 'Synthesizing ZK Circuit...'}
            {proofState === 'awaiting' && 'Awaiting 1AM Approval...'}
            {proofState === 'finalized' && 'On-Chain Finalized'}
            {proofState === 'failed' && 'Execution Interrupted'}
          </span>
        </div>

        <div className="proving-body">
          <div className="proving-info">
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{statusMessage}</p>
            <p>
              Deploying registers the lending policy hash on the public ledger. Proving evaluates your credit score
              inside Midnight client-side ZK circuit with 1AM wallet confirmation.
            </p>
          </div>

          <button
            className="btn-3d-purple"
            disabled={proofState === 'proving' || proofState === 'awaiting'}
            onClick={walletState !== 'connected' ? onConnectWallet : onDeployAndProve}
            style={{ padding: '14px 28px', fontSize: '1rem' }}
          >
            {walletState !== 'connected' ? (
              <><Wallet size={18} /> Connect 1AM Wallet to Verify</>
            ) : proofState === 'proving' ? (
              <><span className="spinner-sm" /> Synthesizing ZK Circuit...</>
            ) : proofState === 'awaiting' ? (
              <><span className="pulse-dot" /> Confirm in 1AM Wallet...</>
            ) : proofState === 'finalized' ? (
              <><Check size={18} /> Finalized on Midnight</>
            ) : (
              <>Verify & Prove with 1AM <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </div>

      {/* Gemini AI Policy Advisor */}
      <div className="assistant-box">
        <div className="assistant-header">
          <div className="assistant-tag">
            <Sparkles size={20} />
            <span>Gemini AI Lending Policy Assistant</span>
          </div>
          <button
            className="btn-3d-secondary"
            onClick={() => setAssistantOpen(!assistantOpen)}
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            {assistantOpen ? 'Hide Assistant' : 'Ask Question'}
          </button>
        </div>

        <p style={{ fontSize: '0.92rem', color: '#475569' }}>
          Have questions about how zero-knowledge credit verification works under financial regulations (FCRA, GDPR)?
          Our policy helper explains privacy boundaries without exposing any financial data.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
          <button
            className="btn-3d-secondary"
            onClick={() => askAssistant('How is my credit score kept private?')}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            How is my score kept private?
          </button>
          <button
            className="btn-3d-secondary"
            onClick={() => askAssistant('How do delinquency checks work?')}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            How are delinquencies verified?
          </button>
          <button
            className="btn-3d-secondary"
            onClick={() => askAssistant('What prevents replay attacks?')}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            What prevents replay attacks?
          </button>
        </div>

        {assistantOpen && assistantAnswer && (
          <div className="assistant-response">
            <strong>Policy Advisor: </strong>
            {assistantAnswer}
          </div>
        )}
      </div>
    </section>
  )
}