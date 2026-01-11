from enum import Enum
from pydantic import BaseModel


class Room(BaseModel):
    class Type(str, Enum):
        classroom_lab = "classroom_lab"
        classroom_lecture = "classroom_lecture"
        study_room = "study_room"

    id: int
    room_number: str
    building_wing: str
    building_floor: int
    room_type: Type
