# Before You Go: Europe — data foundation

Germany v1 data foundation. This repository deliberately contains no frontend,
scraper, external API integration, fuzzy matching, or review UI.

## Phase status

- Phase 1: Pydantic data shapes, SQLite schema, configuration, and canonical
  JSON placeholders.
- Phase 2: CSV/JSON import and export — not implemented yet.
- Phase 3: Class A/Class B validation and the readable quota-gap report — not
  implemented yet.

The committed files in `data/*.json` are the source of truth. SQLite is only an
editing store.

## Requirements

- Python 3.11+
- Pydantic v2
- pandas
- pytest (development)

## Setup

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -e '.[dev]'
```

## Initialize the editing database

```bash
python -m before_you_go.database --path data/curation.sqlite
```

The command is idempotent. It creates the `candidates`, `mentions`, and `works`
tables. Code that edits them should open connections through
`before_you_go.database.connect_database`, which enables SQLite foreign keys
for every connection.

## Run tests

```bash
pytest
```

## Configuration

All controlled vocabularies and quota values live in `data/config.json`.
Application code reads this file rather than duplicating those values. Copy
`.env.example` to `.env` only when local overrides are needed.
