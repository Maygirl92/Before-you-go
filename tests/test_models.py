from datetime import date

import pytest
from pydantic import ValidationError

from before_you_go.models import Candidate, Mention


def test_candidate_rejects_unknown_fields() -> None:
    with pytest.raises(ValidationError):
        Candidate.model_validate(
            {
                "id": "cand-00001",
                "destination": "de",
                "title_raw": "示例",
                "status": "candidate",
                "created_at": date(2026, 7, 20),
                "unexpected": True,
            }
        )


def test_mention_uses_the_documented_source_vocabulary() -> None:
    mention = Mention.model_validate(
        {
            "id": "m-00001",
            "candidate_id": "cand-00001",
            "source_type": "institution",
            "source_name": "bpb Filmheft",
            "observed_at": "2026-07-21",
        }
    )

    assert mention.source_type == "institution"

