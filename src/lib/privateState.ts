const KEY = 'creditscore.local-credential.v1'

export type CreditTier = 'Super-Prime' | 'Prime' | 'Near-Prime' | 'Fair'

export type LocalCredential = {
  label: string
  issuedAt: string
  keyId: string
  secretHex: string
  creditScore: number
  bureau: 'Experian' | 'Equifax' | 'TransUnion'
  debtToIncomeRatio: number
  activeDelinquencies: number
  tier: CreditTier
}

function calculateTier(score: number): CreditTier {
  if (score >= 780) return 'Super-Prime'
  if (score >= 720) return 'Prime'
  if (score >= 660) return 'Near-Prime'
  return 'Fair'
}

function randomSecretHex(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function createCredential(issuedAt: string, score = 785, bureau: 'Experian' | 'Equifax' | 'TransUnion' = 'Experian'): LocalCredential {
  const secretHex = randomSecretHex()
  return {
    label: 'Confidential Credit Credential',
    issuedAt,
    keyId: `local-holder-${secretHex.slice(-6).toUpperCase()}`,
    secretHex,
    creditScore: score,
    bureau,
    debtToIncomeRatio: 26,
    activeDelinquencies: 0,
    tier: calculateTier(score),
  }
}

function isCredential(value: unknown): value is LocalCredential {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<LocalCredential>
  return typeof candidate.label === 'string'
    && typeof candidate.issuedAt === 'string'
    && typeof candidate.keyId === 'string'
    && typeof candidate.secretHex === 'string'
    && /^[0-9a-f]{64}$/i.test(candidate.secretHex)
}

export function loadCredential(): LocalCredential {
  const saved = localStorage.getItem(KEY)
  if (saved) {
    try {
      const value: unknown = JSON.parse(saved)
      if (isCredential(value)) {
        if (!('creditScore' in value)) {
          (value as LocalCredential).creditScore = 785;
          (value as LocalCredential).bureau = 'Experian';
          (value as LocalCredential).debtToIncomeRatio = 26;
          (value as LocalCredential).activeDelinquencies = 0;
          (value as LocalCredential).tier = 'Super-Prime';
        }
        return value as LocalCredential
      }
    } catch {
      // Replace malformed or legacy state with a fresh device-only credential.
    }
  }
  const credential = createCredential('Created in this browser profile')
  localStorage.setItem(KEY, JSON.stringify(credential))
  return credential
}

export function rotateCredential(): LocalCredential {
  const credential = createCredential('Regenerated local keypair')
  localStorage.setItem(KEY, JSON.stringify(credential))
  return credential
}

export function updateLocalCreditProfile(updates: Partial<Pick<LocalCredential, 'creditScore' | 'bureau' | 'debtToIncomeRatio' | 'activeDelinquencies'>>): LocalCredential {
  const current = loadCredential()
  const score = updates.creditScore ?? current.creditScore
  const updated: LocalCredential = {
    ...current,
    ...updates,
    creditScore: score,
    tier: calculateTier(score),
    issuedAt: 'Updated in local secure enclave',
  }
  localStorage.setItem(KEY, JSON.stringify(updated))
  return updated
}

export function clearCredential() {
  localStorage.removeItem(KEY)
}
