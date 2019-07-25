/*
 * Create a list that holds all of your cards
 */

let cards = ['fa-anchor', 'fa-anchor', 'fa-anchor', 'fa-bolt',
    'fa-cube', 'fa-anchor', 'fa-leaf', 'fa-bicycle',
    'fa-bolt', 'fa-bomb', 'fa-leaf', 'fa-bomb',
    'fa-bolt', 'fa-bicycle', 'fa-bolt', 'fa-cube'
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(cards) {
    var currentIndex = cards.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
    return cards;
}


// list of all variables
let moves = 0;
let starRating = document.querySelectorAll('.stars');
let moveCount = document.querySelector('.moves-count');
let moveText = document.querySelector('.moves-text');;
let restartButton = document.querySelector('.fa-redo-alt');
let decks = document.querySelector('.decks');
let stars = document.querySelectorAll('.star');
let modalHours = document.querySelector('.modal-hours');
let modalMinutes = document.querySelector('.modal-minutes');
let modalSeconds = document.querySelector('.modal-seconds');
let modalMoves = document.querySelector('.modal-moves-count');
let modalRatings = document.querySelector('.modal-rating');
let modal = document.querySelector('#modal');
let closeModal = document.querySelector('.modal-close-btn');
let restartModal = document.querySelector('.modal-replay-btn');
let timeHolder = document.querySelector('.time-holder');

let openedCards = [];
let matchedCards = [];

//game status 
let startGame = false;
let hours = 0;
let minutes = 0;
let seconds = 0;
let timeTaken = 0;
let timer = undefined;
let rating = 3;
let match = 0;

// create the  cards on the body
for (let i = 0; i < cards.length; i++) {
    let list = document.querySelector('.card');
    let card = document.querySelector('.fa');
    card.className = `fa ${cards[i]}`;
    list.appendChild(card);
    list.addEventListener('click', openCard); //click event listener on the card befor appending to the parent
    decks.appendChild(list)
}


const listOfCards = [].slice.call(decks.children);
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//EVENT LISTENERS


// click event listener to reset the game 
restartButton.addEventListener('click', restartGame);

//click event listener to close the modal
closeModal.addEventListener('click', closedModal);

//click event to restart the game 
restartModal.addEventListener('click', restartGame);


//GAME LOGIC HERE 


function restartGame() {
    // set the moves count back to zero
    //set the timmer back to zero
    // unshuffle the cards back to normal

    closedModal();
    stopTimer();
    resetsMoves();
    resetCards();

}

function openCard(e) {
    //when a card is clicked, it should show the icon 
    //increase the move of the card
    startTimer();
    increaseMove();
    let target = e.target;
    const parent = target.parentElement;
    if (parent.classList.contains('card')) {
        target = parent;
    }

    if (!openedCards.includes(target)) {
        target.classList.add('open', 'show');
        openedCards.push(target);
        checkMatchedCards();
    }
}

function increaseTimer() {
    timeTaken++;
    setTime(timeTaken);
}

function startTimer() {
    //when the card is clicked the timer should start immediately

    if (!startGame) {
        startGame = true;
        timer = setInterval(increaseTimer, 1000);
    }
}

function stopTimer() {
    //when the game is ended the card timer should stop

    startGame = false;
    clearInterval(timer);
}

function setTime(timeTaken) { 
    let secondsTime = timeTaken; 
    hours = parseInt(secondsTime / 3600); 
    const displayHours = stringifyTime(hours);
    minutes = parseInt(secondsTime / 60); 
    const displayMinutes = stringifyTime(minutes); 
    seconds = parseInt(secondsTime % 60); 
    const displaySeconds = stringifyTime(seconds);
    timeHolder.innerHTML = `${displayHours}:${displayMinutes}:${displaySeconds}`;
 }

function stringifyTime(val) {
    var valString = val + '';
    return valString.length >= 2 ? `${val}` : `0${val}`;
}

function increaseMove() {
    moves++;
    moveCount.innerText = moves;
    if (moves === 1) {
        moveText.innerText = 'move';
    } else {
        moveText.innerText = 'moves';
    }
    ratingStars();
}

function resetsMoves() {
    //reset time
    //reset stars
    //resets moves
    //resets matches 
    // rating = 3;
    moves = 0;
    match = 0;
    moveCount.innerText = moves;
    stars.forEach(star => {
        removeClassByPrefix(star, 'empty-star');
    });
    hours = 0;
    minutes = 0;
    seconds = 0;
    timeTaken = 0;
    timeHolder.textContent = '00:00:00';
}

function ratingStars() {
    if (moves === 18) {
        rating--;
        stars[2].classList.add('empty-star');
    } else if (moves === 26) {
        rating--;
        stars[1].classList.add('empty-star');
    } else if (moves === 38) {
        rating--;
        stars[0].classList.add('empty-star');
    }
}

function removeClassByPrefix(element, prefix, replace = '') {
    var regx = new RegExp('\\b' + prefix + '(.*)?\\b', 'g');
    element.className = element.className.replace(regx, replace);
    return element;
}

function checkMatchedCards() {
    //get the length of the cards 
    //check if length is equalo to 2 
    //get the opened cards in variables 
    //check if the class names are equal, if they are run cardMatched, if not run cardClosed

    let cardLength = openedCards.length;
    if (cardLength === 2) {
        let firstCard = openedCards[0];
        let secondCard = openedCards[1];
        let firstClassName = firstCard.children[0].classList.toString();
        let secondClassName = secondCard.children[0].classList.toString();
        if (firstClassName === secondClassName) {
            increaseMatch();
            cardMatched(firstCard);
            cardMatched(secondCard);
        } else {
            notMatched(firstCard);
            notMatched(secondCard);
        }
        openedCards = [];
        gameWon();
    }
}

function gameWon() {
    if (match === 8) {
        stopTimer();
        showModal();
    }
}

function notMatched(card) {
    // card should show red
    card.classList.add('non-matching-icons', 'heartBeat')
    setTimeout(() => {
        card.classList.remove('open', 'show', 'non-matching-icons');
    }, 1000);

}

function increaseMatch() {
    match++;
}

function cardMatched(card) {
    //cards should flip
    //cards should show green 
    card.classList.add('matching-icons', 'rubberBand');
    document.getElementsByClassName('matching-icons').disabled = true;

}

function showModal() {

    modalHours.textContent = hours > 0 ? (hours === 1 ? `${hours} hour, ` : `${hours} hours, `) : `${hours} hour, `;

    modalMinutes.textContent = minutes > 0 ? (minutes === 1 ? `${minutes} minute, ` : `${minutes} minutes, `) : `${minutes} minutes, `;
    modalSeconds.textContent = `${seconds} seconds`;
    modalMoves.textContent = `${moves} moves`;
    modalRatings.textContent = rating;
    modal.style.display = 'block';
}

function closedModal() {
    modal.style.display = 'none';
}

function resetCards() {
    //clear the opened cards array 
    //shuffle the cards
    //iterate over the cards and then remove the class from list items 
    openedCards = [];
    matchedCards = [];
    cards = shuffle(cards);
    listOfCards.forEach((listOfCard, index) => {
        // remove the classes from the already opened cards
        listOfCard.classList.remove('open', 'show', 'matching-icons');
        // Remove symbols
        removeClassByPrefix(listOfCard.children[0], 'fa ');

        // Attach new icons to cards
        listOfCard.children[0].className = `fa ${cards[index]}`;
    });
}