import { useState } from 'react'
import { Layers, ArrowRight, Menu, X, Wallet } from 'lucide-react'
import type { Network, WalletState } from '../lib/wallet'

interface NavbarProps {
  walletState: WalletState
  network: Network
  onConnectWallet: () => void
}

export function Navbar({ walletState, network, onConnectWallet }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="navbar-wrapper">
      <header className="navbar">
        <a href="#overview" className="nav-brand">
          <div className="brand-icon-3d">
            <Layers size={20} />
          </div>
          <span>CredenceZK</span>
        </a>

        <nav className="nav-pill-menu">
          <a href="#overview" className="nav-link active">Overview</a>
          <a href="#verification" className="nav-link">Verification</a>
          <a href="#tiers" className="nav-link">Credit Tiers</a>
          <a href="#receipts" className="nav-link">Receipts</a>
          <a href="#architecture" className="nav-link">Architecture</a>
        </nav>

        <div className="nav-actions">
          {walletState === 'connected' ? (
            <div
              className="wallet-connected-pill"
              onClick={onConnectWallet}
              title="Click to reconnect or check status"
            >
              <span className="status-dot-connected"></span>
              <span>1AM Connected</span>
              <span className="network-badge-sm">{network.toUpperCase()}</span>
            </div>
          ) : walletState === 'connecting' ? (
            <button className="btn-3d-purple" disabled>
              <span className="spinner-sm"></span> Connecting 1AM...
            </button>
          ) : (
            <button className="btn-3d-purple" onClick={onConnectWallet}>
              <Wallet size={16} /> Connect 1AM <ArrowRight size={16} />
            </button>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
    </div>
  )
}