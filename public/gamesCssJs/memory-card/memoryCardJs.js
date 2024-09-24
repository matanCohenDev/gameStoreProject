document.addEventListener('DOMContentLoaded', function() {
    const cardGrid = document.getElementById('cardGrid');
    const scoreElement = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const gameOverModal = document.getElementById('gameOverModal');
    const completionMessage = document.getElementById('completionMessage');
    const completionTime = document.getElementById('completionTime');
    const newGameButton = document.getElementById('newGameButton');
    const cancelButton = document.getElementById('cancelButton');
    const pairSelectionModal = document.getElementById('pairSelectionModal');
    const startGameButton = document.getElementById('startGameButton');
    const numPairsSelect = document.getElementById('numPairsSelect');

    let score = 0;
    let firstCard, secondCard;
    let canFlip = true;
    let timeLeft = 300; 
    let timerInterval;
    let numPairs;
    let numCards;

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft > 0) {
            timeLeft--;
        } else {
            clearInterval(timerInterval);
            showGameOverModal();
        }
    }
    
    function showGameOverModal() {
        const elapsedTime = 300 - timeLeft;
        const elapsedMinutes = Math.floor(elapsedTime / 60);
        const elapsedSeconds = elapsedTime % 60;
        completionMessage.textContent = `Congratulations! Your score is ${score}.`;
        completionTime.textContent = `Time taken: ${elapsedMinutes.toString().padStart(2, '0')}:${elapsedSeconds.toString().padStart(2, '0')}.`;
        gameOverModal.style.display = 'block';
    }

    function resetGame() {
        score = 0;
        timeLeft = 300;
        timeDisplay.textContent = '05:00';
        scoreElement.textContent = 'Score: 0';
        cardGrid.innerHTML = '';
        startGame();
    }

    function startGame() {
        cardGrid.innerHTML = ''; 
        const cardImages = Array.from({ length: 54 }, (_, i) => `/public/gamesCssJs/memory-card/Cards/${i + 1}.png`);
        numCards = numPairs * 2;

        const selectedCards = [];
        while (selectedCards.length < numCards) {
            const randomIndex = Math.floor(Math.random() * cardImages.length);
            const cardImage = cardImages[randomIndex];
            if (!selectedCards.includes(cardImage)) {
                selectedCards.push(cardImage, cardImage);
            }
        }

        selectedCards.sort(() => Math.random() - 0.5);

        let rows, cols;
        switch (numPairs) {
            case 6:
                rows = 3;
                cols = 4;
                break;
            case 10:
                rows = 4;
                cols = 5;
                break;
            case 15:
                rows = 3;
                cols = 10;
                break;
            case 20:
                rows = 4;
                cols = 10;
                break;
            default:
                rows = 4;
                cols = 5;
        }

        cardGrid.style.gridTemplateRows = `repeat(${rows}, 130px)`;
        cardGrid.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

        selectedCards.forEach(cardImage => {
            const card = document.createElement('div');
            card.className = 'card';
            
            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            const img = document.createElement('img');
            img.src = cardImage;
            img.alt = 'Card Image';
            cardBack.appendChild(img);
            
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            cardGrid.appendChild(card);

            card.addEventListener('click', () => handleCardClick(card));
        });

        timerInterval = setInterval(updateTimer, 1000);
    }

    function handleCardClick(card) {
        if (!canFlip || card === firstCard || card.classList.contains('flipped')) return;

        card.classList.add('flipped');

        if (!firstCard) {
            firstCard = card;
        } 
        else {
            secondCard = card;
            canFlip = false;

            setTimeout(() => {
                if (firstCard.querySelector('.card-back img').src === secondCard.querySelector('.card-back img').src) {
                    score++;
                    scoreElement.textContent = `Score: ${score}`;
                    firstCard = null;
                    secondCard = null;
                } 
                else {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    firstCard = null;
                    secondCard = null;
                }
                canFlip = true;

                if (score === numPairs) {
                    clearInterval(timerInterval);
                    showGameOverModal();
                }
            }, 1000);
        }
    }

    startGameButton.addEventListener('click', () => {
        numPairs = parseInt(numPairsSelect.value, 10);
        pairSelectionModal.style.display = 'none';
        startGame();
    });

    newGameButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
        resetGame();
    });

    pairSelectionModal.style.display = 'flex';
});
