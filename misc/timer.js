
// pomodoro.js
let countdown;
let isWorking = true;
let workSessions = 0;
let remaining = 0; // new variable to store remaining time
const timerDisplay = document.querySelector('#timer');
const workTimeInput = document.querySelector('#workTime');
const breakTimeInput = document.querySelector('#breakTime');
const longBreakTimeInput = document.querySelector('#longBreakTime');
const startButton = document.querySelector('#start');
const pauseButton = document.querySelector('#pause'); // new pause button
const stopButton = document.querySelector('#stop');
let audioContext = new (window.AudioContext || window.webkitAudioContext)();


let alarm = new Audio('alarm.mp3');
alarm.controls = true;
alarm.playsinline = true;

// iOS audio workaround
window.addEventListener('touchstart', function () {
    var buffer = new ArrayBuffer(1);
    var source = audioContext.createBufferSource();

    source.buffer = audioContext.createBuffer(1, 1, 22050);
    source.connect(audioContext.destination);
    source.start();
}, false);


function timer(seconds) {
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        remaining = secondsLeft; // update remaining time
        if(secondsLeft < 0) {
            clearInterval(countdown);
            alarm.play();
            if (isWorking) {
                workSessions++;
                if (workSessions % 4 === 0) {
                    timer(longBreakTimeInput.value * 60);
                } else {
                    timer(breakTimeInput.value * 60);
                }
            } else {
                timer(workTimeInput.value * 60);
            }
            isWorking = !isWorking;
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
    timerDisplay.textContent = display;
}

startButton.addEventListener('click', () => {
    isWorking = true;
    workSessions = 0;
    const workTime = remaining > 0 ? remaining : workTimeInput.value * 60; // use remaining time if it exists
    timer(workTime);
});

pauseButton.addEventListener('click', () => { // new pause button event listener
    clearInterval(countdown);
});

stopButton.addEventListener('click', () => {
    clearInterval(countdown);
    remaining = 0; // reset remaining time
});


startButton.addEventListener('click', () => {
    isWorking = true;
    workSessions = 0;
    const workTime = remaining > 0 ? remaining : workTimeInput.value * 60; // use remaining time if it exists
    timer(workTime);
    timerDisplay.classList.remove('paused', 'stopped');
    timerDisplay.classList.add('running'); // change color to running
});

pauseButton.addEventListener('click', () => { // new pause button event listener
    clearInterval(countdown);
    timerDisplay.classList.remove('running', 'stopped');
    timerDisplay.classList.add('paused'); // change color to paused
});

stopButton.addEventListener('click', () => {
    clearInterval(countdown);
    remaining = 0; // reset remaining time
    timerDisplay.classList.remove('running', 'paused');
    timerDisplay.classList.add('stopped'); // change color to stopped
});

// Add event listeners for the custom increment and decrement buttons
document.querySelectorAll('.inc').forEach(button => {
    button.addEventListener('click', () => {
        const targetInput = document.querySelector('#' + button.dataset.target);
        targetInput.value = parseInt(targetInput.value) + 1;
    });
});
document.querySelectorAll('.dec').forEach(button => {
    button.addEventListener('click', () => {
        const targetInput = document.querySelector('#' + button.dataset.target);
        targetInput.value = Math.max(parseInt(targetInput.value) - 1, 0);
    });
});
