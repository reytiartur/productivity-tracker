let dailyInput = document.querySelectorAll("#table input");

let hoursSet = document.querySelector("#set");
let hoursReached = document.querySelector("#reached");
let hoursLeft = document.querySelector("#left");

function countDailyHours() {
    const sumHoursReached = Array.from(dailyInput).reduce((acc, hours) => acc =+ hours.value, 0)
    
    showHoursReached(sumHoursReached)
}

function showHoursReached(sum) {
    hoursReached.value = sum; 
}

countDailyHours()