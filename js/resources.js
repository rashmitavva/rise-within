// Initialize map
let map;
const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY'; // Replace with actual API key
const BETTER_HELP_API_KEY = 'YOUR_API_KEY'; // Replace with actual API key

// Initialize the map
function initMap() {
    map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

// Search for therapists using multiple APIs
async function searchTherapists() {
    const zipCode = document.getElementById('location-input').value;
    const resultsDiv = document.getElementById('therapist-results');
    resultsDiv.innerHTML = '<div class="loading">Searching for therapists...</div>';

    try {
        // Get location coordinates from zip code
        const geocodeResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.results.length === 0) {
            throw new Error('Invalid zip code');
        }

        const { lat, lng } = geocodeData.results[0].geometry.location;

        // Search for therapists using BetterHelp API
        const betterHelpResponse = await fetch(
            `https://api.betterhelp.com/therapists/search?lat=${lat}&lng=${lng}&radius=25&key=${BETTER_HELP_API_KEY}`
        );
        const betterHelpData = await betterHelpResponse.json();

        // Search Psychology Today directory
        const psychologyTodayResponse = await fetch(
            `https://api.psychologytoday.com/v1/therapists/search?latitude=${lat}&longitude=${lng}&radius=25`,
            {
                headers: {
                    'Authorization': `Bearer ${PSYCHOLOGY_TODAY_API_KEY}`
                }
            }
        );
        const psychologyTodayData = await psychologyTodayResponse.json();

        // Combine and deduplicate results
        const therapists = [...betterHelpData.therapists, ...psychologyTodayData.therapists];
        
        // Update map
        map.setView([lat, lng], 12);
        therapists.forEach(therapist => {
            if (therapist.latitude && therapist.longitude) {
                L.marker([therapist.latitude, therapist.longitude])
                    .bindPopup(`<b>${therapist.name}</b><br>${therapist.specialty}`)
                    .addTo(map);
            }
        });

        // Display results
        displayTherapists(therapists);

    } catch (error) {
        resultsDiv.innerHTML = `
            <div class="error-message">
                ${error.message || 'Error searching for therapists. Please try again.'}
            </div>
        `;
    }
}

// Display therapist results
function displayTherapists(therapists) {
    const resultsDiv = document.getElementById('therapist-results');
    resultsDiv.innerHTML = '';

    if (therapists.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">No therapists found in your area. Try expanding your search radius.</div>';
        return;
    }

    therapists.forEach(therapist => {
        const card = document.createElement('div');
        card.className = 'therapist-card';
        card.innerHTML = `
            <h3>${therapist.name}</h3>
            <p><strong>Specialty:</strong> ${therapist.specialty}</p>
            <p><strong>Location:</strong> ${therapist.location}</p>
            <p><strong>Insurance:</strong> ${therapist.insurance || 'Contact for insurance information'}</p>
            <p><strong>Virtual Sessions:</strong> ${therapist.virtualSessions ? 'Yes' : 'No'}</p>
            <p class="status ${therapist.accepting ? 'accepting' : 'not-accepting'}">
                ${therapist.accepting ? 'Accepting New Patients' : 'Not Accepting New Patients'}
            </p>
            <div class="button-group">
                <button onclick="window.location.href='${therapist.profileUrl}'" class="profile-btn">
                    View Profile
                </button>
                <button onclick="window.location.href='tel:${therapist.phone.replace(/\D/g, '')}'" class="contact-btn">
                    Contact
                </button>
            </div>
        `;
        resultsDiv.appendChild(card);
    });
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', initMap);

function searchTherapists() {
    const zipCode = document.getElementById('location-input').value;
    const resultsDiv = document.getElementById('therapist-results');
    resultsDiv.innerHTML = ''; // Clear previous results

    therapists.forEach(therapist => {
        const card = document.createElement('div');
        card.className = 'therapist-card';
        card.innerHTML = `
            <h3>${therapist.name}</h3>
            <p><strong>Specialty:</strong> ${therapist.specialty}</p>
            <p><strong>Location:</strong> ${therapist.location}</p>
            <p><strong>Phone:</strong> ${therapist.phone}</p>
            <p class="status ${therapist.accepting ? 'accepting' : 'not-accepting'}">
                ${therapist.accepting ? 'Accepting New Patients' : 'Not Accepting New Patients'}
            </p>
            <button onclick="window.location.href='tel:${therapist.phone.replace(/\D/g, '')}'" class="contact-btn">
                Contact
            </button>
        `;
        resultsDiv.appendChild(card);
    });
}