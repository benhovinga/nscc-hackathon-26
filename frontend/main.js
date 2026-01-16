const API_BASE = "http://127.0.0.1:8000";

const WEEKDAYS = ['monday','tuesday','wednesday','thursday','friday'];

const TIME_SLOTS = [
    '08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','17:00',
];


function updateRoomList(rooms) {
    const buildRow = (roomNumber) => {
        // Create new list item
        const li = document.createElement("li");
        li.classList.add("room-item");
        li.textContent = roomNumber;

        // Create new link
        const link = document.createElement("a");
        link.href = "schedule.html?room_number=" + roomNumber;
        link.classList.add("schedule-link");
        link.textContent = "See Schedule";

        // Append the link to the list item
        li.appendChild(link);

        // Return the built row
        return li;
    }
    // Locate the room list in the DOM
    const roomListElem = document.querySelector("#room-list ul");
    // Clear the room list
    roomListElem.innerHTML = "";
    if (rooms.length > 0){
        // Add each room to the list
        rooms.forEach(room => {
            roomListElem.appendChild(buildRow(room.room_number));
        });
    } else {
        // No rooms were found
        const li = document.createElement("li");
        li.classList.add("room-not-found");
        li.textContent = "No rooms found.";
        roomListElem.append(li);
    }
}


function loadRoomList(roomType = "", buildingWing = "", buildingFloor = "") {
    // Build the request url with query parameters
    const requestURL = new URL(API_BASE + "/rooms");
    if (roomType) requestURL.searchParams.set("room_type", roomType);
    if (buildingWing) requestURL.searchParams.set("building_wing", buildingWing);
    if (buildingFloor) requestURL.searchParams.set("building_floor", buildingFloor);
    console.debug("DEBUG:", "Request URL", requestURL);

    // Make the API request
    fetch(requestURL)
        .then((response) => response.json())
        .then((json) => updateRoomList(json))
        //.catch((reason) => console.error(reason));
}


// Converts time in formats like 7:30 to minutes like 450 minutes so we can do some sweet maths with it
function toMinutes(time) {
    const [h, m, _] = time.split(':').map(Number);
    return h * 60 + m;
}


// This functions get the difference between the minute value of our start and end parameters from the database
// This will give a value like 1 or 2.5 which we can now use to multiply by a standard unit like 3rem to give the length of the information block.
function getDurationHours(start, end) {
    return (toMinutes(end) - toMinutes(start)) / 60;
}


// This function get how far away from our zero point a block will start.
// This will give a value like one or 2.5 which we can now use to multiply by a standard unit like 3rem to get how far away our information block will be from the starting point
function getOffsetHours(time) {
    return (toMinutes(time) - toMinutes(TIME_SLOTS[0])) / 60;
}


function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date(0, 0, 1, hours, minutes);
    return date.toLocaleString('en-US', {hour: 'numeric', minute: '2-digit', hour12: true});
}


function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


