export interface LendingTier {
  id: string
  name: string
  minScore: number
  maxDti: number
  tag: string
  rate: string
  description: string
}

export const LENDING_TIERS: LendingTier[] = [
  {
    id: 'super-prime',
    name: 'Super-Prime Tier',
    minScore: 780,
    maxDti: 30,
    tag: 'Jumbo & Premium Mortgages',
    rate: 'Competitive Rate (4.2% APR)',
    description: 'Top-tier creditworthiness. Requires score >= 780, DTI <= 30%, and zero delinquencies in 24 months.'
  },
  {
    id: 'prime',
    name: 'Prime Lending Tier',
    minScore: 720,
    maxDti: 40,
    tag: 'Standard Financing',
    rate: 'Prime Rate (5.8% APR)',
    description: 'Qualified consumer & mortgage tier. Requires score >= 720, DTI <= 40%, and zero active defaults.'
  },
  {
    id: 'near-prime',
    name: 'Near-Prime Tier',
    minScore: 660,
    maxDti: 48,
    tag: 'Auto & Personal Loans',
    rate: 'Standard Rate (7.5% APR)',
    description: 'Eligible for auto loans and credit expansion. Requires score >= 660 and absence of recent defaults.'
  },
  {
    id: 'starter',
    name: 'Credit Starter Tier',
    minScore: 600,
    maxDti: 50,
    tag: 'Fintech Micro-Credit',
    rate: 'Tier 4 Rate (9.8% APR)',
    description: 'Entry-level verification for decentralized micro-loans and secured credit limits.'
  }
]
