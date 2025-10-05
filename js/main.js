document.addEventListener('DOMContentLoaded', () => {
    // Store DOM elements
    const pages = document.querySelectorAll('.page');
    const startBtn = document.querySelector('.start-btn');
    const feelingBtns = document.querySelectorAll('.feeling-btn');
    const assessmentForm = document.getElementById('assessment-form');
    const selectedFeelingSpan = document.getElementById('selected-feeling');
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    
    // Initialize range value displays
    rangeInputs.forEach(input => {
        input.nextElementSibling.textContent = input.value;
        input.addEventListener('input', (e) => {
            e.target.nextElementSibling.textContent = e.target.value;
        });
    });

    // Function to show a specific page
    function showPage(pageId) {
        pages.forEach(page => {
            page.style.display = page.id === pageId ? 'block' : 'none';
        });
    }

    // Start button click handler
    startBtn.addEventListener('click', () => {
        showPage('assessment');
    });

    // Feeling button click handlers
    feelingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feeling = btn.dataset.feeling;
            selectedFeelingSpan.textContent = feeling.toLowerCase();
            showPage('questions');
        });
    });

    // Form submission handler
    assessmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get values from form
        const feelingScale = parseInt(document.getElementById('feeling-scale').value);
        const motivationScale = parseInt(document.getElementById('motivation-scale').value);
        const sleepHours = parseInt(document.getElementById('sleep-hours').value);
        const managementScale = parseInt(document.getElementById('management-scale').value);

        // Calculate score
        // Convert sleep hours to 1-5 scale: 7-9 hours = 5, 6/10 hours = 4, 5/11 hours = 3, 4/12 hours = 2, other = 1
        let sleepScore;
        if (sleepHours >= 7 && sleepHours <= 9) sleepScore = 5;
        else if (sleepHours === 6 || sleepHours === 10) sleepScore = 4;
        else if (sleepHours === 5 || sleepHours === 11) sleepScore = 3;
        else if (sleepHours === 4 || sleepHours === 12) sleepScore = 2;
        else sleepScore = 1;

        const totalScore = feelingScale + motivationScale + sleepScore + managementScale;

        // Determine result category
        let result;
        if (totalScore <= 4) {
            result = "Extremely depressed - Please seek immediate professional help";
        } else if (totalScore <= 10) {
            result = "Abnormally depressed - Consider talking to a mental health professional";
        } else if (totalScore <= 15) {
            result = "Verge of depression - It might be helpful to talk to someone";
        } else if (totalScore <= 23) {
            result = "Ok - Keep monitoring your mental health";
        } else {
            result = "Great - Keep up the good work!";
        }

        // Display results
        document.getElementById('score-result').textContent = `Score: ${totalScore} - ${result}`;
        showPage('results');

        // Store results (you can expand this to store in localStorage or send to a server)
        const assessment = {
            feeling: selectedFeelingSpan.textContent,
            feelingScale,
            motivationScale,
            sleepHours,
            managementScale,
            totalScore,
            result,
            timestamp: new Date().toISOString()
        };
        console.log('Assessment stored:', assessment);
    });
});
