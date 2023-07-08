from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String, unique=True, index=True)
    steam = Column(String, unique=True, index=True)
    fivem = Column(String, unique=True, index=True)
    ip_address = Column(String)
    is_logged_in = Column(Boolean, default=False)
    is_active = Column(Boolean, default=False)
