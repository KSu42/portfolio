
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
	const modal = 'You\'ve lost. Do you want to try again?';
	alert(modal);
	resetGame();
}

// multi channel audio referenced from http://www.storiesinflight.com/html5/audio.html
let channelMax = 6; // number of channels
let audioChannels = [];
for (let a = 0; a < channelMax; a++) { // prepare the channels
	audioChannels[a] = [];
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

// sounds:
// card match
let audio1 = new Audio();
// game win
let audio2 = new Audio();
// card mismatch 1
let audio3 = new Audio();
// card mismatch 2
let audio4 = new Audio();
// game start
let audio5 = new Audio();
// game loss
let audio6 = new Audio();

function sfxSelect(evt) {
	switch (evt.target.value) {
	case '2chainz':
		audio1.src = 'media/2chainz_tru.mp3';
		audio2.src = 'media/2chainz_4.mp3';
		audio3.src = 'media/2chainz_unh3.mp3';
		audio4.src = 'media/2chainz_tellem.mp3';
		audio5.src = 'media/2chainz_yeah2.mp3';
		audio6.src = 'media/2chainz_whistle.mp3';
		break;
	case 'abronson':
		audio1.src = 'media/action_yeah.mp3';
		audio2.src = 'media/action_bronsolino.mp3';
		audio3.src = 'media/actionbronson_unh.mp3';
		audio4.src = 'media/actionbronson_unh.mp3';
		audio5.src = 'media/actionbronson_istme.mp3';
		audio6.src = 'media/action_yo.mp3';
		break;
	case 'bigsean':
		audio1.src = 'media/bigsean_okay.mp3';
		audio2.src = 'media/bigsean_unhunh.mp3';
		audio3.src = 'media/bigsean_whoa.mp3';
		audio4.src = 'media/bigsean_holdup2.mp3';
		audio5.src = 'media/bigsean_doit.mp3';
		audio6.src = 'media/bigsean_stop.mp3';
		break;
	case 'birdman':
		audio1.src = 'media/birdman_6.mp3';
		audio2.src = 'media/birdman_10.mp3';
		audio3.src = 'media/birdman_1.mp3';
		audio4.src = 'media/birdman_4.mp3';
		audio5.src = 'media/birdman_birdman.mp3';
		audio6.src = 'media/birdman_16.mp3';
		break;
	case 'khaled':
		audio1.src = 'media/khaled_majorkey3.mp3';
		audio2.src = 'media/khaled_wethebest.mp3';
		audio3.src = 'media/khaled_blessup2.mp3';
		audio4.src = 'media/khaled_anotherone.mp3';
		audio5.src = 'media/djkhaled_2.mp3';
		audio6.src = 'media/khaled_theydontwant.mp3';
		break;
	case 'diddy':
		audio1.src = 'media/diddy_6.mp3';
		audio2.src = 'media/diddy_4.mp3';
		audio3.src = 'media/diddy_3.mp3';
		audio4.src = 'media/diddy_5.mp3';
		audio5.src = 'media/diddy_1.mp3';
		audio6.src = 'media/diddy_7.mp3';
		break;
	case 'drake':
		audio1.src = 'media/drake_yeahyuh3.mp3';
		audio2.src = 'media/drake_3.mp3';
		audio3.src = 'media/drake_2.mp3';
		audio4.src = 'media/drake_5.mp3';
		audio5.src = 'media/drake_4.mp3';
		audio6.src = 'media/drake_worst.mp3';
		break;
	case 'gucci':
		audio1.src = 'media/gucci_1.mp3';
		audio2.src = 'media/gucci_4.mp3';
		audio3.src = 'media/gucci_14.mp3';
		audio4.src = 'media/gucci_14.mp3';
		audio5.src = 'media/gucci_9.mp3';
		audio6.src = 'media/gucci_8.mp3';
		break;
	case 'jayz':
		audio1.src = 'media/jayz_1.mp3';
		audio2.src = 'media/jayz5.mp3';
		audio3.src = 'media/jayz8.mp3';
		audio4.src = 'media/jayz_woo.mp3';
		audio5.src = 'media/jayz_9.mp3';
		audio6.src = 'media/jayz_7.mp3';
		break;
	case 'weezy':
		audio1.src = 'media/weezy_17.mp3';
		audio2.src = 'media/weezy_29.mp3';
		audio3.src = 'media/weezy_14.mp3';
		audio4.src = 'media/weezy_16.mp3';
		audio5.src = 'media/weezy_31.mp3';
		audio6.src = 'media/weezy_25.mp3';
		break;
	case 'tip':
		audio1.src = 'media/ti_5.mp3';
		audio2.src = 'media/ti_3.mp3';
		audio3.src = 'media/ti_2.mp3';
		audio4.src = 'media/ti_2.mp3';
		audio5.src = 'media/ti_32.mp3';
		audio6.src = 'media/ti_22.mp3';
		break;
	case 'takeoff':
		audio1.src = 'media/takeoff_ayy.mp3';
		audio2.src = 'media/takeoff_money.mp3';
		audio3.src = 'media/takeoff_ugh.mp3';
		audio4.src = 'media/takeoff_woo.mp3';
		audio5.src = 'media/takeoff_takeoff.mp3';
		audio6.src = 'media/takeoff_damn.mp3';
		break;
	case 'tscott':
		audio1.src = 'media/travis_scott_dope.mp3';
		audio2.src = 'media/travis_scott_its_lit.mp3';
		audio3.src = 'media/travis_scott_ohh.mp3';
		audio4.src = 'media/travis_scott_skrt.mp3';
		audio5.src = 'media/travis_scott_straight_up.mp3';
		audio6.src = 'media/travis_scott_straight_up_two.mp3';
		break;
	case 'youngthug':
		audio1.src = 'media/youngthug_phoo.mp3';
		audio2.src = 'media/youngthug_boss.mp3';
		audio3.src = 'media/youngthug_ish.mp3';
		audio4.src = 'media/youngthug_wha.mp3';
		audio5.src = 'media/youngthug_ew.mp3';
		audio6.src = 'media/youngthug_git.mp3';
		break;
	}
}

// preload first sound
audio1.load();