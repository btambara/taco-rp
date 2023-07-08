from pydantic import BaseModel


class PlayerBase(BaseModel):
    player_name: str
    steam: str
    fivem: str
    ip_address: str
    is_logged_in: bool
    is_active: bool


class PlayerCreate(PlayerBase):
    pass


class PlayerUpdate(PlayerBase):
    pass


class Player(PlayerBase):
    id: int

    class Config:
        orm_mode = True
