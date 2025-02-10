let timer;
let isRunning = false;
let timeLeft;
let totalTime;
let isBreak = false;

// Select elements
const timerElement = document.getElementById("timer");
const alarmSound = document.getElementById("alarmSound");
const progressRing = document.querySelector(".progress-ring");
const sessionInput = document.getElementById("sessionLength");
const breakInput = document.getElementById("breakLength");
const themeToggle = document.getElementById("themeToggle");

// Load saved settings from local storage
function loadSettings() {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    sessionInput.value = localStorage.getItem("session") || 25;
    breakInput.value = localStorage.getItem("break") || 5;
    timeLeft = localStorage.getItem("timeLeft") || sessionInput.value * 60;
    totalTime = timeLeft;
    updateDisplay();
}

// Save settings
function saveSettings() {
    localStorage.setItem("session", sessionInput.value);
    localStorage.setItem("break", breakInput.value);
    localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    localStorage.setItem("timeLeft", timeLeft);
}

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    let progress = (timeLeft / totalTime) * 565; // Update progress bar
    progressRing.style.strokeDashoffset = progress;
}

function startTimer() {
    if (!isRunning) {
        timeLeft = localStorage.getItem("timeLeft") || sessionInput.value * 60;
        totalTime = timeLeft;
        isRunning = true;

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
                saveSettings();
            } else {
                clearInterval(timer);
                isRunning = false;
                isBreak = !isBreak;
                alarmSound.play();
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
    saveSettings();
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isBreak = false;

    timeLeft = sessionInput.value * 60;
    totalTime = timeLeft;
    updateDisplay();
    saveSettings();
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    saveSettings();
});

// Initialize settings
loadSettings();
