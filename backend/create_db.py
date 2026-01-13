# Python built-in library imports
import csv
import datetime

# Third-party library imports (pip)
from sqlmodel import Session

# Module imports
from app.models import (
    Course,
    CourseSchedule,
    DaysNoClass,
    DaysNoSchool,
    Room,
    RoomBooking,
    RoomType,
    Season,
    SchoolTerm,
    WeekDay,
)
from app.database import engine, create_db_and_tables

ROOMS_DATA_FILE = "../data/rooms.csv"

def insert_rooms():
    rooms = []
    with open(ROOMS_DATA_FILE, newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            rooms.append(
                Room(
                    building_wing=row['building_wing'],
                    building_floor=int(row['building_floor']),
                    room_number=row['room_number'],
                    room_type=RoomType[row['room_type']]
                )
            )

    with Session(engine) as session:
        for room in rooms:
            session.add(room)
        session.commit()


def insert_school_term():
    with Session(engine) as session:
        session.add(
            SchoolTerm(
                season=Season.winter,
                startDate=datetime.date(year=2026, month=1, day=5),
                endDate=datetime.date(year=2026, month=4, day=15),
            )
        )
        session.commit()


def insert_courses():
    with Session(engine) as session:
        session.add(
            Course(
                code="OSYS1000",
                name="Operating Systems - Linux",
                instructor="Smith, Ryan",
                school_term=1,
            )
        )
        session.commit()


def insert_course_schedule():
    with Session(engine) as session:
        session.add(
            CourseSchedule(
                day_of_Week=WeekDay.MONDAY,
                start_time=datetime.time(hour=8, minute=30),
                end_time=datetime.time(hour=10, minute=30),
                course=1,
                room=2,
            )
        )
        session.add(
            CourseSchedule(
                day_of_Week=WeekDay.WEDNESDAY,
                start_time=datetime.time(hour=10, minute=30),
                end_time=datetime.time(hour=12, minute=20),
                course=1,
                room=4,
            )
        )
        session.commit()


def insert_days_no_school():
    days_no_school = [
        DaysNoSchool(date=datetime.date(year=2026, month=2, day=16)),
        DaysNoSchool(date=datetime.date(year=2026, month=4, day=3)),
        DaysNoSchool(date=datetime.date(year=2026, month=4, day=6)),
    ]
    with Session(engine) as session:
        for day in days_no_school:
            session.add(day)
        session.commit()


def insert_days_no_class():
    days_no_class = [
        DaysNoClass(date=datetime.date(year=2026, month=2, day=25)),
        DaysNoClass(date=datetime.date(year=2026, month=3, day=16)),
        DaysNoClass(date=datetime.date(year=2026, month=3, day=17)),
        DaysNoClass(date=datetime.date(year=2026, month=3, day=18)),
        DaysNoClass(date=datetime.date(year=2026, month=3, day=19)),
        DaysNoClass(date=datetime.date(year=2026, month=3, day=20)),
    ]
    with Session(engine) as session:
        for day in days_no_class:
            session.add(day)
        session.commit()


def insert_sample_room_booking():
    with Session(engine) as session:
        session.add(
            RoomBooking(
                title="sample booking",
                start_date_time=datetime.datetime(
                    year=2026, month=1, day=19, hour=8, minute=30
                ),
                end_date_time=datetime.datetime(
                    year=2026, month=1, day=19, hour=10, minute=30
                ),
                room=4,
                is_private=True,
                booked_by="Ben Hovinga",
                school_term=1,
            )
        )


if __name__ == "__main__":
    create_db_and_tables()
    insert_rooms()
    insert_school_term()
    insert_courses()
    insert_course_schedule()
    insert_days_no_school()
    insert_days_no_class()
    insert_sample_room_booking()
