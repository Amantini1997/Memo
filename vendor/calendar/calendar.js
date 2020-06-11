import calendarFunctions from "./calendarFunctions.js";

const { 
    isSelected,
    getCalendar,
    getDateFromEuropeanType,
    getMonthName
} = calendarFunctions;

let currentDate = getDateFromEuropeanType();
let calendar = getCalendar(currentDate);
//Date
let selectedDate = new Date();
let selectedCell = null;
const HALF_MONTH = 15;

(function init() {
  window.getSelectedDate = () => selectedDate;
  console.log(" --> ", getSelectedDate);
  render(true);
  document.querySelector(".left-arr").onclick = () => updateDate(-1);
  document.querySelector(".right-arr").onclick = () => updateDate(+1);
  selectedCell = document.querySelectorAll(".cell.current")[currentDate.getDate() - 1];
})();

/**
 * To call onclick of a cell.
 * The cell passed as parameters becomes the new selected date
 * whereas the old is deselected
 * @param {Node} cell: the new selected cell
 */
function select(cell) {
    if (selectedCell != cell) {
        [selectedCell, cell].forEach(toggleSelected);
        selectedCell = cell;
        setSelectedDate(cell.classList.contains("current"), cell.innerHTML);
    }
    // add customized function
    if (window.calendarCallback) {
      calendarCallback(cell);
    }
}

// toggles the class selected of a cell
function toggleSelected(cell) {
    if (!cell) return;
    cell.classList.toggle("selected");
}

//number
function updateDate(changeFactor) {
    updateMonthAndYear(changeFactor);
    updateCalendar();
    render();
}

function updateMonthAndYear(changeFactor) {
    currentDate.setMonth(currentDate.getMonth() + changeFactor);
}

function updateCalendar() {
    calendar = getCalendar(currentDate);
}

/**
 * isFromThisMonth: {boolean}, day: {number}
 */
function setSelectedDate(isFromThisMonth, day) {
    let month = currentDate.getMonth();
    if(!isFromThisMonth) {
      month += (day < HALF_MONTH ? 1 : -1);
    }
    selectedDate = new Date(currentDate);
    selectedDate.setMonth(month);
    selectedDate.setDate(day);
}

function appendSkeletonTags() {
  document.getElementById("calendar").innerHTML = `
  <div id="clnd-header">
      <span class="left-arr">&#8249;</span>
      <span class="month-name">month</span>
      <span class="right-arr">&#8250;</span>
  </div>
  <div class="days">
      <div>Tu</div>
      <div>We</div>
      <div>Th</div>
      <div>Fr</div>
      <div>Sa</div>
      <div>Su</div>
      <div>Mo</div>
  </div>
  <div id="clnd-body">
  </div>
  `;
}

function appendDates() {
  let isFromThisMonth = false;
  const calendarBody = document.getElementById("clnd-body");
  calendarBody.innerHTML = "";
  calendar.forEach(rowArray => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    for (let cell of rowArray) {
      const cellDiv = document.createElement("div");
      cellDiv.onclick = () => select(cellDiv);
      cellDiv.innerHTML = cell;
      if(cell == 1) {
        isFromThisMonth = !isFromThisMonth;
      }
      cellDiv.classList.add("cell");
      if(isFromThisMonth) {
        cellDiv.classList.add("current");
      }
      if(isSelected(isFromThisMonth, selectedDate, currentDate, cell)) {
        cellDiv.classList.add("selected");
        selectedCell = cellDiv;
      }
      rowDiv.appendChild(cellDiv);
    };
    calendarBody.appendChild(rowDiv);
  }); 
  const monthName = getMonthName(currentDate.getMonth()).slice(0, 3);
  const year = currentDate.getFullYear();
  document.querySelector(".month-name").innerHTML = `${monthName} '${year % 100}`;
}

function render(firstCall=false) {
  if(firstCall) {
    appendSkeletonTags();
  }
  appendDates();
}
