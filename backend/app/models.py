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
    classroom_lab = "classroom_lab"
    classroom_lecture = "classroom_lecture"
    study_room = "study_room"


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
    id: int | None = Field(default=None, primary_key=True)
    room_number: str = Field(index=True)
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
    day_of_Week: int
    start_time: datetime.time
    end_time: datetime.time
    course: int = Field(foreign_key="course.id")
    room: int = Field(foreign_key="room.id")


class RoomBooking(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    start_date_time: datetime.datetime
    end_date_time: datetime.datetime
    is_private: bool | None = Field(default=False)
    booked_by: str
    school_term: int = Field(foreign_key="schoolterm.id")
    room: int = Field(foreign_key="room.id")
