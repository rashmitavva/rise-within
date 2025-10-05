// Initialize the mood chart
let moodChart;
const moodData = JSON.parse(localStorage.getItem('moodData')) || [];

function initMoodChart() {
    const ctx = document.getElementById('mood-chart').getContext('2d');
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.map(entry => entry.date),
            datasets: [{
                label: 'Mood',
                data: moodData.map(entry => entry.mood),
                borderColor: 'rgb(70, 130, 180)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Handle journal form submission
document.getElementById('journal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const entry = {
        date: document.getElementById('entry-date').value,
        mood: parseInt(document.getElementById('mood-select').value),
        gratitude: [
            document.getElementById('gratitude-1').value,
            document.getElementById('gratitude-2').value,
            document.getElementById('gratitude-3').value
        ],
        reflection: document.getElementById('journal-text').value,
        goals: [
            document.getElementById('goal-1').value,
            document.getElementById('goal-2').value,
            document.getElementById('goal-3').value
        ].filter(Boolean)
    };

    // Save to localStorage
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    entries.push(entry);
    localStorage.setItem('journalEntries', JSON.stringify(entries));

    // Update mood data
    moodData.push({
        date: entry.date,
        mood: entry.mood
    });
    localStorage.setItem('moodData', JSON.stringify(moodData));

    // Update chart
    moodChart.data.labels = moodData.map(entry => entry.date);
    moodChart.data.datasets[0].data = moodData.map(entry => entry.mood);
    moodChart.update();

    // Update entries list
    displayEntries();
    
    // Reset form
    this.reset();
    showNotification('Journal entry saved successfully!');
});

function displayEntries() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    const entriesList = document.getElementById('entries-list');
    entriesList.innerHTML = '';

    entries.reverse().forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'journal-entry-card';
        entryElement.innerHTML = `
            <div class="entry-header">
                <h3>${new Date(entry.date).toLocaleDateString()}</h3>
                <span class="mood-emoji">${getMoodEmoji(entry.mood)}</span>
            </div>
            <p class="reflection">${entry.reflection}</p>
            <button onclick="viewFullEntry(${JSON.stringify(entry)})">View Full Entry</button>
        `;
        entriesList.appendChild(entryElement);
    });
}

function getMoodEmoji(mood) {
    const emojis = ['😢', '😕', '😐', '🙂', '😊'];
    return emojis[mood - 1];
}

function viewFullEntry(entry) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${new Date(entry.date).toLocaleDateString()}</h2>
            <p><strong>Mood:</strong> ${getMoodEmoji(entry.mood)}</p>
            <h3>Gratitude</h3>
            <ul>
                ${entry.gratitude.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <h3>Reflection</h3>
            <p>${entry.reflection}</p>
            <h3>Goals</h3>
            <ul>
                ${entry.goals.map(goal => `<li>${goal}</li>`).join('')}
            </ul>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close').onclick = () => modal.remove();
    window.onclick = (event) => {
        if (event.target === modal) modal.remove();
    };
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initMoodChart();
    displayEntries();
    document.getElementById('entry-date').valueAsDate = new Date();
});