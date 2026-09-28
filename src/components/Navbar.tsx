import { useState } from 'react'
import { Layers, ArrowRight, Menu, X } from 'lucide-react'

interface NavbarProps {
  onVerifyClick: () => void
}

export function Navbar({ onVerifyClick }: NavbarProps) {
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
          <button className="btn-3d-purple" onClick={onVerifyClick}>
            Verify Score <ArrowRight size={16} />
          </button>

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
