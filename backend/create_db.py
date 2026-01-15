# Python built-in library imports
import os
import csv
import datetime

# Third-party library imports (pip)
from sqlmodel import Session, select

# Module imports
from app.models import (
    Course,
    CourseSchedule,
    DaysNoClass,
    DaysNoSchool,
    Room,
    RoomType,
    Season,
    SchoolTerm,
    WeekDay,
)
from app.database import engine, create_db_and_tables


ROOMS_DATA_FILE = "../data/rooms.csv"
COURSE_SCHEDULES_DATA_FILE = "../data/course_schedules.csv"


def insert_rooms():
    rooms = []
    with open(ROOMS_DATA_FILE, newline="") as file:
        reader = csv.DictReader(file)
        for row in reader:
            if (
                not isinstance(row["room_number"][0], str)
                or not row["room_number"][1:4].isdigit()
            ):
                # If the room doesn't start with a letter or the numbers are invalid raise an error
                raise ValueError(
                    f"Value of room_number {row['room_number']} must be formatted X123."
                )
            rooms.append(
                Room(
                    building_wing=row["building_wing"].upper(),
                    building_floor=int(row["building_floor"]),
                    room_number=row["room_number"].upper(),
                    room_type=RoomType[row["room_type"].lower()],
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


def insert_course_schedules():
    courses = []
    with open(COURSE_SCHEDULES_DATA_FILE, newline="") as file:
        file_data = tuple(csv.DictReader(file))

    # Load the courses from the data file
    for row in file_data:
        course = Course(
            code=row["course_code"],
            name=row["course_name"],
            instructor=row["course_instructor"],
            school_term=1,
        )
        # Ensure no duplicate entries
        if course not in courses:
            courses.append(course)

    # Add the courses to the database
    with Session(engine) as session:
        for course in courses:
            session.add(course)
        session.commit()

        # Load the course schedules and map to the course id from the database
        for row in file_data:
            course = session.exec(
                select(Course).where(
                    Course.code == row["course_code"],
                    Course.instructor == row["course_instructor"],
                )
            ).one()
            # Add the schedule to the database
            session.add(
                CourseSchedule(
                    day_of_Week=WeekDay(row["day_of_week"]),
                    start_time=datetime.datetime.strptime(
                        row["start_time"], "%I:%M %p"
                    ).time(),
                    end_time=datetime.datetime.strptime(
                        row["end_time"], "%I:%M %p"
                    ).time(),
                    course=course.id,  # type: ignore
                    room=row["room_number"],
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


if __name__ == "__main__":
    try:
        print("Removing previous database file.")
        os.remove("database.db")
    except FileNotFoundError:
        print("Database file not found.")

    print("Creating new database")
    create_db_and_tables()

    print("Inserting rooms")
    insert_rooms()

    print("Inserting school terms")
    insert_school_term()

    print("Inserting course schedules")
    insert_course_schedules()

    print("Inserting days no school and days no class.")
    insert_days_no_school()
    insert_days_no_class()
