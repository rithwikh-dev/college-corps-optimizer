const timesheetForm = document.getElementById('timesheet-form');
const hoursInput = document.getElementById("hours-input");
const totalHoursText = document.getElementById('total-hours-text');
const remainingHoursText = document.getElementById('remaining-hours-text');
const progressBar = document.getElementById('hours-progress-bar');

const dateInput = document.getElementById('date-input');
const categorySelect = document.getElementById('category-select');
const historyLogTable = document.getElementById('history-log-table');

let totalHours = 0;
let targetHours = 450;

function updateDashboard(){
    let remaining = targetHours -totalHours;
    if(remaining < 0){
        remaining = 0;
    }

    const percentage = (totalHours/targetHours) *100;

    totalHoursText.textContent = totalHours;
    remainingHoursText.textContent = remaining;

    progressBar.style.width = percentage + "%";
}


timesheetForm.addEventListener("submit", function(event){
    event.preventDefault();

    const hoursEntered = parseFloat(hoursInput.value);

    totalHours += hoursEntered;

    updateDashboard();

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${dateInput.value}</td>
        <td><strong>${hoursEntered}</strong></td>
        <td>${categorySelect.options[categorySelect.selectedIndex].text}</td>
    `;

    historyLogTable.appendChild(newRow);

    timesheetForm.reset();
});