# Alembic

[Alembic](https://alembic.sqlalchemy.org/) is a lightweight database migration tool for usage with the SQLAlchemy Database Toolkit for Python.

## Quick Start

Ensure containers are running.

``` bash
$ docker compose up -d --build
\\ Starts the containers
```

### Auto Generating Migrations

``` bash
$ docker exec -it taco-rp-api alembic revision --autogenerate -m ${MESSAGE}
\ INFO [alembic.context] Detected added table 'player'
\ Generating /path/to/foo/alembic/versions/27c6a30d7c24.py...done

```

### Running Migrations

``` bash
$ docker exec -it taco-rp-api alembic upgrade head
\ INFO  [alembic.context] Context class PostgresqlContext.
\ INFO  [alembic.context] Will assume transactional DDL.
\ INFO  [alembic.context] Running upgrade 27c6a30d7c24 -> ae1027a6acf
```
