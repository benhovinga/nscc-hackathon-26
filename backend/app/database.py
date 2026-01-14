# Third-party library imports (pip)
from sqlmodel import SQLModel, create_engine

# SQLite configuration
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# Database engine configuration
connection_args = {"check_same_thread": False}

# Create the database engine (handles communication with the database)
engine = create_engine(sqlite_url, echo=True, connect_args=connection_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
