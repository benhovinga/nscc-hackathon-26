const API_BASE = "http://127.0.0.1:8000";

function load_room_list(elem) {
    fetch(API_BASE + "/rooms")
        .then((response) => response.json())
        .then((json) => console.log(json))
        .catch((reason) => console.error(reason));
}

document.addEventListener("DOMContentLoaded", () => {
    console.debug("DEBUG", "Main program is starting.");

    const room_list_elem = document.querySelector("#room-list ul");
    if (room_list_elem) {
        console.debug("DEBUG", "Loading room list.");
        load_room_list(room_list_elem);
    }
});
