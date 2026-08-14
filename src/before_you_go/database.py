"""Create the local SQLite editing database."""

from __future__ import annotations

import argparse
import sqlite3
from importlib.resources import files
from pathlib import Path


def connect_database(path: str | Path) -> sqlite3.Connection:
    """Open a SQLite connection with the repository's required settings."""
    connection = sqlite3.connect(Path(path))
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def initialize_database(path: str | Path) -> Path:
    database_path = Path(path)
    database_path.parent.mkdir(parents=True, exist_ok=True)
    schema = files("before_you_go").joinpath("schema.sql").read_text(encoding="utf-8")

    with connect_database(database_path) as connection:
        connection.executescript(schema)

    return database_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Initialize the SQLite editing database.")
    parser.add_argument("--path", default="data/curation.sqlite", help="SQLite database path")
    args = parser.parse_args()
    created = initialize_database(args.path)
    print(f"SQLite editing database ready: {created}")


if __name__ == "__main__":
    main()
