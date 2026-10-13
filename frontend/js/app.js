const timesheetForm = document.getElementById('timesheet-form');
const hoursInput = document.getElementById("hours-input");
const totalHoursText = document.getElementById('total-hours-text');
const remainingHoursText = document.getElementById('remaining-hours-text');
const progressBar = document.getElementById('hours-progress-bar');

const dateInput = document.getElementById('date-input');
const categorySelect = document.getElementById('category-select');
const historyLogTable = document.getElementById('history-log-table');
const tabButtons = document.querySelectorAll('.nav-btn');
const tabPanels = document.querySelectorAll('.tab-content');


const webcamFeed = document.getElementById('webcam-feed');
const captureBtn = document.getElementById('capture-btn');
const snapshotCanvas = document.getElementById('snapshot-canvas');
const ocrOutputText = document.getElementById('ocr-output-text');

let totalHours = 0;
let targetHours = 450;

/** For loop for creating an event listener for each navbar button */
tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active-view'));

        this.classList.add('active');
        const targetedTabId = this.getAttribute('data-target');
        document.getElementById(targetedTabId).classList.add('active-view');

        if (targetedTabId === "scanner-tab") {
            // Give the browser a tiny 50ms break to render the tab visually before firing the lens!
            setTimeout(startWebcam, 50);
        } else {
            stopWebcam();
        }
    });
});

function startWebcam() {
    // Reverify the element exists live in case it was null at startup
    const liveVideoElement = document.getElementById('webcam-feed');
    
    if (!liveVideoElement) {
        console.error("The video HTML tag could not be found yet!");
        return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Fallback: If environment (rear camera) fails or isn't there, default to standard true video
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                liveVideoElement.srcObject = stream;
                // Force play command explicitly to shock the video feed out of a black sleep state
                liveVideoElement.play().catch(err => console.log("Auto-play blocked: ", err));
            })
            .catch(function(error) {
                console.warn("Environment camera failed, trying default user webcam...", error);
                // Fallback to whatever camera is available if phone layout mode causes a crash on desktop
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(fallbackStream) {
                        liveVideoElement.srcObject = fallbackStream;
                        liveVideoElement.play();
                    })
                    .catch(function(finalErr) {
                        console.error("Webcam Access completely blocked: ", finalErr);
                        if(ocrOutputText) ocrOutputText.textContent = "Error: Camera Access was denied.";
                    });
            });
    }
}


function stopWebcam() {
    const liveVideoElement = document.getElementById('webcam-feed');
    if (liveVideoElement && liveVideoElement.srcObject) {
        const stream = liveVideoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        liveVideoElement.srcObject = null;
    }
}


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