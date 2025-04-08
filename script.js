// Typing practice configuration
const levels = {
    1: {
        keys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        texts: [
            'as sad dad flag hall glass',
            'had fall slag dash flash',
            'glad slag dash fall hall'
        ]
    },
    2: {
        keys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        texts: [
            'type quiet power write year',
            'query water point your trip',
            'quite write type year power'
        ]
    },
    3: {
        keys: 'abcdefghijklmnopqrstuvwxyz'.split(''),
        texts: [
            'the quick brown fox jumps over the lazy dog',
            'pack my box with five dozen liquor jugs',
            'how vexingly quick daft zebras jump'
        ]
    }
};

// State management
let currentUser = null;
let currentLevel = null;
let startTime = null;
let mistakes = 0;

// DOM Elements
const pages = {
    login: document.getElementById('loginPage'),
    levelSelect: document.getElementById('levelSelect'),
    practice: document.getElementById('practice')
};

// Authentication functions
function login(email, password) {
    // Simple authentication for demo
    if (email && password) {
        currentUser = { email };
        localStorage.setItem('user', JSON.stringify(currentUser));
        showPage('levelSelect');
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('user');
    showPage('loginPage');
}

// Navigation
function showPage(pageId) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageId].classList.add('active');
}

// Keyboard rendering
function renderKeyboard() {
    const keyboard = document.getElementById('keyboard');
    const rows = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    keyboard.innerHTML = rows.map(row => `
        <div class="keyboard-row">
            ${row.map(key => `
                <div class="key ${levels[currentLevel].keys.includes(key) ? 'active' : ''}" data-key="${key}">
                    ${key}
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Typing practice functions
function startPractice(level) {
    currentLevel = level;
    const texts = levels[level].texts;
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    document.getElementById('textToType').textContent = randomText;
    document.getElementById('userInput').value = '';
    document.getElementById('wpm').textContent = '0';
    document.getElementById('accuracy').textContent = '100%';
    document.getElementById('mistakes').textContent = '0';
    mistakes = 0;
    startTime = null;
    renderKeyboard();
    showPage('practice');
}

function calculateStats(userInput, targetText) {
    if (!startTime) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const wordsTyped = userInput.trim().split(' ').length;
    const wpm = Math.round(wordsTyped / timeElapsed);
    
    const correctChars = userInput.split('').filter((char, i) => char === targetText[i]).length;
    const accuracy = Math.round((correctChars / userInput.length) * 100) || 100;

    document.getElementById('wpm').textContent = wpm.toString();
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('mistakes').textContent = mistakes.toString();
}

// Event Listeners
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

document.getElementById('toggleSignup').addEventListener('click', (e) => {
    e.preventDefault();
    const button = document.querySelector('#loginForm button');
    button.textContent = button.textContent === 'Sign In' ? 'Sign Up' : 'Sign In';
});

document.getElementById('logoutBtn').addEventListener('click', logout);

document.querySelectorAll('.level-card').forEach(card => {
    card.addEventListener('click', () => {
        startPractice(parseInt(card.dataset.level));
    });
});

document.getElementById('backToLevels').addEventListener('click', () => {
    showPage('levelSelect');
});

document.getElementById('userInput').addEventListener('input', (e) => {
    if (!startTime) startTime = Date.now();
    
    const userInput = e.target.value;
    const targetText = document.getElementById('textToType').textContent;
    
    if (userInput.length > 0) {
        const lastChar = userInput[userInput.length - 1];
        const expectedChar = targetText[userInput.length - 1];
        if (lastChar !== expectedChar) {
            mistakes++;
        }
    }
    
    calculateStats(userInput, targetText);
    
    if (userInput === targetText) {
        setTimeout(() => {
            startPractice(currentLevel);
        }, 1000);
    }
});

// Check for existing session
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showPage('levelSelect');
    }
});