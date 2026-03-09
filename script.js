// Global Variables
let pattern = [2, 2, 4, 3, 2, 1, 2, 4];
let progress = 0;
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.5;
let guessCounter = 0;
let timeoutIds = [];

// Audio Context Variables
let context = new (window.AudioContext || window.webkitAudioContext)();
let oscillator = null;
let gainNode = null;

// Constants
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
const freqMap = {
    1: 261,
    2: 294,
    3: 329,
    4: 392
};

// DOM Elements
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Game Functions
function startGame() {
    progress = 0;
    gamePlaying = true;
    startBtn.classList.add("hidden");
    stopBtn.classList.remove("hidden");
    playClueSequence();
}

function stopGame() {
    clearTimeouts();
    gamePlaying = false;
    for (let i = 1; i <= 4; i++) {
        clearButton(i);
    }
    stopTone();
    startBtn.classList.remove("hidden");
    stopBtn.classList.add("hidden");
}

function lightButton(btn) {
    document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
    document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        timeoutIds.push(setTimeout(clearButton, clueHoldTime, btn));
    }
}

function clearTimeouts() {
    for (let i = 0; i < timeoutIds.length; i++) {
        clearTimeout(timeoutIds[i]);
    }
    timeoutIds = [];
}

function playClueSequence() {
    clearTimeouts();
    context.resume().then(() => {
        guessCounter = 0;
        let delay = nextClueWaitTime;
        for (let i = 0; i <= progress; i++) {
            console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
            let timeoutId = setTimeout(playSingleClue, delay, pattern[i]);
            timeoutIds.push(timeoutId);
            delay += clueHoldTime;
            delay += cluePauseTime;
        }
    });
}

function guess(btn) {
    if (!gamePlaying) {
        return;
    }
    
    if (pattern[guessCounter] === btn) {
        if (guessCounter === progress && progress === pattern.length - 1) {
            winGame();
        } else if (guessCounter === progress) {
            progress++;
            playClueSequence();
        } else {
            guessCounter++;
        }
    } else {
        loseGame();
    }
}

function loseGame() {
    stopGame();
    alert("Game Over. You pressed the wrong button!");
}

function winGame() {
    stopGame();
    alert("Congratulations! You won!");
}

function startTone(btn) {
    if (!tonePlaying) {
        tonePlaying = true;
        oscillator = context.createOscillator();
        gainNode = context.createGain();
        
        oscillator.frequency.value = freqMap[btn];
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        gainNode.gain.setValueAtTime(volume * 0.3, context.currentTime);
        oscillator.start(context.currentTime);
    }
}

function stopTone() {
    if (tonePlaying) {
        tonePlaying = false;
        oscillator.stop(context.currentTime);
    }
}

function playTone(btn, len) {
    startTone(btn);
    timeoutIds.push(setTimeout(stopTone, len));
}