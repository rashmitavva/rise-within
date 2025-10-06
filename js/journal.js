document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let journalEntries = [];
    try {
        const savedEntries = localStorage.getItem('journalEntries');
        console.log('Saved entries from localStorage:', savedEntries);
        journalEntries = JSON.parse(savedEntries) || [];
    } catch (error) {
        console.error('Error loading journal entries:', error);
        journalEntries = [];
    }
    
    const moodData = journalEntries.map(entry => ({
        date: entry.date,
        mood: entry.mood
    }));
    let currentPage = 1;
    const entriesPerPage = 10;

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('entry-date').value = today;

    // Initialize the mood chart
    function initMoodChart() {
        const ctx = document.getElementById('mood-chart').getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: moodData.map(entry => entry.date),
                datasets: [{
                    label: 'Mood',
                    data: moodData.map(entry => entry.mood),
                    borderColor: 'rgb(70, 130, 180)',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        min: 1,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return ['��', '😕', '😐', '🙂', '😊'][value - 1];
                            }
                        }
                    }
                }
            }
        });
    }

    let moodChart = initMoodChart();

    // Get DOM elements
    const entriesList = document.getElementById('entries-list');
    const entriesContainer = document.getElementById('entries-container');
    const toggleButton = document.getElementById('toggle-entries-btn');

    // Create export button
    const exportButton = document.createElement('button');
    exportButton.className = 'export-btn';
    exportButton.textContent = 'Export Journal Entries';
    exportButton.addEventListener('click', function() {
        // Create a file with the journal entries
        const data = JSON.stringify(journalEntries, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        
        // Create a download link
        const downloadLink = document.createElement('a');
        const date = new Date().toISOString().split('T')[0];
        downloadLink.href = url;
        downloadLink.download = `journal-entries-${date}.json`;
        
        // Trigger download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Journal entries exported successfully!';
        entriesContainer.insertAdjacentElement('beforebegin', successMessage);
        setTimeout(() => successMessage.remove(), 3000);
    });
    entriesContainer.insertBefore(exportButton, entriesContainer.firstChild);

    // Create pagination container
    const paginationContainer = document.createElement('div');
    paginationContainer.className = 'pagination';
    entriesList.parentNode.insertBefore(paginationContainer, entriesList.nextSibling);

    // Make sure entries container starts hidden
    entriesContainer.style.display = 'none';
    paginationContainer.style.display = 'none';

        // Set up toggle button functionality
    toggleButton.addEventListener('click', function() {
        // Debug logging
        console.log('Toggle button clicked');
        console.log('Current entries:', journalEntries);
        console.log('Entries container:', entriesContainer);
        console.log('Current display state:', entriesContainer.style.display);

        // Force toggle visibility
        if (entriesContainer.style.display === 'none' || entriesContainer.style.display === '') {
            console.log('Showing entries container');
            entriesContainer.style.display = 'block';
            toggleButton.textContent = 'Hide Previous Entries';
            
            // Always call displayJournalEntries
            console.log('Displaying entries for page:', currentPage);
            displayJournalEntries(currentPage);
            
            // Show pagination if needed
            if (journalEntries.length > entriesPerPage) {
                console.log('Showing pagination');
                paginationContainer.style.display = 'flex';
            }
        } else {
            console.log('Hiding entries container');
            entriesContainer.style.display = 'none';
            toggleButton.textContent = 'View Previous Entries';
            paginationContainer.style.display = 'none';
        }
    });

    // Handle journal form submission
    const journalForm = document.getElementById('journal-form');
    journalForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Create new entry
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
            ].filter(Boolean),
            timestamp: new Date().toISOString()
        };

        // Add entry to array
        journalEntries.push(entry);

        // Save to localStorage
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
        console.log('Entry saved:', entry); // Debug
        console.log('All entries:', journalEntries); // Debug

        // Update mood data and chart
        moodData.push({
            date: entry.date,
            mood: entry.mood
        });

        moodChart.data.labels = moodData.map(entry => entry.date);
        moodChart.data.datasets[0].data = moodData.map(entry => entry.mood);
        moodChart.update();

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Journal entry saved successfully!';
        journalForm.insertAdjacentElement('beforebegin', successMessage);

        // Reset form
        journalForm.reset();
        document.getElementById('entry-date').value = today;

        // Remove success message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);

        // Update entries display if visible
        if (entriesContainer.style.display === 'block') {
            displayJournalEntries(currentPage);
        }
    });

    // Function to display journal entries with pagination
    function displayJournalEntries(page) {
        currentPage = page;
        console.log('Displaying entries for page:', page); // Debug
        console.log('Journal entries available:', journalEntries.length); // Debug
        console.log('Entries list element:', entriesList); // Debug
        
        // Sort entries by date, most recent first
        const sortedEntries = [...journalEntries].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        // Calculate pagination
        const totalPages = Math.ceil(sortedEntries.length / entriesPerPage);
        const startIndex = (page - 1) * entriesPerPage;
        const endIndex = startIndex + entriesPerPage;
        const currentEntries = sortedEntries.slice(startIndex, endIndex);

        console.log('Total entries:', sortedEntries.length); // Debug
        console.log('Current page entries:', currentEntries); // Debug

        if (sortedEntries.length === 0) {
            // Show "No entries yet" message if there are no entries
            entriesList.innerHTML = '<p class="no-entries">No journal entries yet. Start by creating your first entry above!</p>';
            paginationContainer.style.display = 'none';
        } else {
            // Generate HTML for current page entries
            entriesList.innerHTML = currentEntries.map(entry => `
                <div class="journal-card">
                    <div class="entry-header">
                        <h3>${formatDate(entry.date)}</h3>
                        <span class="mood-emoji">${getMoodEmoji(entry.mood)}</span>
                    </div>
                    <div class="entry-content">
                        <h4>Grateful for:</h4>
                        <ul>
                            ${entry.gratitude.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                        <h4>Reflection:</h4>
                        <p>${entry.reflection}</p>
                        ${entry.goals.length > 0 ? `
                            <h4>Goals:</h4>
                            <ul>
                                ${entry.goals.map(goal => `<li>${goal}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                </div>
            `).join('');

            // Update pagination
            if (totalPages > 1) {
                updatePagination(totalPages, page);
                paginationContainer.style.display = 'flex';
            } else {
                paginationContainer.style.display = 'none';
            }
        }
    }

    // Function to update pagination buttons
    function updatePagination(totalPages, currentPage) {
        paginationContainer.innerHTML = '';
        
        // Add "Previous" button if not on first page
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.className = 'page-btn';
            prevButton.textContent = '←';
            prevButton.addEventListener('click', () => {
                displayJournalEntries(currentPage - 1);
            });
            paginationContainer.appendChild(prevButton);
        }

        // Add page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'page-btn' + (i === currentPage ? ' active' : '');
            pageButton.addEventListener('click', () => {
                displayJournalEntries(i);
            });
            paginationContainer.appendChild(pageButton);
        }

        // Add "Next" button if not on last page
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.className = 'page-btn';
            nextButton.textContent = '→';
            nextButton.addEventListener('click', () => {
                displayJournalEntries(currentPage + 1);
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    // Helper function to format date
    function formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Helper function to get mood emoji
    function getMoodEmoji(mood) {
        const emojis = {
            5: '😊',
            4: '🙂',
            3: '😐',
            2: '😕',
            1: '😢'
        };
        return emojis[mood] || '😐';
    }
});
