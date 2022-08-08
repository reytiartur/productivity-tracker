const LOCAL_STORAGE_WEEKS_OVERVIEW = "weeks.overview"
let weeksOverview = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WEEKS_OVERVIEW))

let dailyInput = document.querySelectorAll("#table input");

let hoursSet = document.querySelector("#set");
let hoursReached = document.querySelector("#reached");
let hoursLeft = document.querySelector("#left");

let text = document.querySelector(".text");

dailyInput.forEach(elem => elem.addEventListener("change", countDailyHours));
hoursSet.addEventListener("change", showHoursLeft);
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
}