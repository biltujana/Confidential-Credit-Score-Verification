import { useEffect, useState } from 'react'
import { Layers } from 'lucide-react'
import { loadCredential, type LocalCredential } from './lib/privateState'
import { loadPublicReceipt, PUBLIC_RECEIPT_EVENT, type PublicReceipt } from './lib/receipt'
import { classifyWalletError, connectWallet, type Network, type WalletState } from './lib/wallet'
import { deployEligibilityContract } from './lib/deployment'
import { fetchPublicMetrics, type PublicMetrics } from './lib/api'
import { Navbar } from './components/Navbar'
import { Hero3D } from './components/Hero3D'
import { CreditStudio } from './components/CreditStudio'
import { ReceiptsExplorer } from './components/ReceiptsExplorer'
import { ArchitectureInfo } from './components/ArchitectureInfo'
import './styles.css'

export default function App() {
  const [network, setNetwork] = useState<Network>('preview')
  const [credential, setCredential] = useState<LocalCredential>(loadCredential)
  const [receipt, setReceipt] = useState<PublicReceipt | null>(loadPublicReceipt)
  const [proofState, setProofState] = useState<'ready' | 'proving' | 'awaiting' | 'finalized' | 'failed'>('ready')
  const [, setWalletState] = useState<WalletState>('idle')
  const [statusMessage, setStatusMessage] = useState<string>('Ready to prove credit eligibility.')
  const [, setMetrics] = useState<PublicMetrics | null>(null)

  useEffect(() => {
    fetchPublicMetrics()
      .then(setMetrics)
      .catch(() => {})

    const handleReceipt = (e: Event) => {
      const custom = e as CustomEvent<PublicReceipt>
      setReceipt(custom.detail)
    }

    window.addEventListener(PUBLIC_RECEIPT_EVENT, handleReceipt)
    return () => window.removeEventListener(PUBLIC_RECEIPT_EVENT, handleReceipt)
  }, [])

  const scrollToVerification = () => {
    document.getElementById('verification')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDeployAndProve = async () => {
    setProofState('proving')
    setStatusMessage('Generating zero-knowledge witness and Jubjub-Schnorr signature proof...')

    try {
      const { session } = await connectWallet(network)
      setWalletState('connected')

      setStatusMessage('Submitting zero-knowledge transaction to Midnight Network...')

      const deploymentResult = await deployEligibilityContract({
        wallet: session,
        network,
        credential,
      })

      setReceipt(deploymentResult.receipt)
      setProofState('finalized')
      setStatusMessage('Credit eligibility finalized on Midnight Network. Zero private attributes disclosed.')

      fetchPublicMetrics().then(setMetrics).catch(() => {})
    } catch (err: unknown) {
      setProofState('failed')
      setStatusMessage(classifyWalletError(err))
    }
  }

  return (
    <div className="app-container">
      <Navbar onVerifyClick={scrollToVerification} />

      <main className="main-content">
        <Hero3D />

        <CreditStudio
          credential={credential}
          setCredential={setCredential}
          network={network}
          setNetwork={setNetwork}
          proofState={proofState}
          statusMessage={statusMessage}
          onDeployAndProve={handleDeployAndProve}
        />

        <ReceiptsExplorer
          receipt={receipt}
          setReceipt={setReceipt}
          onVerifyClick={scrollToVerification}
        />

        <ArchitectureInfo />
      </main>

      <footer className="site-footer">
        <div className="main-content">
          <div className="footer-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="brand-icon-3d" style={{ width: 30, height: 30 }}>
                <Layers size={16} />
              </div>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>CredenceZK</strong>
            </div>

            <p className="footer-copy">
              Confidential Credit Score Verification on Midnight Network. Built with zero-knowledge Compact smart contracts.
            </p>

            <div className="footer-links">
              <a href="#overview">Overview</a>
              <a href="#verification">Verification</a>
              <a href="#tiers">Tiers</a>
              <a href="#receipts">Receipts</a>
              <a href="#architecture">Architecture</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
