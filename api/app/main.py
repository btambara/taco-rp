from fastapi import FastAPI
from api.api_v1.api import player_router

app = FastAPI()
app.include_router(player_router, prefix="/api/v1")
