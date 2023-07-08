from sqlalchemy.orm import Session

from fivem.models.player import Player
from fivem.schemas.player_schemas import PlayerCreate, PlayerUpdate


def get_player(db: Session, id: int):
    return db.query(Player).filter(Player.id == id).first()


def get_all_players(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Player).offset(skip).limit(limit).all()


def get_player_by_player_name(db: Session, player_name: str):
    return db.query(Player).filter(Player.player_name == player_name).first()


def get_player_by_steam(db: Session, steam: str):
    return db.query(Player).filter(Player.steam == steam).first()


def get_player_by_fivem(db: Session, fivem: str):
    return db.query(Player).filter(Player.fivem == fivem).first()


def get_player_by_ip(db: Session, ip_address: str):
    return db.query(Player).filter(Player.ip_address == ip_address).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Player).offset(skip).limit(limit).all()


def create_player(db: Session, player: PlayerCreate):
    db_player = Player(
        player_name=player.player_name,
        steam=player.steam,
        fivem=player.fivem,
        ip_address=player.ip_address,
        is_logged_in=player.is_logged_in,
        is_active=player.is_active,
    )
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player


def remove_player(db: Session, id: int):
    db_player = db.query(Player).filter(Player.id == id).first()
    db.delete(db_player)
    db.commit()
    return db_player


def update_player(db: Session, id: int, player_in: PlayerUpdate):
    db_player = db.query(Player).filter(Player.id == id).first()
    db_player.player_name = player_in.player_name
    db_player.steam = player_in.steam
    db_player.fivem = player_in.fivem
    db_player.ip_address = player_in.ip_address
    db_player.is_logged_in = player_in.is_logged_in
    db_player.is_active = player_in.is_active
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player
