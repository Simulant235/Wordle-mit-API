// Game state
let targetWord = '';
let currentRow = 0;
let currentTile = 0;
let gameOver = false;
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// DOM elements
const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const keyboard = document.getElementById('keyboard');
const newGameBtn = document.getElementById('new-game');

// Word list for the game (German 5-letter words)
const wordList = [
    'APFEL', 'BAUER', 'BLATT', 'BRIEF', 'BRUST', 'BUSCH', 'DANKE', 'EISEN',
    'ESSEN', 'FEHLT', 'FEUER', 'GABEL', 'GERNE', 'GLAS', 'GRUEN', 'GRUND',
    'HAARE', 'HALLO', 'HAUSE', 'HELLE', 'HERTZ', 'HEUTE', 'HOLZ', 'HOSEN',
    'KARTE', 'KATZE', 'KLEIN', 'KOPF', 'KRAFT', 'KREIS', 'KUNST', 'LACHE',
    'LAMPE', 'LEBEN', 'LICHT', 'LIEBE', 'LINKS', 'LUFT', 'MACHT', 'MOND',
    'MONAT', 'MUSIK', 'NACHT', 'PAPST', 'PFERD', 'PIZZA', 'PLATZ', 'PREIS',
    'RECHT', 'REGEN', 'REISE', 'SALAT', 'SACHE', 'SCHUH', 'SPIEL', 'SPORT',
    'STADT', 'STEIN', 'STERN', 'STIFT', 'STUHL', 'TASSE', 'TISCH', 'TRAUM',
    'VOGEL', 'WAGEN', 'WASSER', 'WELT', 'WIND', 'WOLKE', 'WORT', 'ZAHN',
    'ZUNGE', 'ZUCKER'
];

// Initialize game
function initGame() {
    gameBoard.innerHTML = '';
    currentRow = 0;
    currentTile = 0;
    gameOver = false;
    message.textContent = '';
    message.className = 'message';
    
    // Reset keyboard
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.classList.remove('correct', 'present', 'absent');
    });
    
    // Select random word
    targetWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    console.log('Target word:', targetWord); // For debugging
    
    // Create game board
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.setAttribute('data-row', i);
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-row', i);
            tile.setAttribute('data-col', j);
            row.appendChild(tile);
        }
        
        gameBoard.appendChild(row);
    }
}

// Get current guess
function getCurrentGuess() {
    const tiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
    let guess = '';
    tiles.forEach(tile => {
        if (tile.textContent) {
            guess += tile.textContent;
        }
    });
    return guess;
}

// Add letter to board
function addLetter(letter) {
    if (currentTile < WORD_LENGTH && !gameOver) {
        const tile = document.querySelector(`[data-row="${currentRow}"][data-col="${currentTile}"]`);
        tile.textContent = letter;
        tile.classList.add('filled');
        currentTile++;
    }
}

// Remove letter from board
function removeLetter() {
    if (currentTile > 0 && !gameOver) {
        currentTile--;
        const tile = document.querySelector(`[data-row="${currentRow}"][data-col="${currentTile}"]`);
        tile.textContent = '';
        tile.classList.remove('filled');
    }
}

// Check word via API
async function checkWordAPI(word) {
    try {
        // Using Free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        if (response.ok) {
            return true;
        }
        
        // Fallback: check against our word list (case-insensitive)
        return wordList.some(w => w.toUpperCase() === word.toUpperCase());
    } catch (error) {
        console.error('API error:', error);
        // Fallback: check against our word list
        return wordList.some(w => w.toUpperCase() === word.toUpperCase());
    }
}

// Show message
function showMessage(text, type = '') {
    message.textContent = text;
    message.className = 'message';
    if (type) {
        message.classList.add(type);
    }
    
    if (type === 'error') {
        setTimeout(() => {
            message.textContent = '';
            message.className = 'message';
        }, 2000);
    }
}

// Update keyboard colors
function updateKeyboard(letter, status) {
    const key = document.querySelector(`[data-key="${letter}"]`);
    if (key) {
        // Only update if the new status is better than the current one
        // Priority: correct > present > absent
        if (status === 'correct') {
            key.classList.remove('present', 'absent');
            key.classList.add('correct');
        } else if (status === 'present' && !key.classList.contains('correct')) {
            key.classList.remove('absent');
            key.classList.add('present');
        } else if (status === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.classList.add('absent');
        }
    }
}

// Check guess
async function checkGuess() {
    const guess = getCurrentGuess();
    
    if (guess.length !== WORD_LENGTH) {
        showMessage('Nicht genug Buchstaben!', 'error');
        shakeTiles();
        return;
    }
    
    // Check if word is valid using API
    const isValid = await checkWordAPI(guess);
    if (!isValid) {
        showMessage('Wort nicht in der Liste!', 'error');
        shakeTiles();
        return;
    }
    
    // Reveal tiles with animation
    const tiles = document.querySelectorAll(`.tile[data-row="${currentRow}"]`);
    const letterCount = {};
    const guessArray = guess.split('');
    const targetArray = targetWord.split('');
    
    // Count letters in target word
    targetArray.forEach(letter => {
        letterCount[letter] = (letterCount[letter] || 0) + 1;
    });
    
    // First pass: mark correct letters (green)
    const statuses = new Array(WORD_LENGTH).fill('');
    guessArray.forEach((letter, i) => {
        if (letter === targetArray[i]) {
            statuses[i] = 'correct';
            letterCount[letter]--;
        }
    });
    
    // Second pass: mark present letters (yellow)
    guessArray.forEach((letter, i) => {
        if (statuses[i] === '') {
            if (targetArray.includes(letter) && letterCount[letter] > 0) {
                statuses[i] = 'present';
                letterCount[letter]--;
            } else {
                statuses[i] = 'absent';
            }
        }
    });
    
    // Apply colors with animation
    tiles.forEach((tile, i) => {
        setTimeout(() => {
            tile.classList.add('reveal');
            tile.classList.add(statuses[i]);
            updateKeyboard(guessArray[i], statuses[i]);
        }, i * 300);
    });
    
    // Wait for animations to complete
    setTimeout(() => {
        if (guess === targetWord) {
            gameOver = true;
            showMessage('Glückwunsch! Du hast gewonnen! 🎉', 'success');
        } else if (currentRow === MAX_GUESSES - 1) {
            gameOver = true;
            showMessage(`Spiel vorbei! Das Wort war: ${targetWord}`, 'error');
        } else {
            currentRow++;
            currentTile = 0;
        }
    }, WORD_LENGTH * 300 + 500);
}

// Shake tiles animation
function shakeTiles() {
    const row = document.querySelector(`[data-row="${currentRow}"]`);
    row.classList.add('shake');
    setTimeout(() => {
        row.classList.remove('shake');
    }, 500);
}

// Handle keyboard click
keyboard.addEventListener('click', (e) => {
    if (e.target.classList.contains('key')) {
        const key = e.target.getAttribute('data-key');
        handleInput(key);
    }
});

// Handle physical keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    
    if (key === 'ENTER') {
        handleInput('ENTER');
    } else if (key === 'BACKSPACE') {
        handleInput('BACKSPACE');
    } else if (/^[A-Z]$/.test(key)) {
        handleInput(key);
    }
});

// Handle input
function handleInput(key) {
    if (gameOver) return;
    
    if (key === 'ENTER') {
        checkGuess();
    } else if (key === 'BACKSPACE') {
        removeLetter();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
}

// New game button
newGameBtn.addEventListener('click', () => {
    initGame();
});

// Start game on load
initGame();
