import { useState } from 'react'
import { Sparkles, FileCheck, Code, Settings, PieChart, Stars, Award, ShieldCheck, Fingerprint, Layers, LockKeyhole, Sliders } from 'lucide-react'

export function Hero3D() {
  const [activeCube, setActiveCube] = useState<number | null>(null)

  return (
    <>
      <section className="hero-section" id="overview">
        <div className="hero-badge">
          <span className="pulse-dot"></span>
          ZERO-KNOWLEDGE FINANCIAL COMPLIANCE
        </div>

        <h1 className="hero-title">
          Scale Smarter with <span className="gradient-text">Zero-Knowledge</span> Credit Systems
        </h1>

        <p className="hero-subtitle">
          We design intelligent privacy-preserving verification systems that verify creditworthiness,
          eliminate counterparty risk, and unlock automated lending decisions without exposing raw scores or PII.
        </p>

        <div className="hero-cta-group">
          <a href="#verification" className="btn-3d-purple">
            <Sparkles size={16} /> Launch Verification Studio
          </a>
          <a href="#architecture" className="btn-3d-secondary">
            <FileCheck size={16} /> View Privacy Architecture
          </a>
        </div>

        {/* 3D Isometric Stage with Cubes (Exact Lumora Match) */}
        <div className="stage-container">
          <div className="stage-dome"></div>

          <div className="isometric-grid">
            <div className="cube-cluster">
              {/* Cube 1: Circuit */}
              <div
                className={`iso-cube ${activeCube === 1 ? 'active' : ''}`}
                onClick={() => setActiveCube(activeCube === 1 ? null : 1)}
                title="Click to inspect Midnight Compact Circuit"
              >
                <div className="cube-face face-top">
                  <Code size={34} />
                  <span>ZK Circuit</span>
                </div>
                <div className="cube-base-shadow"></div>
              </div>

              {/* Cube 2: Policy */}
              <div
                className={`iso-cube ${activeCube === 2 ? 'active' : ''}`}
                onClick={() => setActiveCube(activeCube === 2 ? null : 2)}
                title="Click to inspect Credit Policy Engine"
              >
                <div className="cube-face face-top">
                  <Settings size={34} />
                  <span>Lending Policy</span>
                </div>
                <div className="cube-base-shadow"></div>
              </div>

              {/* Cube 3: Attestation */}
              <div
                className={`iso-cube ${activeCube === 3 ? 'active' : ''}`}
                onClick={() => setActiveCube(activeCube === 3 ? null : 3)}
                title="Click to inspect Bureau Signature"
              >
                <div className="cube-face face-top">
                  <PieChart size={34} />
                  <span>Bureau Attest</span>
                </div>
                <div className="cube-base-shadow"></div>
              </div>

              {/* Cube 4: Nullifier */}
              <div
                className={`iso-cube ${activeCube === 4 ? 'active' : ''}`}
                onClick={() => setActiveCube(activeCube === 4 ? null : 4)}
                title="Click to inspect Replay Nullifier"
              >
                <div className="cube-face face-top">
                  <Stars size={34} />
                  <span>ZK Nullifier</span>
                </div>
                <div className="cube-base-shadow"></div>
              </div>
            </div>

            {activeCube && (
              <div className="cube-tooltip">
                {activeCube === 1 && 'Midnight Compact Circuit: Proves predicate satisfaction inside client zero-knowledge witness'}
                {activeCube === 2 && 'Lending Policy Engine: Stores public policy hash and validates threshold rules'}
                {activeCube === 3 && 'Bureau Jubjub-Schnorr Attestation: Validates digital signature from Equifax/Experian/TransUnion'}
                {activeCube === 4 && 'One-Time Nullifier: Cryptographic hash preventing credential replay across multiple loan applications'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ecosystem Partners Strip */}
      <div className="ecosystem-banner">
        <p className="ecosystem-label">Trusted by leading financial networks and credit ecosystems</p>
        <div className="partners-strip">
          <div className="partner-item"><Award size={18} /><span>Experian</span></div>
          <div className="partner-item"><ShieldCheck size={18} /><span>Equifax</span></div>
          <div className="partner-item"><Fingerprint size={18} /><span>TransUnion</span></div>
          <div className="partner-item"><Layers size={18} /><span>Midnight Network</span></div>
          <div className="partner-item"><LockKeyhole size={18} /><span>Cardano</span></div>
          <div className="partner-item"><Sliders size={18} /><span>FICO Score</span></div>
        </div>
      </div>
    </>
  )
}
