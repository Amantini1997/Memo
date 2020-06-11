const DAYS_IN_A_WEEK = 7;
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

/**
 * Given a the month number and the language(defautl=EN),
 * return the name of that month.
 * @param {integer} monthNumber: 0 - 11
 * @param {enum (EN, IT)} lang
 * @return {String} The name of the month e.g. December
 */
function getMonthName(monthNumber, lang="EN") {
    //TO-DO: change based on the lang param
    const month_names = MONTH_NAMES; 
    return month_names[monthNumber];
}

/**
 * Given a month and a year, return the number of days.
 * @param {integer} year: year
 * @param {integer} month: month
 * @return {integer} The number of days in that month for that year
 */
function getDaysInMonth(year, month)  {
  return new Date(year, month, 0).getDate();
}

/**
 * Given a month and a year return the date of the first day
 * (Sunday = 0, Monday = 1 etc.)
 * @param {integer} year: year
 * @param {integer} month: month
 * @return {integer} The date of the first day
 */
function getDateOfFirstDayOf(year, month) {
  return new Date(year, month-1, 0).getDay();
}

/**
 * Take a date as parameter and generate an array of days so that all the
 *  days from the current month are contained, plus last (prevMonthLastDay - daysFromPrevMonth)
 *  days from the previous month at the beginning of the array, and the
 *  first ones from the next at the bottom to make the array size % (#days in a week) = 0.
 * @param {integer} daysFromPrevMonth: number of days from the previous month to be put
 *  at the beginning of the array.
 * @param {integer} prevMonthLastDay: last day of the previous month (eg. January last day = 31).
 * @param {integer} daysInCurrentMonth: last day of the current month (eg. )
 * @returns {Number[]}
 */
function generateCalendarArr(daysFromPrevMonth, prevMonthLastDay, daysInCurrentMonth) {
  const arrCalendar = [];
  let whiteCells = 0;
  //days from the previous month
  for (let i = 0; i < daysFromPrevMonth; ++i) {
    arrCalendar.unshift(prevMonthLastDay - i);
  }
  //days from current month
  for (let i = 0; i < daysInCurrentMonth;) {
    arrCalendar.push(++i);
  }
  //remaining cells to be filled in to make (arrCalendar.length % DAYS_IN_A_WEEK) = 0.
  whiteCells = DAYS_IN_A_WEEK - (arrCalendar.length % DAYS_IN_A_WEEK);
  //days from next month
  for (let i = daysInCurrentMonth; whiteCells > 0; ++i) {
    arrCalendar.push(i - daysInCurrentMonth + 1);
    whiteCells--;
  }
  return arrCalendar;
}

/**
 * Given an array and x columns, convert that array
 *  into a matrix of x columns
 * @param {Object[]} array: array of any types
 * @param {integer} cols: number of columns in the matrix
 * @return {Object[Object[]]}: array converted into matrix with
 *  number of columns equal to cols
 */
function convertArrayIntoMatrix(array, cols){
  const rows = array.length / cols;
  const matrix = [];
  for (let i = 0; i < rows; ++i) {
    matrix[i] = new Array(0);
    for (let j = 0; j < cols; j++) {
      matrix[i].push(array[cols * i + j]);
    }
  }
  return matrix;
}

/**
 * US date has month and day inverted, and javascript
 * makes the month starting from 0. This function converts 
 * the string into a date object properly formatted
 * @param {String format`mm-dd-yyyy`} date : a date as String in the form mm-dd-yyyy
 * @return The european formatted date.
 */
function getDateFromEuropeanType(date) {
  if(date){
    const elements = date.split("-");
    return new Date(`${elements[1]}-${elements[0]}-${elements[2]}`);
  } else {
    return new Date();
  }
}

