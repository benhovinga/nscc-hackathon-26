from sqlmodel import Session
from app.models import Room, RoomType
from app.database import engine, create_db_and_tables


def insert_all_rooms():
    rooms = [
        Room(
            room_number="D127",
            building_wing="D",
            building_floor=1,
            room_type=RoomType.classroom_lab,
        ),
        Room(
            room_number="D125",
            building_wing="D",
            building_floor=1,
            room_type=RoomType.classroom_lab,
        ),
        Room(
            room_number="D225",
            building_wing="D",
            building_floor=2,
            room_type=RoomType.classroom_lab,
        ),
        Room(
            room_number="D227",
            building_wing="D",
            building_floor=2,
            room_type=RoomType.classroom_lab,
        ),
        Room(
            room_number="D325",
            building_wing="D",
            building_floor=3,
            room_type=RoomType.classroom_lab,
        ),
        Room(
            room_number="D327",
            building_wing="D",
            building_floor=3,
            room_type=RoomType.classroom_lab,
        ),
    ]

    with Session(engine) as session:
        for room in rooms:
            session.add(room)
        session.commit()


if __name__ == "__main__":
    create_db_and_tables()
    insert_all_rooms()
