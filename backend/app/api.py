from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .models import Room
    

fake_rooms_db: list[Room] = [
    Room(
        id=1,
        room_number="D225",
        building_wing="D",
        building_floor=2,
        room_type=Room.Type.classroom_lab
    ),
    Room(
        id=2,
        room_number="D227",
        building_wing="D",
        building_floor=2,
        room_type=Room.Type.classroom_lab
    ),
]


app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to the API."}


@app.get("/room", tags=["room"], response_model=list[Room])
async def list_rooms() -> list[Room]:
    return fake_rooms_db


@app.get("/room/{room_id}", tags=["room"], response_model=Room)
async def get_room(room_id: int) -> Room:
    for room in fake_rooms_db:
        if room.id == room_id:
            return room
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
