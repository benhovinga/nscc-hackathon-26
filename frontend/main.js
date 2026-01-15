const API_BASE = "http://127.0.0.1:8000";


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

    } else if (pathname === "schedule.html") {
        // We are on the schedule page
        console.debug("DEBUG:", "Page=schedule");
    }
}


// Load main when the DOM is ready
document.addEventListener("DOMContentLoaded", () => main());


// Reset the filters when the reset button is clicked (aka refresh the page)
document.getElementById("reset-filters").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = event.target.dataset.goto; // use the 'data-goto' attribute on the reset button
});
