# Python built-in library imports
from contextlib import asynccontextmanager

# Third-party library imports (pip)
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

# Module imports
from .models import Course, CourseSchedule, Room, RoomType
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
def list_rooms(
    room_type: str | None = None,
    building_wing: str | None = None,
    building_floor: int | None = None,
):
    filters = []
    if room_type and room_type in RoomType:
        filters.append(Room.room_type == room_type)
    if building_wing:
        filters.append(Room.building_wing == building_wing)
    if building_floor:
        filters.append(Room.building_floor == building_floor)

    with Session(engine) as session:
        if len(filters) > 0:
            rooms = session.exec(select(Room).where(*filters)).all()
        else:
            rooms = session.exec(select(Room)).all()
        return rooms


@app.get("/rooms/types", response_model=list[RoomType])
def list_room_types():
    return list(RoomType)


@app.get("/rooms/{room_number}", response_model=Room)
def get_room(room_number: str):
    with Session(engine) as session:
        room = session.exec(
            select(Room).where(Room.room_number == room_number.upper())
        ).one_or_none()
        if room == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return room


@app.get("/rooms/{room_number}/schedule", response_model=list[CourseSchedule])
def get_room_schedule(room_number: str):
    with Session(engine) as session:
        schedule = session.exec(
            select(CourseSchedule).where(CourseSchedule.room == room_number.upper())
        ).all()
        if schedule == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return schedule


@app.get("/courses", response_model=list[Course])
def list_courses(instructor: str | None = None, school_term: int | None = None):
    filters = []
    if instructor:
        filters.append(Course.instructor == instructor)
    if school_term:
        filters.append(Course.school_term == school_term)

    # Find courses using the list of conditionals with "where"
    with Session(engine) as session:
        if len(filters) > 0:
            courses = session.exec(select(Course).where(*filters)).all()
        else:
            # Run if no filters were appended, returns all courses
            courses = session.exec(select(Course)).all()
        return courses


@app.get("/courses/{course_id}", response_model=Course)
def get_course(course_id: int):
    with Session(engine) as session:
        course = session.exec(
            select(Course).where(Course.id == course_id)
        ).one_or_none()
        if course == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return course


@app.get("/courses/{course_id}/schedule", response_model=list[CourseSchedule])
def get_course_schedule(course_id: int):
    with Session(engine) as session:
        schedule = session.exec(
            select(CourseSchedule).where(CourseSchedule.course == course_id)
        ).all()
        if schedule == None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        return schedule
