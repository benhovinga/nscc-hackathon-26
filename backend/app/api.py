# Python built-in library imports
from contextlib import asynccontextmanager

# Third-party library imports (pip)
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

# Module imports
from .models import Room, RoomType
from .database import create_db_and_tables, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs before app startup
    create_db_and_tables()
    yield
    # Runs after app shutdown


app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173", "localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict:
    return {"message": "Welcome to the API."}


@app.get("/rooms", response_model=list[Room])
def list_rooms():
    with Session(engine) as session:
        rooms = session.exec(select(Room)).all()
        return rooms


@app.get("/rooms/{room_id}", response_model=Room)
def get_room(room_id: int):
    with Session(engine) as session:
        room = session.exec(select(Room).where(Room.id == room_id)).one_or_none()
        if room == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return room
