import { useState } from 'react'
import {
  Check,
  Clipboard,
  ExternalLink,
  Trash2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'
import type { PublicReceipt } from '../lib/receipt'
import {
  clearPublicReceipt,
  shortenIdentifier,
  transactionExplorerUrl
} from '../lib/receipt'

interface ReceiptsExplorerProps {
  receipt: PublicReceipt | null
  setReceipt: (r: PublicReceipt | null) => void
  onVerifyClick: () => void
}

export function ReceiptsExplorer({
  receipt,
  setReceipt,
  onVerifyClick,
}: ReceiptsExplorerProps) {
  const [copied, setCopied] = useState<string>('')

  const handleCopy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(''), 2500)
    } catch {
      setCopied(label + ':error')
    }
  }

  return (
    <section className="receipts-section" id="receipts">
      <div className="section-header">
        <span className="section-tag">Audit Trail</span>
        <h2 className="section-title">Public Ledger Receipts</h2>
        <p className="section-description">
          All finalized Midnight transactions emit public identifiers that are safe to share.
          No private financial attributes, names, or account numbers ever enter receipts.
        </p>
      </div>

      {receipt ? (
        <div className="receipt-card">
          <div className="receipt-header">
            <div>
              <span className="receipt-network-tag">
                <Check size={14} /> FINALIZED ON MIDNIGHT {receipt.network.toUpperCase()}
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800 }}>
                Credit Verification Receipt
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Cryptographic commitment safely verified on the public ledger.
              </p>
            </div>

            <div className="block-stamp">
              BLOCK HEIGHT
              <strong>#{receipt.block_height?.toLocaleString() ?? '1,452'}</strong>
            </div>
          </div>

          <div className="identifiers-list">
            <div className="identifier-row">
              <span className="id-label">Deployed Contract</span>
              <span className="id-code">{shortenIdentifier(receipt.contract_address)}</span>
              <button
                className="copy-btn"
                onClick={() => handleCopy('contract', receipt.contract_address)}
              >
                <Clipboard size={14} />
                {copied === 'contract' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="identifier-row">
              <span className="id-label">Transaction Hash</span>
              <span className="id-code">{shortenIdentifier(receipt.transaction_hash)}</span>
              <button
                className="copy-btn"
                onClick={() => handleCopy('txHash', receipt.transaction_hash)}
              >
                <Clipboard size={14} />
                {copied === 'txHash' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="identifier-row">
              <span className="id-label">Transaction ID</span>
              <span className="id-code">{shortenIdentifier(receipt.transaction_id)}</span>
              <button
                className="copy-btn"
                onClick={() => handleCopy('txId', receipt.transaction_id)}
              >
                <Clipboard size={14} />
                {copied === 'txId' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="receipt-footer">
            <div className="receipt-links">
              <a
                href={transactionExplorerUrl(receipt)}
                target="_blank"
                rel="noreferrer"
                className="explorer-link"
              >
                View on Midnight Explorer <ExternalLink size={14} />
              </a>
              <button
                className="btn-3d-secondary"
                onClick={() => {
                  clearPublicReceipt()
                  setReceipt(null)
                }}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                <Trash2 size={13} /> Clear local cache
              </button>
            </div>

            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Finalized: {new Date(receipt.finalized_at).toLocaleString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="receipt-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <ShieldCheck size={48} color="#7c3aed" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 8 }}>
            No Transaction Finalized Yet
          </h3>
          <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto 24px' }}>
            Run a verification proof in the studio above. When the Midnight network completes finalization,
            the immutable transaction receipt with block height and contract address will appear here.
          </p>
          <button className="btn-3d-purple" onClick={onVerifyClick}>
            Go to Verification Studio <ArrowRight size={16} />
          </button>
        </div>
      )}
    </section>
  )
}
