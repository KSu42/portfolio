// sounds
let audio1 = new Audio('media/travis_scott_dope.mp3');
let audio2 = new Audio('media/travis_scott_its_lit.mp3');
let audio3 = new Audio('media/travis_scott_ohh.mp3');
let audio4 = new Audio('media/travis_scott_skrt.mp3');
let audio5 = new Audio('media/travis_scott_straight_up.mp3');
let audio6 = new Audio('media/travis_scott_straight_up_two.mp3');

// preload first sound
audio1.load();

// stores first element matching '.deck' into a constant
const cardsDeck = document.querySelector('.deck');

// stores all child li elements of deck class
const cards = document.querySelectorAll('.deck li');

// creates array from nodelist of all child li elements of deck class
const cardsArray = [...cards];

let openCards = [];
let matchedCards = [];

function shuffleCards() {

	// shuffles cards and stores them in a document fragment
	const frag = document.createDocumentFragment();
	shuffle(cardsArray).forEach(function (card) {
		frag.appendChild(card);
	});

	// appends the fragment (shuffled cards) to the deck 
	cardsDeck.appendChild(frag);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	let currentIndex = array.length,
		temporaryValue, randomIndex;

	while (currentIndex !== 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// shows all cards for a 4 second sneak-peek then hides them
function displayCards() {
	cards.forEach(function (card) {
		card.classList.toggle('open');
	});
	setTimeout(function () {
		cards.forEach(function (card) {
			card.classList.toggle('open');
		});
		timeStart();
		playSounds(audio5);
	}, 4000);
}

function toggleOpen(clickedCard) {
	clickedCard.classList.toggle('open');
}

function toggleMatch(clickedCard) {
	clickedCard.classList.toggle('open');
	clickedCard.classList.toggle('match');
}

const resetButton = document.querySelector('.startButton');
resetButton.addEventListener('click', function (e) {
	e.preventDefault();
	resetGame();
});

function resetGame() {
	timeStop();

	// listens for clicks on child 'li' elements (cards) of 'deck' class that have class of 'card'
	cardsDeck.addEventListener('click', function (card) {
		const clickedCard = card.target;
		if (
			clickedCard.classList.contains('card') &&
			openCards.length < 2 &&
			!openCards.includes(clickedCard) &&
			!matchedCards.includes(clickedCard) &&
			starCounter > 0
		) {
			toggleOpen(clickedCard);
			addToOpenCards(clickedCard);
			if (openCards.length == 2) {
				movesUp();
				checkCards();
			}
		}
	});

	// reset cards
	openCards = [];
	matchedCards = [];
	cards.forEach(function (card) {
		card.classList = 'card';
	});

	// reset time
	totalSeconds = 0;
	displayTime();

	// reset moves
	moves = 0;
	movesDisplay.textContent = moves + ' Moves';

	// reset stars
	starDisplay.innerHTML = `<li>
	<i class="fa fa-star"></i>
</li>
<li>
	<i class="fa fa-star"></i>
</li>
<li>
	<i class="fa fa-star"></i>
</li>
<li>
	<i class="fa fa-star"></i>
</li>
<li>
	<i class="fa fa-star"></i>
</li>`;
	starCounter = 10;

	shuffleCards();
	displayCards();
}

function addToOpenCards(clickedCard) {
	openCards.push(clickedCard);
}

function addToMatchedCards(clickedCard) {
	matchedCards.push(clickedCard);
	toggleMatch(clickedCard);

	// checks for game win
	if (matchedCards.length == 16) {
		timeStop();
		setTimeout(gameWonModal, 500);
	}
}

function checkCards() {
	if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
		if (matchedCards.length < 14) {
			playSounds(audio1);
		} else {
			playSounds(audio2);
		}
		openCards.forEach(function (clickedCard) {
			addToMatchedCards(clickedCard);
		});
		openCards = [];
	} else {
		starDown();
		setTimeout(function () {
			hideOpenCards();
		}, 500);
	}
}

function hideOpenCards() {
	openCards.forEach(function (clickedCard) {
		toggleOpen(clickedCard);
	});
	openCards = [];
}

let moves = 0;
const movesDisplay = document.querySelector('.moves');
movesDisplay.textContent = moves + ' Moves';

function movesUp() {
	moves++;
	if (moves == 1) {
		movesDisplay.textContent = moves + ' Move';
	} else {
		movesDisplay.textContent = moves + ' Moves';
	}
}

const starDisplay = document.querySelector('.stars');
let starCounter = 10;

function starDown() {
	starCounter--;

	// removes a star every 2 mismatches
	if (starCounter % 2 !== 1) {
		starDisplay.firstElementChild.remove();
		if (starCounter > 0) {
			playSounds(audio4);
		}
	} else {
		playSounds(audio3);
	}

	// checks for game loss
	if (starCounter == 0) {
		playSounds(audio6);
		timeStop();
		setTimeout(gameLostModal, 100);
	}
}

let totalSeconds = 0;
let timeInterval;

function timeStart() {
	timeInterval = setInterval(function () {
		totalSeconds++;
		displayTime();
	}, 1000);
}

function timeStop() {
	clearInterval(timeInterval);
}

let seconds = Math.floor(totalSeconds % 60);
let minutes = Math.floor(totalSeconds / 60);
const timeDisplay = document.querySelector('.time');
timeDisplay.innerHTML = `Time ${minutes}:0${seconds}`;

function displayTime() {
	seconds = totalSeconds % 60;
	minutes = parseInt(totalSeconds / 60);
	if (seconds < 10) {
		timeDisplay.innerHTML = `Time ${minutes}:0${seconds}`;
	} else {
		timeDisplay.innerHTML = `Time ${minutes}:${seconds}`;
	}
}

let modalStars;
let modalTime;

function gameWonModal() {
	if (seconds < 10) {
		modalTime = `${minutes}:0${seconds}`;
	} else {
		modalTime = `${minutes}:${seconds}`;
	}
	if (starDisplay.childElementCount == 1) {
		modalStars = `${starDisplay.childElementCount} star`;
	} else {
		modalStars = `${starDisplay.childElementCount} stars`;
	}
	const modalDisplay = `You've won! You finished with ${modalStars} in ${modalTime}. Do you want to play again?`;
	alert(modalDisplay);
	resetGame();
}

function gameLostModal() {
	const modal = `You've lost. Do you want to try again?`;
	alert(modal);
	resetGame();
}

// multi channel audio referenced from http://www.storiesinflight.com/html5/audio.html
let channelMax = 6; // number of channels
let audioChannels = new Array();
for (let a = 0; a < channelMax; a++) { // prepare the channels
	audioChannels[a] = new Array();
	audioChannels[a].channel = new Audio(); // create a new audio object
	audioChannels[a].finished = -1; // expected end time for this channel
}

function playSounds(sound) {
	for (let a = 0; a < audioChannels.length; a++) {
		let thisTime = new Date();
		if (audioChannels[a].finished < thisTime.getTime()) { // is this channel finished?
			audioChannels[a].finished = thisTime.getTime() + sound.duration * 1000;
			audioChannels[a].channel.src = sound.src;
			audioChannels[a].channel.load();
			audioChannels[a].channel.play();
			break;
		}
	}
}