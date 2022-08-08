const LOCAL_STORAGE_WEEKS_OVERVIEW = "weeks.overview";
const LOCAL_STORAGE_SELECTED_WEEK = "weeks.selectedWeeks"
let weeksOverview = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WEEKS_OVERVIEW)) || [];
let selectedWeek = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_WEEK)) || weeksOverview[0];

let dailyInput = document.querySelectorAll("#table input");
let addWeekBtn = document.querySelector(".add-week");

let hoursSet = document.querySelector("#set");
let hoursReached = document.querySelector("#reached");
let hoursLeft = document.querySelector("#left");

let sidebar = document.querySelector("#sidebar")
let selectedWeekOverview = document.querySelector("#week-overview")
let text = document.querySelector(".text");

addWeekBtn.addEventListener("click", addNewWeek)
dailyInput.forEach(elem => elem.addEventListener("change", countDailyHours));
hoursSet.addEventListener("change", showHoursLeft); //delete after page rendering from obj added.
hoursSet.addEventListener("change", () => { 
    selectedWeek = hoursSet.value; 
    save()
})
window.addEventListener("change", showHoursLeft);

function countDailyHours() {
    const sumHoursReached = Array.from(dailyInput).reduce((acc, hours) => acc + Number(hours.value), 0)
    showHoursReached(sumHoursReached)
}

function showHoursReached(sum) {
    hoursReached.value = sum; 
}

function showHoursLeft() {
    hoursLeft.value = hoursSet.value - hoursReached.value;
    if(hoursLeft.value < 0) {
        hoursLeft.value = `+${Math.abs(hoursLeft.value)}`;
        hoursLeft.style.boxShadow = "inset 0px 0px 28px 20px rgba(74,237,76,0.65)"
    } else {
        setColor(hoursLeft, hoursLeft.value);
    }
    
}

function setColor(elem, value) {
    value = +value;
    if(value == 0) {
        elem.style.boxShadow = "inset 0px 0px 28px 20px rgba(74,237,76,0.65)"
        text.innerHTML = `Great! You achieved your goal for this week.`
    } else if(value < (hoursSet.value / 4)) {
        elem.style.boxShadow = "inset 0px 0px 28px 20px rgba(217,232,49,0.65)"
        text.innerHTML = `${value} hours left. You can see the finish line.`
    } else if(value > (hoursSet.value / 2)) {
        elem.style.boxShadow = "inset 0px 0px 28px 20px rgba(237,72,66,0.65)"
        text.innerHTML = `${value} hours left. You still have a long way ahead.`
    } else if(value < (hoursSet.value / 2)) {
        elem.style.boxShadow = "inset 0px 0px 28px 20px rgba(240,175,36,0.65)"
        text.innerHTML = `${value} hours left. You have passed an equator.`
    }
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_WEEKS_OVERVIEW, JSON.stringify(weeksOverview));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_WEEK, JSON.stringify(selectedWeek));
}

function addNewWeek() {
    weeksOverview.push({})
}

function render(weeksOverview) {
    selectedWeek.innerHTML = `
        <div id="week-overview">
            <table id="table">
                <tr>
                    <th>Day</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                </tr>
                <tr>
                    <td><strong>Hours</strong></td>
                    <td><input type="number" name="monday" id="monday">${weeksOverview.hoursWeek[0]}</td>
                    <td><input type="number" name="tuesday" id="tuesday">${weeksOverview.hoursWeek[1]}</td>
                    <td><input type="number" name="wednesday" id="wednesday">${weeksOverview.hoursWeek[2]}</td>
                    <td><input type="number" name="thursday" id="thursday">${weeksOverview.hoursWeek[3]}</td>
                    <td><input type="number" name="friday" id="friday">${weeksOverview.hoursWeek[4]}</td>
                    <td><input type="number" name="saturday" id="saturday">${weeksOverview.hoursWeek[5]}</td>
                    <td><input type="number" name="sunday" id="sunday">${weeksOverview.hoursWeek[6]}</td>
                </tr>
            </table>

            <div class="counts">
                <label for="number">Set hours:<input type="number" name="set" id="set">${hoursSet}</label>
                <div class="">Hours reached:<input type="number" name="reached" id="reached" readonly>${weeksOverview.hoursWeekSum}</div>
                <div class="">Hours left:<input name="left" id="left" readonly>${weeksOverview.hoursLeft}</div>
            </div>

            <p class="text">Set new goal and try your best to achieve it!</p>
        </div>
    `
}