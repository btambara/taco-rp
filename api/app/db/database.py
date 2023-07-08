from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.fivem.models import player

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:example@db/tacoRPDb"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

player.Base.metadata.create_all(bind=engine)
