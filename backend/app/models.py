# Python built-in library imports
from enum import Enum

# Third-party library imports (pip)
from sqlmodel import Field, SQLModel


class RoomType(str, Enum):
    classroom_lab = "classroom_lab"
    classroom_lecture = "classroom_lecture"
    study_room = "study_room"


class Room(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    room_number: str
    building_wing: str
    building_floor: int
    room_type: RoomType