/**
 * Take a date as a parameter and generate an array of arrays
 *  of days so that all the days from the specified year and month
 *  are contained in the matrix. The index of each array can be considered
 *  as the day (0 -> Sunday, 1 -> Monday etc.) and no cell is ever empty,
 *  so in case a month starts from Friday and ends on Monday, the remaining
 *  cells are filled in with, respectively, the last days from the previous
 *  month and the first ones from the next.
 * @param {Date} date: date to be converted into a matrix
 * @return {integer[integer[]]}: matrix of all the days from and
 *  surrounding the month.
 */
function getCalendar(date) {
  const currentYear = (date instanceof Date ? date : getDateFromEuropeanType(date)).getFullYear();
  const currentMonth = date.getMonth() + 1;
  const daysFromPrevMonth = getDateOfFirstDayOf(currentYear, currentMonth);
  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const prevMonthLastDay = getDaysInMonth(currentYear, currentMonth - 1);
  const arrCalendar = generateCalendarArr(daysFromPrevMonth, prevMonthLastDay, daysInCurrentMonth);
  const calendar = convertArrayIntoMatrix(arrCalendar, DAYS_IN_A_WEEK);
  return calendar;
}


//-----------------DayCell component functions---------------------

/**
 * Return True if the selected date is in the days of the
 *  calendar belonging to the current month
 * @param {string} selectedDate: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @return {boolean} True iff the day appears in the calendar table
 *  and belongs to the current month, otherwise False
 */
function selectedDayIsFromCurrentMonth(selectedDate, currentDate){
  return currentDate.getMonth() === selectedDate.getMonth() &&
         currentDate.getFullYear() === selectedDate.getFullYear();
}

/**
 * Return True if the selected date is in the days of the
 *  calendar belonging to the previous month
 * @param {string} selectedDate: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @param {integer} day: the number of the day contained in this DayCell
 * @return {boolean} True iff the day appears in the calendar table
 *  and belongs to the previous month, otherwise False
 */
function selectedDayIsFromPreviousMonth(selectedDate, currentDate, day){
  return currentDate.getMonth() === (selectedDate.getMonth()+1)%12 &&      //
         day > 15 &&
         ((currentDate.getFullYear() === selectedDate.getFullYear() &&
          selectedDate.getMonth() !== 11) ||
         (currentDate.getFullYear()-1 === selectedDate.getFullYear() &&
         selectedDate.getMonth() === 11));
}

/**
 * Return True if the selected date is in the days of the
 *  calendar belonging to the next month
 * @param {string} selectedDate: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @param {integer} day: the number of the day contained in this DayCell
 * @return {boolean} True iff the day appears in the calendar table
 *  and belongs to the next month, otherwise False
 */
function selectedDayIsFromNextMonth(selectedDate, currentDate, day){
  return (currentDate.getMonth()+1)%12 === selectedDate.getMonth() &&
          day < 15 &&
          ((currentDate.getFullYear() === selectedDate.getFullYear() &&
           selectedDate.getMonth() !== 0) ||
          (currentDate.getFullYear()+1 === selectedDate.getFullYear() &&
           selectedDate.getMonth() === 0));
}

/**
 * Return True if the day is selected
 * @param {boolean} isFromThisMonth: the day belongs to
 *  the current month.
 * @param {string} selectedDay: the selected day in the form yyyy-(m)m-(d)d
 * @param {Date} currentDate: the date displayed on the header of the the calendar
 * @param {integer} day: the number of the day contained in this DayCell
 * @return {boolean} True if the day is selected, False otherwise
 */
function isSelected(isFromThisMonth, selectedDay, currentDate, day){
  const selectedDate = new Date(selectedDay);
  return selectedDate.getDate() === day &&
          //current month
          ((isFromThisMonth && selectedDayIsFromCurrentMonth(selectedDate, currentDate)) ||
          //adjacent months
          (!isFromThisMonth &&
            (selectedDayIsFromPreviousMonth(selectedDate, currentDate, day) ||
            (selectedDayIsFromNextMonth(selectedDate, currentDate, day)))));
}

export default {
  isSelected,
  getCalendar,
  getDateFromEuropeanType,
  getMonthName
}