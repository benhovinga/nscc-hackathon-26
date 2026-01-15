//Assuming this is what I get from the database.
const rawScheduleData = [
  { day: 'Monday', start: '07:00', end: '08:30', status: 'IN-USE' },
  { day: 'Tuesday', start: '07:00', end: '09:30', status: 'IN-USE' },
  { day: 'Sunday', start: '07:00', end: '08:00', status: 'OPEN' },
  { day: 'Monday', start: '08:30', end: '10:00', status: 'OPEN' }
];

// the time slots which I put to vary by one hour,
const timeSlots = [
  '07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00',
  '19:00','20:00'
];

//Just the days of the week
const daysOfWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

//Converts time in formats like 7:30 to minutes like 450 minutes so we can some sweet maths with it
function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

//This functions get the difference between the minute value of our start and end parameters from the database
//This will give a value like 1 or 2.5 which we can now use to multiply by a standard unit like 3rem to give the length of the information block.
function getDurationHours(start, end) {
  return (toMinutes(end) - toMinutes(start)) / 60;
}

//This function get how far away from our zero point,which in this case is 7, a block will start.
//This will give a value like one or 2.5 which we can now use to multiply by a standard unit like 3rem to get how far away our information block will be from the starting point
function getOffsetHours(time) {
  return (toMinutes(time) - toMinutes('07:00')) / 60;
}

function renderSchedule(data) {
//Clears the schedule
  const container = document.getElementById('schedule');
  container.innerHTML = '';

  // TIME COLUMN
  const timeCol = document.createElement('div');
  timeCol.className = 'time-column';
  const timeHeader = document.createElement('div');
  timeHeader.className = 'day-header';
  timeCol.appendChild(timeHeader);

  timeSlots.forEach(t => {
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
  daysOfWeek.forEach(day => {
    const dayCol = document.createElement('div');
    dayCol.className = 'day-column';

    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = day;
    dayCol.appendChild(header);

    const headerHeight = timeHeader.offsetHeight;

    timeSlots.forEach(() => {
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

renderSchedule(rawScheduleData);