function renderSchedule(data) {
    // Clears the schedule
    const container = document.getElementById('schedule');
    container.innerHTML = '';

    // TIME COLUMN
    const timeCol = document.createElement('div');
    timeCol.className = 'time-column';
    timeCol.ariaHidden = true;
    const timeHeader = document.createElement('div');
    timeHeader.className = 'day-header';
    timeCol.appendChild(timeHeader);

    TIME_SLOTS.forEach(t => {
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = t;
        timeCol.appendChild(label);
    });
    container.appendChild(timeCol);

    // GROUP BOOKINGS BY DAY
    const byDay = {};
    data.forEach(entry => {
        if (!byDay[entry.day_of_week]) byDay[entry.day_of_week] = [];
        byDay[entry.day_of_week].push(entry);
    });

    // DAY COLUMNS
    WEEKDAYS.forEach(day => {
        const dayCol = document.createElement('div');
        dayCol.className = 'day-column';

        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = toTitleCase(day);
        dayCol.appendChild(header);

        const headerHeight = timeHeader.offsetHeight;

        TIME_SLOTS.forEach(() => {
            const row = document.createElement('div');
            row.className = 'hour-row';
            row.ariaHidden = true;
            dayCol.appendChild(row);
        });

        (byDay[day] || []).forEach(entry => {
            const {
                start_time: startTime,
                end_time: endTime,
                course_code: courseCode,
                course_name: courseName,
                course_instructor: courseInstructor
            } = entry;
            const duration = getDurationHours(startTime, endTime);
            const offset = getOffsetHours(startTime);

            const codeElem = document.createElement('div');
            codeElem.classList.add('course-code');
            codeElem.innerText = courseCode;

            const nameElem = document.createElement('div');
            nameElem.classList.add('course-name');
            nameElem.innerText = courseName;

            const instructorElem = document.createElement('div');
            instructorElem.classList.add('course-instructor');
            instructorElem.innerText = courseInstructor;

            const timeElem = document.createElement('div');
            timeElem.classList.add('block-time');
            timeElem.innerText = `${formatTime(startTime)} – ${formatTime(endTime)}`;

            const block = document.createElement('div');
            block.className = `time-block in-use`;
            block.style.height = `${duration * 3}rem`;
            block.style.top = `${(offset * 3 * 16 + headerHeight)}px`; // convert rem to px
            block.appendChild(codeElem);
            block.appendChild(nameElem);
            block.appendChild(instructorElem);
            block.appendChild(timeElem);

            dayCol.appendChild(block);
        });

        container.appendChild(dayCol);
    });
}


function roomNotFound(roomNumber = null) {
    const error = document.createElement('div');
    error.classList.add("error");
    error.innerText = `Invalid room selection. Room ${roomNumber || "{null}"} does not exist.`;
    const main = document.querySelector("main");
    main.innerHTML = "";
    main.appendChild(error);
}


function loadRoomSchedule(roomNumber) {
    const requestURL = new URL(`${API_BASE}/rooms/${roomNumber}/schedule`);
    console.debug("DEBUG:", "Request URL", requestURL);

    fetch(requestURL)
        .then((response) => {
            if (!response.ok) {
                console.warn(`Unable to fetch a schedule for room '${roomNumber}' from the server.`);
                throw new Error("Not Found");
            }
            return response.json()
        })
        .then((json) => {
            console.debug("DEBUG:", "JSON", json);
            document.getElementById("room-number").innerHTML = roomNumber;
            // Render the room schedule
            renderSchedule(json);
        })
        .catch((err) => {
            console.debug("DEBUG", err.message);
            if (err.message == "Not Found") roomNotFound(roomNumber);    
            else throw err;
        });
}


// Main program
function main() {
    console.debug("DEBUG:", "Main program is starting.");

    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    if (pathname === "/" || pathname === "/index.html") {
        // We are on the index page
        console.debug("DEBUG:", "Page=index");

        // Set filter values
        const roomType = searchParams.get("room_type") || "";
        const buildingWing = searchParams.get("building_wing") || "";
        const buildingFloor = searchParams.get("building_floor") || "";
        console.debug("DEBUG:", "set room_type", roomType);
        console.debug("DEBUG:", "set building_wing", buildingWing);
        console.debug("DEBUG:", "set building_floor", buildingFloor);

        // Update the form filters
        document.getElementById('room-type').value = roomType;
        document.getElementById('building-wing').value = buildingWing;
        document.getElementById('building-floor').value = buildingFloor;

        // Reset the filters when the reset button is clicked (aka refresh the page)
        document.getElementById("reset-filters").addEventListener("click", (event) => {
            event.preventDefault();
            window.location.href = event.target.dataset.goto; // use the 'data-goto' attribute on the reset button
        });

        // Load the room list from the backend
        loadRoomList(roomType, buildingWing, buildingFloor);

    } else if (pathname === "/schedule.html") {
        // We are on the schedule page
        console.debug("DEBUG:", "Page=schedule");

        // Get the room_number from the URL
        const roomNumber = searchParams.get("room_number");
        if (roomNumber) {
            // Get the room schedule from the backend API
            loadRoomSchedule(roomNumber)
        } else {
            console.error("Search parameter 'room_number' is not set.");
            roomNotFound(roomNumber);
        }
    }
}


// Load main when the DOM is ready
document.addEventListener("DOMContentLoaded", () => main());
