const LOCAL_STORAGE_WEEKS_OVERVIEW = "weeks.overview";
const LOCAL_STORAGE_SELECTED_WEEK = "weeks.selectedWeek";
const LOCAL_STORAGE_REMEMBER_HOURS = "weeks.hours"

let rememberHours = localStorage.getItem(LOCAL_STORAGE_REMEMBER_HOURS) || 0;
let weeksOverview = JSON.parse(localStorage.getItem(LOCAL_STORAGE_WEEKS_OVERVIEW)) || [];
let selectedWeek = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_WEEK)) || weeksOverview[0];


let dailyInput = document.querySelectorAll("#table input");
let addWeekBtn = document.querySelector(".add-week");

let hoursSet = document.querySelector("#set");
let hoursReached = document.querySelector("#reached");
let hoursLeft = document.querySelector("#left");

let sidebar = document.querySelector("#sidebar");
let weeksListContainer = document.querySelector("#weeks");
let selectedWeekOverview = document.querySelector("#week-overview");

let color = "";
let text = "Set new goal and try your best to achieve it!";

window.addEventListener("click", (e) => {
    if(e.target.classList.contains("add-week")) addNewWeek()}
);

window.addEventListener("change", (e) => {
    if(e.target.id === "set") {
        hoursSet = document.querySelector("#set");
        rememberHours = hoursSet.value;
        save();
        updateData() 
    }

});

window.addEventListener("click", (e) => {
    if(e.target.classList.contains("week")) choseSelectedWeek(e)}
);

selectedWeekOverview.addEventListener("change", (e) => {
    if(e.target.tagName.toLowerCase() == "input" && e.target.id !== "set") {
    updateData()
}})

function setColor() {
    if(typeof(selectedWeek.hoursLeft) === "string") {
        color = "inset 0px 0px 28px 20px rgba(74,237,76,0.65)";
        text = `Great! You achieved your goal for this week.`
        render()
    } else {
        let value = Number(selectedWeek.hoursLeft);
        if(value == 0) {
            color = "inset 0px 0px 28px 20px rgba(74,237,76,0.65)"
            text = `Great! You achieved your goal for this week.`
        } else if(value < (selectedWeek.hoursSet / 4)) {
            color = "inset 0px 0px 28px 20px rgba(217,232,49,0.65)"
            text = `${value} hours left. You can see the finish line.`
        } else if(value > (selectedWeek.hoursSet / 2)) {
            color = "inset 0px 0px 28px 20px rgba(237,72,66,0.65)"
            text = `${value} hours left. You still have a long way ahead.`
        } else if(value < (selectedWeek.hoursSet / 2)) {
            color = "inset 0px 0px 28px 20px rgba(240,175,36,0.65)"
            text = `${value} hours left. You have passed an equator.`
        } 
        render()
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
        hoursLeft: rememberHours,
        hoursWeek: [0, 0, 0, 0, 0, 0, 0]
    });
    setSelectedForNewWeek()
    renderWeeksList()
    render()
}

function updateData() {
    selectedWeek.hoursSet = rememberHours;
    dailyInput = document.querySelectorAll("#table input");
    selectedWeek.hoursWeek = Array.from(dailyInput).map(input => {
        if(input.value == "") {
            return input.value = 0;
        } else {
            return input.value = Number(input.value);
        }
    });

    selectedWeek.hoursWeekSum = selectedWeek.hoursWeek.reduce((sum, num) => sum + num, 0);
    selectedWeek.hoursLeft = selectedWeek.hoursSet - selectedWeek.hoursWeekSum;

    hoursSet.value = rememberHours; 
    save()
    checkForHours()
    setColor()

}

function renderWeeksList() {
    weeksListContainer.innerHTML = `<button class="add-week">+</button>`
    weeksOverview.forEach((week, index) => {
        let weekInner = document.createElement("div");
        weekInner.innerText = `Week ${index + 1}`;
        weekInner.classList.add("week");
        weekInner.dataset.id = week.id;
        
        weeksListContainer.appendChild(weekInner);
    })
    markSelectedWeek() 
}

function markSelectedWeek() {
    let weeksList = document.querySelectorAll(".week");
    weeksList.forEach(week => week.classList.remove("chosen-week"));
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
    let selectedWeekOverview = document.querySelector("#week-overview");
    selectedWeekOverview.innerHTML = `
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
                    <td><input type="number" name="monday" id="monday" value="${selectedWeek.hoursWeek[0]}"></td>
                    <td><input type="number" name="tuesday" id="tuesday" value="${selectedWeek.hoursWeek[1]}"></td>
                    <td><input type="number" name="wednesday" id="wednesday" value="${selectedWeek.hoursWeek[2]}"></td>
                    <td><input type="number" name="thursday" id="thursday" value="${selectedWeek.hoursWeek[3]}"></td>
                    <td><input type="number" name="friday" id="friday" value="${selectedWeek.hoursWeek[4]}"></td>
                    <td><input type="number" name="saturday" id="saturday" value="${selectedWeek.hoursWeek[5]}"></td>
                    <td><input type="number" name="sunday" id="sunday" value="${selectedWeek.hoursWeek[6]}"></td>
                </tr>
            </table>

            <div class="counts">
                <label for="number">Set hours:<input type="number" name="set" id="set" value="${rememberHours}"></label>
                <div class="">Hours reached:<input type="number" name="reached" id="reached" value="${selectedWeek.hoursWeekSum}" readonly></div>
                <div class="">Hours left:<input name="left" id="left" value="${selectedWeek.hoursLeft}" readonly style="box-shadow: ${color}"></div>
            </div>

            <p class="text">${text}</p>
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

function checkForHours() {
    if(selectedWeek.hoursLeft < 0) {
      selectedWeek.hoursLeft = `+${Math.abs(selectedWeek.hoursLeft)}`;
    }
    setColor()
}

function setSelectedForNewWeek() {
    selectedWeek = weeksOverview[weeksOverview.length - 1];
}

addNewWeek()
checkForHours()
updateData() 
render()