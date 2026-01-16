const API_BASE = "http://127.0.0.1:8000";

const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

const TIME_SLOTS = [
    '08:00','09:00','10:00','11:00','12:00',
    '13:00','14:00','15:00','16:00','17:00',
];

const RAW_SCHEDULE_DATA = [
    { day: 'Monday', start: '08:30', end: '10:30', status: 'IN-USE' },
    { day: 'Tuesday', start: '08:30', end: '10:30', status: 'IN-USE' },
    { day: 'Thursday', start: '08:30', end: '10:30', status: 'IN-USE' },
    { day: 'Monday', start: '10:30', end: '12:30', status: 'IN-USE' }
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
    const [h, m] = time.split(':').map(Number);
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


function renderSchedule(data) {
    // Clears the schedule
    const container = document.getElementById('schedule');
    container.innerHTML = '';

    // TIME COLUMN
    const timeCol = document.createElement('div');
    timeCol.className = 'time-column';
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
        if (!byDay[entry.day]) byDay[entry.day] = [];
        byDay[entry.day].push(entry);
    });

    // DAY COLUMNS
    WEEKDAYS.forEach(day => {
        const dayCol = document.createElement('div');
        dayCol.className = 'day-column';

        const header = document.createElement('div');
        header.className = 'day-header';
        header.textContent = day;
        dayCol.appendChild(header);

        const headerHeight = timeHeader.offsetHeight;

        TIME_SLOTS.forEach(() => {
        const row = document.createElement('div');
        row.className = 'hour-row';
        dayCol.appendChild(row);
        });

        (byDay[day] || []).forEach(entry => {
        const { start, end, status } = entry;
        const duration = getDurationHours(start, end);
        const offset = getOffsetHours(start);

        const block = document.createElement('div');
        block.className = `time-block ${status.toLowerCase()}`;
        block.textContent = `${status} ${start}–${end}`;
        block.style.height = `${duration * 3}rem`;
        block.style.top = `${(offset * 3 * 16 + headerHeight)}px`; // convert rem to px

        dayCol.appendChild(block);
        });

        container.appendChild(dayCol);
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

        // Load the room list from the backend
        loadRoomList(roomType, buildingWing, buildingFloor);

    } else if (pathname === "/schedule.html") {
        // We are on the schedule page
        console.debug("DEBUG:", "Page=schedule");

        // TODO: Get the room_number from the URL

        // TODO: Get the room schedule from the backend API

        // TODO: Parse room schedule to use David's schedule

        // Render the room schedule
        renderSchedule(RAW_SCHEDULE_DATA);
    }
}


// Load main when the DOM is ready
document.addEventListener("DOMContentLoaded", () => main());


// Reset the filters when the reset button is clicked (aka refresh the page)
document.getElementById("reset-filters").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = event.target.dataset.goto; // use the 'data-goto' attribute on the reset button
});
