export function ArchitectureInfo() {
  return (
    <section className="architecture-section" id="architecture" style={{ marginBottom: 64 }}>
      <div className="section-header">
        <span className="section-tag">Protocol Design</span>
        <h2 className="section-title">Zero-Knowledge Architecture</h2>
        <p className="section-description">
          How Midnight Network and Jubjub-Schnorr signatures protect borrower confidentiality end-to-end.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-num">01</div>
          <h3>Bureau Digital Signatures</h3>
          <p>
            Trusted credit bureaus (Experian, Equifax, TransUnion) sign eligibility predicates using
            Jubjub-Schnorr signatures. The signatures attest to the validity of the borrower claim
            without revealing credit files to intermediaries.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-num">02</div>
          <h3>Client-Side ZK Witness</h3>
          <p>
            The borrower executes the zero-knowledge circuit locally in their browser. The raw credit score,
            account numbers, and debt ratios remain in the browser witness and are never transmitted over the network.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-num">03</div>
          <h3>Replay-Proof Nullifiers</h3>
          <p>
            Each proof derives a persistent cryptographic nullifier combining the borrower secret, lending nonce,
            and policy hash. This guarantees a credential cannot be double-spent across unapproved loan applications.
          </p>
        </div>
      </div>
    </section>
  )
}
