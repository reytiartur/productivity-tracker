let dailyInput = document.querySelectorAll("#table input");

let hoursSet = document.querySelector("#set");
let hoursReached = document.querySelector("#reached");
let hoursLeft = document.querySelector("#left");

dailyInput.forEach(elem => elem.addEventListener("change", countDailyHours));

function countDailyHours() {
    const sumHoursReached = Array.from(dailyInput).reduce((acc, hours) => acc + Number(hours.value), 0)
    console.log(sumHoursReached)
    showHoursReached(sumHoursReached)
}

function showHoursReached(sum) {
    hoursReached.value = sum; 
}

