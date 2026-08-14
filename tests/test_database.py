import sqlite3

from before_you_go.database import connect_database, initialize_database


def test_initialize_database_creates_three_tables(tmp_path) -> None:
    database_path = initialize_database(tmp_path / "curation.sqlite")

    with sqlite3.connect(database_path) as connection:
        tables = {
            row[0]
            for row in connection.execute(
                "SELECT name FROM sqlite_master WHERE type = 'table'"
            )
        }

    assert {"candidates", "mentions", "works"} <= tables


def test_sort_order_is_unique_per_destination(tmp_path) -> None:
    database_path = initialize_database(tmp_path / "curation.sqlite")

    with sqlite3.connect(database_path) as connection:
        indexes = list(connection.execute("PRAGMA index_list('works')"))

    assert any(index[2] == 1 for index in indexes)


def test_project_connections_enable_foreign_keys(tmp_path) -> None:
    database_path = initialize_database(tmp_path / "curation.sqlite")

    with connect_database(database_path) as connection:
        enabled = connection.execute("PRAGMA foreign_keys").fetchone()[0]

    assert enabled == 1
