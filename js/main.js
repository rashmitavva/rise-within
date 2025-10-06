// Main JavaScript file for Rise Within
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const startBtn = document.querySelector('.start-btn');
    const feelingBtns = document.querySelectorAll('.feeling-btn');
    const assessmentForm = document.getElementById('assessment-form');
    const pages = document.querySelectorAll('.page');
    const selectedFeelingSpan = document.getElementById('selected-feeling');
    const rangeInputs = document.querySelectorAll('input[type="range"]');

    // Function to show a specific page and hide others
    function showPage(pageId) {
        pages.forEach(page => {
            page.style.display = page.id === pageId ? 'block' : 'none';
        });
    }

    // Initialize range value displays
    rangeInputs.forEach(input => {
        const valueDisplay = input.nextElementSibling;
        if (valueDisplay) {
            valueDisplay.textContent = input.value;
            input.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
            });
        }
    });

    // Start button click handler
    console.log('Start button found:', startBtn);
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('Start button clicked');
            showPage('assessment');
        });
    } else {
        console.error('Start button not found!');
    }

    // Back to home button
    const addBackButton = (container) => {
        const backBtn = document.createElement('button');
        backBtn.textContent = 'Back to Home';
        backBtn.className = 'back-btn';
        backBtn.addEventListener('click', () => {
            showPage('home');
        });
        container.appendChild(backBtn);
    };

    // Add back buttons to each page
    document.querySelectorAll('.page:not(#home)').forEach(page => {
        addBackButton(page);
    });

    // Feeling button click handlers
    feelingBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const feeling = btn.dataset.feeling;
            if (selectedFeelingSpan) {
                selectedFeelingSpan.textContent = feeling.toLowerCase();
            }
            showPage('questions');
        });
    });

    // Back to topics button handler
    const backToTopicsBtn = document.getElementById('back-to-topics');
    if (backToTopicsBtn) {
        backToTopicsBtn.addEventListener('click', () => {
            showPage('assessment');
        });
    }

    // Form submission handler
    if (assessmentForm) {
        assessmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values from form
            const feelingScale = parseInt(document.getElementById('feeling-scale').value);
            const motivationScale = parseInt(document.getElementById('motivation-scale').value);
            const sleepHours = parseInt(document.getElementById('sleep-hours').value);
            const managementScale = parseInt(document.getElementById('management-scale').value);

            // Calculate sleep score (convert sleep hours to 1-5 scale)
            let sleepScore;
            if (sleepHours >= 7 && sleepHours <= 9) {
                sleepScore = 5;
            } else if (sleepHours === 6 || sleepHours === 10) {
                sleepScore = 4;
            } else if (sleepHours === 5 || sleepHours === 11) {
                sleepScore = 3;
            } else if (sleepHours === 4 || sleepHours === 12) {
                sleepScore = 2;
            } else {
                sleepScore = 1;
            }

            // Calculate total score
            const totalScore = feelingScale + motivationScale + sleepScore + managementScale;

            // Determine result category and recommendations
            let result, recommendations;
            if (totalScore <= 8) {
                result = "Extremely depressed";
                recommendations = [
                    "Please seek immediate professional help",
                    "Contact the National Crisis Hotline at 988",
                    "Reach out to a trusted friend or family member",
                    "Visit our Resources page for immediate support options"
                ];
            } else if (totalScore <= 12) {
                result = "Abnormally depressed";
                recommendations = [
                    "Consider talking to a mental health professional",
                    "Try our guided meditation exercises",
                    "Start journaling your thoughts and feelings",
                    "Establish a regular sleep schedule"
                ];
            } else if (totalScore <= 16) {
                result = "Verge of depression";
                recommendations = [
                    "It might be helpful to talk to someone",
                    "Practice self-care activities",
                    "Try our breathing exercises",
                    "Set small, achievable daily goals"
                ];
            } else if (totalScore <= 20) {
                result = "Ok";
                recommendations = [
                    "Keep monitoring your mental health",
                    "Continue your current self-care practices",
                    "Try our meditation exercises",
                    "Consider starting a gratitude journal"
                ];
            } else {
                result = "Great";
                recommendations = [
                    "Keep up the good work!",
                    "Share your positive practices with others",
                    "Maintain your healthy habits",
                    "Check out our meditation exercises for additional wellness"
                ];
            }

            // Display results
            const scoreResult = document.getElementById('score-result');
            const recommendationsDiv = document.getElementById('recommendations');
            
            if (scoreResult && recommendationsDiv) {
                scoreResult.innerHTML = `
                    <h3>Your Score: ${totalScore}</h3>
                    <p>Status: ${result}</p>
                `;

                recommendationsDiv.innerHTML = `
                    <h3>Recommendations:</h3>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                    <div class="action-buttons">
                        <a href="pages/resources.html" class="action-btn">Find Help</a>
                        <a href="pages/meditation.html" class="action-btn">Try Meditation</a>
                        <a href="pages/journal.html" class="action-btn">Start Journaling</a>
                    </div>
                `;

                // Show results page
                showPage('results');

                // Store assessment data
                const assessment = {
                    feeling: selectedFeelingSpan ? selectedFeelingSpan.textContent : '',
                    feelingScale,
                    motivationScale,
                    sleepHours,
                    managementScale,
                    totalScore,
                    result,
                    timestamp: new Date().toISOString()
                };

                // Save to localStorage
                try {
                    const assessments = JSON.parse(localStorage.getItem('assessments') || '[]');
                    assessments.push(assessment);
                    localStorage.setItem('assessments', JSON.stringify(assessments));
                } catch (error) {
                    console.error('Error saving assessment:', error);
                }
            }
        });
    }
});
