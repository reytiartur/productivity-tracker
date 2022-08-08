const LOCAL_STORAGE_WEEKS_OVERVIEW = "weeks.overview";
const LOCAL_STORAGE_SELECTED_WEEK = "weeks.selectedWeek";
const LOCAL_STORAGE_REMEMBER_HOURS = "weeks.hours"

let rememberHours = localStorage.getItem(LOCAL_STORAGE_REMEMBER_HOURS) || 0;
let weeksOverview = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WEEKS_OVERVIEW)) || [{
    id: Date.now().toString(),
    hoursSet: rememberHours,
    hoursWeek: []}];
let selectedWeek = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_WEEK)) || weeksOverview[0];


let dailyInput = document.querySelectorAll("#table input");
let addWeekBtn = document.querySelector(".add-week");

let hoursSet = document.querySelector("#set");
let hoursReached = document.querySelector("#reached");
let hoursLeft = document.querySelector("#left");

let sidebar = document.querySelector("#sidebar");
let weeksListContainer = document.querySelector("#weeks");
let selectedWeekOverview = document.querySelector("#week-overview");
let text = document.querySelector(".text");

window.addEventListener("click", (e) => {
    if(e.target.classList.contains("add-week")) addNewWeek()}
);

dailyInput.forEach(elem => elem.addEventListener("change", countDailyHours));

hoursSet.addEventListener("change", showHoursLeft); //delete after page rendering from obj added.

hoursSet.addEventListener("change", () => { 
    rememberHours = hoursSet.value; 
    save()
});

window.addEventListener("change", showHoursLeft);

window.addEventListener("click", (e) => {
    if(e.target.classList.contains("week")) choseSelectedWeek(e)}
);

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
    localStorage.setItem(LOCAL_STORAGE_REMEMBER_HOURS, rememberHours);
}

function addNewWeek() {
    weeksOverview.push({
        id: Date.now().toString(),
        hoursSet: rememberHours,
        hoursWeek: []
    });
    renderWeeksList()
}

function renderWeeksList() {
    weeksListContainer.innerHTML = `<button class="add-week">+</button>`
    weeksOverview.forEach((week, index) => {
        let weekInner = document.createElement("div");
        weekInner.innerText = `Week ${index + 1}`;
        weekInner.classList.add("week");
        weekInner.dataset.id = week.id;
        
        weeksListContainer.appendChild(weekInner);
        markSelectedWeek()
    })
}

function markSelectedWeek() {
    let weeksList = document.querySelectorAll(".week");
    weeksList.forEach(week => week.classList.remove("chosen-week"))
    let choseWeek = function() {
        for(let i = 0; i < weeksList.length; i++) {
            if(weeksList[i].dataset.id === selectedWeek.id) {
                return weeksList[i];
            }
        } 
    }


    let chosenWeek = choseWeek();
    chosenWeek.classList.add("chosen-week");

    render()
}

function render() {
    selectedWeekOverview.innerHTML = `
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
                    <td><input type="number" name="monday" id="monday">${selectedWeek.hoursWeek[0]}</td>
                    <td><input type="number" name="tuesday" id="tuesday">${selectedWeek.hoursWeek[1]}</td>
                    <td><input type="number" name="wednesday" id="wednesday">${selectedWeek.hoursWeek[2]}</td>
                    <td><input type="number" name="thursday" id="thursday">${selectedWeek.hoursWeek[3]}</td>
                    <td><input type="number" name="friday" id="friday">${selectedWeek.hoursWeek[4]}</td>
                    <td><input type="number" name="saturday" id="saturday">${selectedWeek.hoursWeek[5]}</td>
                    <td><input type="number" name="sunday" id="sunday">${selectedWeek.hoursWeek[6]}</td>
                </tr>
            </table>

            <div class="counts">
                <label for="number">Set hours:<input type="number" name="set" id="set">${rememberHours}</label>
                <div class="">Hours reached:<input type="number" name="reached" id="reached" readonly>${selectedWeek.hoursWeekSum}</div>
                <div class="">Hours left:<input name="left" id="left" readonly>${selectedWeek.hoursLeft}</div>
            </div>

            <p class="text">Set new goal and try your best to achieve it!</p>
        </div>
    `
}

function choseSelectedWeek(e) {
    if(e.target.classList.contains("week")) {
        selectedWeekArray = weeksOverview.filter(week => week.id === e.target.dataset.id);
        selectedWeek = selectedWeekArray[0];
        save()
        markSelectedWeek()
    }
}

renderWeeksList();