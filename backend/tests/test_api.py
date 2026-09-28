import asyncio
import os
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
import pytest
from sqlalchemy import delete
from fastapi.testclient import TestClient

TEST_DATABASE = Path(tempfile.gettempdir()) / f"creditscore-{uuid4().hex}.db"
os.environ["DATABASE_URL"] = f"sqlite+aiosqlite:///{TEST_DATABASE.as_posix()}"

from app.db import PublicReceipt, SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture(scope="session", autouse=True)
def isolated_database():
    yield
    asyncio.run(engine.dispose())
    TEST_DATABASE.unlink(missing_ok=True)


def clear_receipts():
    async def clear():
        async with SessionLocal() as session:
            await session.execute(delete(PublicReceipt))
            await session.commit()

    asyncio.run(clear())


def payload(**overrides):
    token = str(datetime.now(timezone.utc).timestamp()).replace(".", "")
    suffix = token[-12:].rjust(12, "0")
    base = {
        "transaction_id": f"tx_{token}",
        "transaction_hash": f"0x{'a' * 52}{suffix}",
        "contract_address": "b" * 64,
        "receipt_type": "proof",
        "disclosure_scope": "eligible",
        "nullifier": f"nullifier_{token}",
        "network": "preview",
        "block_height": 123,
        "finalized_at": datetime.now(timezone.utc).isoformat(),
    }
    return base | overrides


def test_health():
    with TestClient(app) as client:
        res = client.get("/api/health").json()
        assert res["status"] == "ok"
        assert "financial data" in res["privacy"]


def test_gemini_fallback_and_hash():
    with TestClient(app) as client:
        data = client.post(
            "/api/proof-plan",
            json={
                "public_requirement": "Prime credit tier score 720 and no delinquency",
                "approved_labels": ["eligible", "ineligible"],
            },
        ).json()
        assert data["plan"]["provider"] == "deterministic-local-fallback"
        assert len(data["public_request_hash"]) == 64


def test_private_policy_text_is_rejected():
    with TestClient(app) as client:
        assert (
            client.post(
                "/api/proof-plan", json={"public_requirement": "my credit_score is 780"}
            ).status_code
            == 422
        )


def test_receipt_validation_rejects_private_fields():
    with TestClient(app) as client:
        data = payload()
        data["witness"] = "never"
        assert client.post("/api/receipts", json=data).status_code == 422


def test_receipt_and_metrics():
    with TestClient(app) as client:
        clear_receipts()
        assert client.post("/api/receipts", json=payload()).status_code == 201
        assert client.get("/api/metrics").json() == {
            "finalized_proofs": 1,
            "eligible_proofs": 1,
            "private_attributes_stored": 0,
        }


def test_nullifier_cannot_be_reused():
    with TestClient(app) as client:
        clear_receipts()
        receipt = payload()
        client.post("/api/receipts", json=receipt)
        assert (
            client.post(
                "/api/receipts",
                json=payload(
                    transaction_id="tx_abcdefghijk12345",
                    transaction_hash="0x" + "c" * 64,
                    nullifier=receipt["nullifier"],
                ),
            ).status_code
            == 409
        )


def test_receipt_can_be_retrieved_after_persistence():
    with TestClient(app) as client:
        clear_receipts()
        receipt = payload()
        client.post("/api/receipts", json=receipt)
        assert (
            client.get(f"/api/receipts/{receipt['transaction_id']}").json()["nullifier"]
            == receipt["nullifier"]
        )


def test_identical_receipt_post_is_idempotent():
    with TestClient(app) as client:
        clear_receipts()
        receipt = payload()
        assert client.post("/api/receipts", json=receipt).status_code == 201
        assert client.post("/api/receipts", json=receipt).status_code == 201


def test_deployment_receipt_keeps_chain_identifiers_without_private_fields():
    with TestClient(app) as client:
        clear_receipts()
        receipt = payload(
            receipt_type="deployment",
            disclosure_scope=None,
            nullifier=None,
            transaction_hash="0x" + "d" * 64,
        )
        response = client.post("/api/receipts", json=receipt)
        assert response.status_code == 201
        body = response.json()
        assert body["contract_address"] == "b" * 64
        assert body["transaction_hash"] == "0x" + "d" * 64
        assert client.get("/api/metrics").json()["finalized_proofs"] == 0
