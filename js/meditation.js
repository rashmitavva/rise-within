// Breathing Exercise
class BreathingExercise {
    constructor() {
        this.circle = document.querySelector('.breathing-circle');
        this.instruction = document.querySelector('.instruction');
        this.timer = document.querySelector('.timer');
        this.startBtn = document.getElementById('start-breathing');
        this.patternSelect = document.getElementById('breathing-pattern');
        this.isActive = false;
        this.currentPhase = 'inhale';
        
        this.startBtn.addEventListener('click', () => this.toggleExercise());
        this.patternSelect.addEventListener('change', () => this.updatePattern());
    }

    toggleExercise() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.isActive = true;
        this.startBtn.textContent = 'Stop';
        this.circle.classList.add('active');
        this.runPhase();
    }

    stop() {
        this.isActive = false;
        this.startBtn.textContent = 'Start Exercise';
        this.circle.classList.remove('active');
        this.circle.classList.remove('inhale', 'hold', 'exhale');
        clearTimeout(this.timeout);
    }

    updatePattern() {
        if (this.isActive) {
            this.stop();
            this.start();
        }
    }

    runPhase() {
        if (!this.isActive) return;

        const pattern = this.patternSelect.value.split('-').map(Number);
        let duration;

        this.circle.classList.remove('inhale', 'hold', 'exhale');
        
        switch (this.currentPhase) {
            case 'inhale':
                this.circle.classList.add('inhale');
                this.instruction.textContent = 'Breathe In';
                duration = pattern[0];
                this.currentPhase = pattern.length > 2 ? 'hold1' : 'exhale';
                break;
            case 'hold1':
                this.circle.classList.add('hold');
                this.instruction.textContent = 'Hold';
                duration = pattern[1];
                this.currentPhase = 'exhale';
                break;
            case 'exhale':
                this.circle.classList.add('exhale');
                this.instruction.textContent = 'Breathe Out';
                duration = pattern[pattern.length > 2 ? 2 : 1];
                this.currentPhase = pattern.length > 2 ? 'hold2' : 'inhale';
                break;
            case 'hold2':
                this.circle.classList.add('hold');
                this.instruction.textContent = 'Hold';
                duration = pattern[3] || pattern[1];
                this.currentPhase = 'inhale';
                break;
        }

        this.runTimer(duration);
    }

    runTimer(duration) {
        let timeLeft = duration;
        this.timer.textContent = timeLeft;

        const tick = () => {
            timeLeft--;
            this.timer.textContent = timeLeft;

            if (timeLeft > 0) {
                this.timeout = setTimeout(tick, 1000);
            } else {
                this.runPhase();
            }
        };

        this.timeout = setTimeout(tick, 1000);
    }
}

// Meditation Timer
class MeditationTimer {
    constructor() {
        this.timerDisplay = document.querySelector('.time-display');
        this.progressBar = document.querySelector('.progress-bar');
        this.startBtn = document.getElementById('start-timer');
        this.minutesInput = document.getElementById('custom-minutes');
        this.isActive = false;
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.minutesInput.addEventListener('change', () => this.updateDisplay());
        this.updateDisplay();
    }

    toggleTimer() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        this.isActive = true;
        this.startBtn.textContent = 'Stop';
        this.totalSeconds = this.minutesInput.value * 60;
        this.remainingSeconds = this.totalSeconds;
        this.tick();
    }

    stop() {
        this.isActive = false;
        this.startBtn.textContent = 'Start Timer';
        clearTimeout(this.timeout);
        this.updateDisplay();
    }

    tick() {
        if (!this.isActive) return;

        this.remainingSeconds--;
        this.updateDisplay();

        if (this.remainingSeconds > 0) {
            this.timeout = setTimeout(() => this.tick(), 1000);
        } else {
            this.stop();
            this.playEndSound();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.remainingSeconds / 60);
        const seconds = this.remainingSeconds % 60;
        this.timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const progress = (this.remainingSeconds / this.totalSeconds) || 1;
        const circumference = 2 * Math.PI * 45;
        this.progressBar.style.strokeDashoffset = circumference * (1 - progress);
    }

    playEndSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1NOTgzLyYcBgDN2ffuhkQBAQEAAAAAAAAA');
        audio.play();
    }
}

// Guided Meditation Player
class GuidedMeditation {
    constructor() {
        this.playButtons = document.querySelectorAll('.play-btn');
        this.playButtons.forEach(btn => {
            btn.addEventListener('click', () => this.startMeditation(btn.dataset.duration));
        });
    }

    startMeditation(duration) {
        // In a real app, this would play actual guided meditation audio
        alert(`Starting ${duration}-minute guided meditation`);
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const breathingExercise = new BreathingExercise();
    const meditationTimer = new MeditationTimer();
    const guidedMeditation = new GuidedMeditation();
});