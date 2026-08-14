"""Pydantic v2 data shapes for the three-table curation model."""

from __future__ import annotations

from datetime import date
from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)


class CandidateStatus(StrEnum):
    CANDIDATE = "candidate"
    VERIFYING = "verifying"
    VERIFIED = "verified"
    PUBLISHED = "published"
    REJECTED = "rejected"


class Channel(StrEnum):
    STANDARD = "standard"
    SUPPLEMENTARY = "supplementary"


class Medium(StrEnum):
    SCREEN = "影像"
    BOOK = "书籍"
    MUSIC = "音乐"


class MediumSub(StrEnum):
    FILM = "电影"
    DOCUMENTARY = "纪录片"
    SERIES = "剧集"
    NOVEL = "小说"
    NONFICTION = "非虚构"
    ESSAY = "散文"
    ALBUM = "专辑"
    SINGLE = "单曲"


class SourceType(StrEnum):
    INSTITUTION = "institution"
    ACADEMIC = "academic"
    AWARD = "award"
    PRESS = "press"
    LOCAL = "local"
    PLATFORM = "platform"


class GapDimension(StrEnum):
    REGION = "region"
    LENS = "lens"
    PERIOD = "period"
    THEME = "theme"
    CONTEMPORARY = "contemporary"


class TimeCost(StrEnum):
    ONE_EVENING = "一个晚上"
    SEVERAL_EVENINGS = "数个晚上"
    LONG_TERM = "长线投入"


class Lens(StrEnum):
    LOCAL = "本地视角"
    OUTSIDE = "外来视角"
    CROSS_CULTURAL = "移民与跨文化视角"


class ChineseEditionStatus(StrEnum):
    PUBLISHED_TRANSLATION = "published_translation"
    SUBTITLES_AVAILABLE = "subtitles_available"
    NOT_APPLICABLE = "not_applicable"


class GapFilled(StrictModel):
    dimension: GapDimension
    value: str = Field(min_length=1)


class Extent(StrictModel):
    unit: str = Field(min_length=1)
    value: int | float = Field(gt=0)


class ChineseEdition(StrictModel):
    status: ChineseEditionStatus
    publisher: str | None = None
    translator: str | None = None
    note: str | None = None


class Cover(StrictModel):
    source: str = Field(min_length=1)
    url: HttpUrl
    license: str = Field(min_length=1)


class Candidate(StrictModel):
    id: str = Field(min_length=1)
    qid: str | None = None
    destination: str = Field(min_length=1)
    title_raw: str = Field(min_length=1)
    title_normalized: str | None = None
    medium_guess: Medium | None = None
    status: CandidateStatus
    channel: Channel | None = None
    gap_filled: GapFilled | None = None
    rejected_reason: str | None = None
    approved_by: str | None = None
    approved_at: date | None = None
    created_at: date


class Mention(StrictModel):
    id: str = Field(min_length=1)
    candidate_id: str = Field(min_length=1)
    source_type: SourceType
    source_name: str = Field(min_length=1)
    source_url: HttpUrl | None = None
    observed_at: date
    stated_reason: str | None = None
    engagement_band: str | None = None
    keyword: str | None = None


class Work(StrictModel):
    id: str = Field(min_length=1)
    candidate_id: str = Field(min_length=1)
    qid: str | None = None
    destination: str = Field(min_length=1)
    sort_order: int = Field(ge=1)
    medium: Medium
    medium_sub: MediumSub
    title_zh: str = Field(min_length=1)
    title_original: str | None = None
    creator: str = Field(min_length=1)
    creator_original: str | None = None
    work_country: str | None = None
    creator_country: str = Field(min_length=1)
    setting_country: list[str] = Field(min_length=1)
    year: int
    extent: Extent | None = None
    extent_note: str | None = None
    recommended_cn_edition: str | None = None
    time_cost: TimeCost | None = None
    time_cost_reason: str | None = None
    lens: Lens
    regions: list[str]
    periods: list[str] = Field(default_factory=list)
    theme_main: list[str]
    theme_tags: list[str]
    awards: list[str] = Field(default_factory=list)
    summary_zh: str = Field(min_length=1)
    relation_zh: str = Field(min_length=1)
    reason_zh: str = Field(min_length=1)
    cn_edition: ChineseEdition
    content_notes: list[str] | None = None
    cover: Cover | None = None
    access: list[dict[str, Any]] = Field(default_factory=list)
    signal_sitelinks: int | None = Field(default=None, ge=0)
    signal_tmdb_votes: int | None = Field(default=None, ge=0)
    signals_updated_at: date | None = None
    verified_by: str = Field(min_length=1)
    verified_at: date

