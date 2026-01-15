# Python built-in library imports
import datetime
from enum import Enum

# Third-party library imports (pip)
from sqlmodel import Field, SQLModel


class Season(str, Enum):
    spring = "spring"
    summer = "summer"
    fall = "fall"
    winter = "winter"


class RoomType(str, Enum):
    classroom = "classroom"
    computer_classroom = "computer_classroom"
    network_computer_classroom = "network_computer_classroom"
    lab_classroom = "lab_classroom"
    shop = "shop"
    project_room = "project_room"


class WeekDay(str, Enum):
    sunday = "sunday"
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"
    saturday = "saturday"


class DaysNoClass(SQLModel, table=True):
    date: datetime.date = Field(primary_key=True)


class DaysNoSchool(SQLModel, table=True):
    date: datetime.date = Field(primary_key=True)


class SchoolTerm(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    season: Season
    startDate: datetime.date
    endDate: datetime.date


class Room(SQLModel, table=True):
    room_number: str = Field(primary_key=True)
    building_wing: str
    building_floor: int
    room_type: RoomType


class Course(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    code: str = Field(index=True)
    name: str
    instructor: str
    school_term: int = Field(foreign_key="schoolterm.id")


class CourseSchedule(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    day_of_Week: WeekDay
    start_time: datetime.time
    end_time: datetime.time
    course: int = Field(foreign_key="course.id")
    room: str = Field(foreign_key="room.room_number")
