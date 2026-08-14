"""Configuration loading for the v2.0 frontend vocabularies."""

from __future__ import annotations

import json
from pathlib import Path

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ThemeConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    label: str = Field(min_length=1)
    fill: str = Field(min_length=1)
    ink: str = Field(min_length=1)


class ThemeTagConfig(ThemeConfig):
    home_theme: str = Field(min_length=1)
    count: int = Field(ge=0)


class FacetsConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    theme_main: list[ThemeConfig] = Field(min_length=1)


class DestinationConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(min_length=1)
    name_zh: str = Field(min_length=1)
    name_original: str = Field(min_length=1)
    signature: dict[str, str]
    intro: dict[str, str]


class ProjectConfig(BaseModel):
    model_config = ConfigDict(extra="allow")

    destination: DestinationConfig
    facets: FacetsConfig
    theme_tags: list[ThemeTagConfig] = Field(min_length=1)
    periods: list[str] = Field(min_length=1)

    @model_validator(mode="after")
    def home_themes_exist(self) -> "ProjectConfig":
        known = {theme.label for theme in self.facets.theme_main}
        invalid = {
            tag.label: tag.home_theme
            for tag in self.theme_tags
            if tag.home_theme not in known
        }
        if invalid:
            raise ValueError(f"theme_tags reference unknown home themes: {invalid}")
        return self


def load_config(path: str | Path = "data/config.json") -> ProjectConfig:
    with Path(path).open(encoding="utf-8") as handle:
        return ProjectConfig.model_validate(json.load(handle))
