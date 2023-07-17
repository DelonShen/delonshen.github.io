
// pomodoro.js
let countdown;
let isWorking = true;
let workSessions = 0;
const timerDisplay = document.querySelector('#timer');
const workTimeInput = document.querySelector('#workTime');
const breakTimeInput = document.querySelector('#breakTime');
const longBreakTimeInput = document.querySelector('#longBreakTime');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const alarm = new Audio('gong.mp3');

function timer(seconds) {
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
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
    const workTime = workTimeInput.value * 60;
    timer(workTime);
});

stopButton.addEventListener('click', () => {
    clearInterval(countdown);
});
