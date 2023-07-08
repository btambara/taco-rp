from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api.deps import get_db

from app.fivem.models.player import Player
from app.fivem.crud import player_crud
from app.fivem.schemas import player_schemas

router = APIRouter()


@router.post("/", response_model=player_schemas.Player)
def create_player(
    *,
    db: Session = Depends(get_db),
    player: player_schemas.PlayerCreate,
) -> Player:
    """
    Create new player.
    """
    player = player_crud.create_player(db=db, player=player)
    return player


@router.get("/{id}", response_model=player_schemas.Player)
def read_player(
    *,
    db: Session = Depends(get_db),
    id: int,
) -> Player:
    """
    Get player by ID.
    """
    player = player_crud.get_player(db=db, id=id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    return player


@router.get("/playername/{player_name}", response_model=player_schemas.Player)
def read_player_by_player_name(
    *,
    db: Session = Depends(get_db),
    player_name: str,
) -> Player:
    """
    Get player by player_name.
    """
    player = player_crud.get_player_by_player_name(db=db, player_name=player_name)
    if not player:
        raise HTTPException(status_code=404, detail="No player with that name")
    return player


@router.get("/steam/{steam}", response_model=player_schemas.Player)
def read_player_by_steam(
    *,
    db: Session = Depends(get_db),
    steam: str,
) -> Player:
    """
    Get player by steam.
    """
    player = player_crud.get_player_by_steam(db=db, steam=steam)
    if not player:
        raise HTTPException(status_code=404, detail="No player with that steam")
    return player


@router.get("/fivem/{fivem}", response_model=player_schemas.Player)
def read_player_by_fivem(
    *,
    db: Session = Depends(get_db),
    fivem: str,
) -> Player:
    """
    Get player by fivem.
    """
    player = player_crud.get_player_by_fivem(db=db, fivem=fivem)
    if not player:
        raise HTTPException(status_code=404, detail="No player with that fivem")
    return player


@router.put("/{id}", response_model=player_schemas.Player)
def update_player(
    *,
    db: Session = Depends(get_db),
    id: int,
    player_in: player_schemas.PlayerUpdate,
) -> Player:
    """
    Update an player.
    """
    player = player_crud.get_player(db=db, id=id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    player = player_crud.update_player(db=db, id=id, player_in=player_in)
    return player


@router.delete("/{id}", response_model=player_schemas.Player)
def delete_player(
    *,
    db: Session = Depends(get_db),
    id: int,
) -> Player:
    """
    Delete an player.
    """
    player = player_crud.get_player(db=db, id=id)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found")
    player = player_crud.remove_player(db=db, id=id)
    return player


@router.get("/", response_model=list[player_schemas.Player])
def read_all_players(
    *,
    db: Session = Depends(get_db),
) -> List[Player]:
    """
    Get all players.
    """
    return player_crud.get_all_players(db=db)
