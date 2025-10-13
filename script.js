const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};
const claimHistory = JSON.parse(localStorage.getItem('claimHistory')) || [];

const logInput = document.getElementById('logInput');
const pointsToAdd = document.getElementById('pointsToAdd');
const addPointsBtn = document.getElementById('addPointsBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const leaderboardBody = document.getElementById('leaderboardBody');
const claimHistoryBody = document.getElementById('claimHistoryBody');

const claimModal = document.getElementById('claimModal');
const claimModalTitle = document.getElementById('claimModalTitle');
const claimPointsInput = document.getElementById('claimPointsInput');
const claimItemInput = document.getElementById('claimItemInput');
const cancelClaimBtn = document.getElementById('cancelClaimBtn');
const confirmClaimBtn = document.getElementById('confirmClaimBtn');

let selectedPlayer = null;

// Save data
function saveData() {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    localStorage.setItem('claimHistory', JSON.stringify(claimHistory));
}

// Render leaderboard
function renderLeaderboard() {
    leaderboardBody.innerHTML = '';
    Object.entries(leaderboard)
        .sort((a, b) => b[1] - a[1])
        .forEach(([name, points]) => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'border-gray-700');
            row.innerHTML = `
        <td class="py-2">${name}</td>
        <td class="py-2">${points}</td>
        <td class="py-2 text-center">
          <button class="bg-green-600 px-3 py-1 rounded claim-btn" data-name="${name}">Claim</button>
        </td>
      `;
            leaderboardBody.appendChild(row);
        });
    attachClaimEvents();
}

// Render claim history
function renderClaimHistory() {
    claimHistoryBody.innerHTML = '';
    claimHistory.forEach(entry => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'border-gray-700');
        row.innerHTML = `
      <td class="py-2">${entry.name}</td>
      <td class="py-2">${entry.item}</td>
      <td class="py-2">${entry.points}</td>
      <td class="py-2">${entry.date}</td>
    `;
        claimHistoryBody.appendChild(row);
    });
}

// Add points logic
addPointsBtn.addEventListener('click', () => {
    const names = logInput.value.trim().split('\n').map(n => n.trim()).filter(n => n);
    const points = parseInt(pointsToAdd.value);

    if (names.length === 0 || isNaN(points)) {
        alert('Please enter names and points!');
        return;
    }

    names.forEach(name => {
        const match = Object.keys(leaderboard).find(n => n.toLowerCase() === name.toLowerCase());
        if (match) {
            leaderboard[match] += points;
        } else {
            leaderboard[name] = points;
        }
    });

    saveData();
    renderLeaderboard();
    logInput.value = '';
    pointsToAdd.value = '';
});

// Claim button
function attachClaimEvents() {
    document.querySelectorAll('.claim-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPlayer = btn.dataset.name;
            claimModalTitle.textContent = `Claim for ${selectedPlayer}`;
            claimPointsInput.value = '';
            claimItemInput.value = '';
            claimModal.classList.remove('hidden');
        });
    });
}

// Claim modal controls
cancelClaimBtn.addEventListener('click', () => claimModal.classList.add('hidden'));
confirmClaimBtn.addEventListener('click', () => {
    const usedPoints = parseInt(claimPointsInput.value);
    const item = claimItemInput.value.trim();
    if (isNaN(usedPoints) || usedPoints <= 0 || !item) {
        alert('Enter valid points and item.');
        return;
    }
    if (leaderboard[selectedPlayer] < usedPoints) {
        alert('Not enough points!');
        return;
    }

    leaderboard[selectedPlayer] -= usedPoints;
    claimHistory.push({
        name: selectedPlayer,
        item,
        points: usedPoints,
        date: new Date().toLocaleString()
    });

    saveData();
    renderLeaderboard();
    renderClaimHistory();
    claimModal.classList.add('hidden');
});

// Clear all data
clearDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data?')) {
        localStorage.clear();
        location.reload();
    }
});

// Initialize
renderLeaderboard();
renderClaimHistory();
