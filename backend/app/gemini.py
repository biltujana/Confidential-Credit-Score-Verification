import hashlib
from .privacy import redact_public_text
from .schemas import PlanRequest, ProofPlan
from .settings import settings


def fallback_plan(request: PlanRequest) -> ProofPlan:
    return ProofPlan(
        public_claim="Credit eligibility evaluation: qualified or disqualified",
        private_checks=[
            "Validate credit bureau Jubjub-Schnorr signature",
            "Evaluate credit tier threshold inside local ZK circuit",
            "Verify absence of active delinquencies and default flags",
        ],
        disclosure_explanation="Only the binary credit eligibility result and a one-time nullifier are posted on-chain. The raw credit score, bureau account IDs, and debt metrics remain entirely private in the user's browser.",
        provider="deterministic-local-fallback",
    )


async def compose_proof_plan(request: PlanRequest) -> tuple[ProofPlan, str]:
    sanitized = redact_public_text(request.public_requirement)
    request_hash = hashlib.sha256(sanitized.encode()).hexdigest()
    if not settings.gemini_api_key:
        return fallback_plan(request), request_hash
    # Only public lending policy language and approved tier labels are eligible for this prompt.
    from google import genai

    client = genai.Client(api_key=settings.gemini_api_key)
    prompt = (
        f"Return a short privacy-safe verifier plan for this public credit policy: {sanitized}. "
        f"Approved tier labels: {request.approved_labels}. "
        "Never request raw credit scores, SSNs, bank statements, wallet addresses, secrets, or financial documents."
    )
    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash", contents=prompt
        )
        text = response.text or ""
        return ProofPlan(
            public_claim="Credit eligibility evaluation: qualified or disqualified",
            private_checks=[
                "Verify bureau Schnorr signature on credit predicates",
                "Execute local Midnight ZK circuit against lending policy",
            ],
            disclosure_explanation=text[:500] or fallback_plan(request).disclosure_explanation,
            provider="gemini",
        ), request_hash
    except Exception:
        return fallback_plan(request), request_hash
