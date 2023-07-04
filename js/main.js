if (!localStorage.getItem('deckID')) {
  localStorage.setItem('deckID', '');
};

let deckID;
const score1TextEl = document.querySelector('#score1');
const score2TextEl = document.querySelector('#score2');
let score1 = 0;
let score2 = 0;
let war = false;

document.querySelector('#draw').addEventListener('click', drawCards);
document.querySelector('#newDeck').addEventListener('click', newDeck);

newDeck();

function newDeck() {
  clear();
  score1 = 0;
  score2 = 0;
  score1TextEl.textContent = score1;
  score2TextEl.textContent = score2;
  document.querySelector('#msg').innerText = '';
  document.querySelector('#cardsRemain').innerText = '52';
  document.querySelector('#draw').style.display = '';

  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json())
      .then(data => {
        deckID = data.deck_id;
        localStorage.setItem('deckID', deckID);
      })
      .catch(err => {
          console.log(`error ${err}`);
      });
};

function drawCards() {
  let count = '';
  if (war) {
    count = '6';
  } else {
    count = '2';
    document.querySelector('#msg').innerText = '';
  };
  const url = `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=${count}`;
  

  fetch(url)
    .then(res => res.json())
    .then(data => {
      clear();

      data.cards.forEach((el, i) => {
        if (Number.isInteger(i / 2)) {
          const card1 = document.createElement('img');
          card1.src = el.image;
          document.querySelector('#player1').appendChild(card1);
        } else {
          const card2 = document.createElement('img');
          card2.src = el.image;
          document.querySelector('#player2').appendChild(card2);
        }
      })
      document.querySelector('#cardsRemain').innerText = data.remaining;

      eval(data.cards);

      if (data.remaining == 0) {
        if (score1 > score2) {
          document.querySelector('#msg').textContent = 'You won the game!';
        } else if (score1 < score2) {
          document.querySelector('#msg').textContent = 'You lost';
        } else {
          document.querySelector('#msg').textContent = 'It\'s a Draw!';
        }
        document.querySelector('#draw').style.display = 'none';
      }
    })
    .catch(err => {
      console.log(`error ${err}`);
    });
};

function clear() {
  while (document.querySelector('#player1').firstChild) {
    document.querySelector('#player1').removeChild(document.querySelector('#player1').firstChild);
  }
  while (document.querySelector('#player2').firstChild) {
    document.querySelector('#player2').removeChild(document.querySelector('#player2').firstChild);
  }
};

function eval(card) {
  let player1Val = convertToNum(card[card.length - 2].value);
  let player2Val = convertToNum(card[card.length - 1].value);
    if (player1Val > player2Val) {
      if (war) {
        score1 += 3;
      } else {
        score1++;
      }
      score1TextEl.textContent = score1;
      war = false;
    } else if (player1Val < player2Val) {
      if (war) {
        score2 += 3;
      } else {
        score2++;
      }
      score2TextEl.textContent = score2;
      war = false;
    } else {
      war = true;
      document.querySelector('#msg').innerText = 'It\'s a War!';
    }
};

function convertToNum(val) {
  switch(val) {
    case 'ACE':
      return 14;
      break;
    case 'KING':
      return 13;
      break;
    case 'QUEEN':
      return 12;
      break;
    case 'JACK':
      return 11;
      break;
    default:
      return Number(val);
  }
};