document.addEventListener('DOMContentLoaded', function() {
    const dropDown = document.querySelector('.custom-dropdown');
    const selectedOption = document.querySelector('.selected-option');
    const optionsContainer = document.querySelector('.dropdown-options');
    const optionsList = document.querySelectorAll('.option');
    const startButton = document.querySelector('.btn');
    const sodukoGrid = document.querySelector('.sudokuGrid');
    const checkButton = document.querySelector('#checkBtn');
    const resetButton = document.querySelector('#resetBtn');
    const time = document.querySelector('#time');
    const titleAndTime = document.querySelector('.timeAndTitle');
    const score = document.querySelector('#score');
    let rows, columns, cellSize, maxNumber, boxSize , timeLeft, timerInterval, theRealTime;
    let difficulty = '';
    let countScore = 100;

    selectedOption.addEventListener('click', () => {
        optionsContainer.classList.toggle('show');
        console,log(":");
    });

    optionsList.forEach(option => {
        option.addEventListener('click', () => {
            selectedOption.textContent = option.textContent;
            selectedOption.setAttribute('data-value', option.getAttribute('data-value'));
            difficulty = selectedOption.getAttribute('data-value');
            optionsContainer.classList.remove('show');
        });
    });

    document.addEventListener('click', (e) => {
        if (!selectedOption.contains(e.target) && !optionsContainer.contains(e.target)) {
            optionsContainer.classList.remove('show');
        }
    });

    startButton.addEventListener('click', () => {
        if (['Easy', 'Medium', 'Hard'].includes(selectedOption.textContent)) {
            dropDown.style.display = 'none';
            checkButton.style.display = 'block';
            resetButton.style.display = 'block';
            time.style.opacity = '1';
            titleAndTime.style.display = 'flex';
            titleAndTime.style.justifyContent = 'space-between';
            titleAndTime.style.alignItems = 'center';
            titleAndTime.style.gap = '200px';
            time.style.fontSize = '20px';
            score.style.display = 'block';
        }
        sodukoGrid.innerHTML = '';
        
        switch (difficulty) {
            case 'Easy':
                rows = 4;
                columns = 4;
                maxNumber = 4;
                cellSize = '120px';
                boxSize = 2;
                timeLeft = 120;
                theRealTime = 120;
                break;
            case 'Medium': 
                rows = 6;
                columns = 6;
                maxNumber = 9;
                cellSize = '80px';
                boxSize = 3;
                timeLeft = 300;
                theRealTime = 300;
                break;
            case 'Hard':
                rows = 9;
                columns = 9;
                maxNumber = 9;
                cellSize = '50px';
                boxSize = 3;
                timeLeft = 600;
                theRealTime = 600;
                break;
            default:
                rows = 0;
                columns = 0;
                break;
        }


        timerInterval = setInterval(updateTimer, 1000);

        sodukoGrid.style.gridTemplateRows = `repeat(${rows}, ${cellSize})`;
        sodukoGrid.style.gridTemplateColumns = `repeat(${columns}, ${cellSize})`;

        for (let i = 0; i < rows * columns; i++) {
            const cell = document.createElement('div');
            cell.style.border = '0.5px solid #8e2de2'; 
            cell.style.backgroundColor = '#2a2a2a'; 
            cell.style.color = 'white';
            cell.style.display = 'flex';
            cell.id = 'cell';
            cell.style.justifyContent = 'center';
            cell.style.alignItems = 'center';
            cell.style.fontSize = difficulty === 'Easy' ? '30px' :
                                   difficulty === 'Medium' ? '20px' : '15px';
            cell.style.width = cell.style.height = cellSize; 
            cell.style.boxSizing = 'border-box'; 
            
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.style.width = '100%';
            input.style.height = '100%';
            input.id = 'numInput';
            input.style.textAlign = 'center';
            input.style.border = 'none';
            input.style.outline = 'none';
            input.style.color = 'white';
            input.style.backgroundColor = 'transparent';
            input.style.fontSize = cell.style.fontSize; 
            
            cell.appendChild(input);
            sodukoGrid.appendChild(cell);
        }

        let grid = Array.from({ length: rows }, () => Array(columns).fill(0));

        function isValid(num, row, col) {
            for (let i = 0; i < columns; i++) {
                if (grid[row][i] === num) return false;
            }
            for (let i = 0; i < rows; i++) {
                if (grid[i][col] === num) return false;
            }
    
            const boxRowStart = Math.floor(row / boxSize) * boxSize;
            const boxColStart = Math.floor(col / boxSize) * boxSize;
            for (let i = boxRowStart; i < boxRowStart + boxSize; i++) {
                for (let j = boxColStart; j < boxColStart + boxSize; j++) {
                    if (grid[i][j] === num) return false;
                }
            }
            return true;
        }
    
        function fillGrid() {
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < columns; col++) {
                    if (grid[row][col] === 0) {
                        const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
                        for (const num of numbers) {
                            if (isValid(num, row, col)) {
                                grid[row][col] = num;
                                if (fillGrid()) return true;
                                grid[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        fillGrid();

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                sodukoGrid.children[row * columns + col].className = grid[row][col];
            }
        }

        if (difficulty === 'Easy') {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (i % 2 === 0 && i !== 0) {
                        sodukoGrid.children[i * columns + j].style.borderTop = '0.1px solid red';
                        sodukoGrid.children[i * columns + j - 4].style.borderBottom = '0.1px solid red';
                    }
                    if (j % 2 === 0 && j !== 0) {
                        sodukoGrid.children[i * columns + j].style.borderLeft = '0.1px solid red';
                        sodukoGrid.children[i * columns + j - 1].style.borderRight = '0.1px solid red';
                    }
                }
            }
        } 
        else {
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (i % boxSize === 0 && i !== 0) {
                        sodukoGrid.children[i * columns + j].style.borderTop = '0.1px solid red';
                        if (difficulty === 'Medium') {
                            sodukoGrid.children[i * columns + j - 6].style.borderBottom = '0.1px solid red';
                        }
                        if (difficulty === 'Hard') {
                            sodukoGrid.children[i * columns + j - 9].style.borderBottom = '0.1px solid red';
                        }
                    }
                    if (j % boxSize === 0 && j !== 0) {
                        sodukoGrid.children[i * columns + j].style.borderLeft = '0.1px solid red';
                        sodukoGrid.children[i * columns + j - 1].style.borderRight = '0.1px solid red';
                    }
                }
            }
        }
        
        if(difficulty === 'Easy') {
            const firstBox = [0,1,4,5];
            const secondBox = [2,3,6,7];
            const thirdBox = [8,9,12,13];
            const fourthBox = [10,11,14,15];
            putTheNumbersInBoardEasyAndMedium(firstBox, secondBox, thirdBox, fourthBox);
            putTheNumbersInBoardEasyAndMedium(firstBox, secondBox, thirdBox, fourthBox);

        }
        if(difficulty === 'Medium') {
            const firstBox = [0,1,2,6,7,8,12,13,14];
            const secondBox = [3,4,5,9,10,11,15,16,17];
            const thirdBox = [18,19,20,24,25,26,30,31,32];
            const fourthBox = [21,22,23,27,28,29,33,34,35];
            putTheNumbersInBoardEasyAndMedium(firstBox, secondBox, thirdBox, fourthBox);
            putTheNumbersInBoardEasyAndMedium(firstBox, secondBox, thirdBox, fourthBox);
            putTheNumbersInBoardEasyAndMedium(firstBox, secondBox, thirdBox, fourthBox);

        }
        if(difficulty === 'Hard') {
            const firstBox = [0,1,2,9,10,11,18,19,20];
            const secondBox = [3,4,5,12,13,14,21,22,23];
            const thirdBox = [6,7,8,15,16,17,24,25,26];
            const fourthBox = [27,28,29,36,37,38,45,46,47];
            const fifthBox = [30,31,32,39,40,41,48,49,50];
            const sixthBox = [33,34,35,42,43,44,51,52,53];
            const seventhBox = [54,55,56,63,64,65,72,73,74];
            const eighthBox = [57,58,59,66,67,68,75,76,77];
            const ninthBox = [60,61,62,69,70,71,78,79,80];
            putTheNumbersInBoardHard(firstBox, secondBox, thirdBox, fourthBox, fifthBox, sixthBox, seventhBox, eighthBox, ninthBox);
            putTheNumbersInBoardHard(firstBox, secondBox, thirdBox, fourthBox, fifthBox, sixthBox, seventhBox, eighthBox, ninthBox);
            putTheNumbersInBoardHard(firstBox, secondBox, thirdBox, fourthBox, fifthBox, sixthBox, seventhBox, eighthBox, ninthBox);
            putTheNumbersInBoardHard(firstBox, secondBox, thirdBox, fourthBox, fifthBox, sixthBox, seventhBox, eighthBox, ninthBox);
            putTheNumbersInBoardHard(firstBox, secondBox, thirdBox, fourthBox, fifthBox, sixthBox, seventhBox, eighthBox, ninthBox);

        }

    });

    checkButton.addEventListener('click', () => {
        if(IsGAmeFinished()){
            CheckIfSudokoIsCorrect();
            score.textContent = `Score: ${countScore}`;
        }
    });

    resetButton.addEventListener('click', () => {
        ResetGame(theRealTime);
    });

    function ResetGame(minuets){
        const inputs = document.querySelectorAll('#numInput');
        inputs.forEach(input => {
            input.value = '';
        });
        clearInterval(timerInterval);
        timeLeft = minuets;
        timerInterval = setInterval(updateTimer, 1000);
        score.textContent = `Score:`;
        countScore = 100;
    }


    function CheckIfSudokoIsCorrect(){
        const cells = document.querySelectorAll('#cell')
            const inputs = document.querySelectorAll('#numInput');
            let isFinished = true;
            cells.forEach(cell => {
                console.log(cell.children);
                if(cell.children[0] && cell.className !== cell.children[0].value) {
                    switch(difficulty) {
                        case 'Easy':
                            countScore -= 5;
                            break;
                        case 'Medium':
                            countScore -= 3;
                            break;
                        case 'Hard':
                            countScore -= 1;
                            break;
                    }
                    isFinished = false;
                }
    
            });
            if(isFinished) {
                alert('Congratulations! You have successfully completed the game.');
            }
            else{
                alert('you insert the wrong numbers! Please try again.');
            }
    }
    
    
    function IsGAmeFinished(){
        const inputs = document.querySelectorAll('#numInput');
        let flag = false;
        inputs.forEach(input => {
            if(!input.value) {
                flag = true;
                return;
            }
        });
        if(!flag) {
            return true;
        }
    }

    function getRandomElement(arr) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    function putTheNumbersInBoardEasyAndMedium(firstBox, secondBox, thirdBox, fourthBox) {
        let num1 = getRandomElement(firstBox);
        let num2 = getRandomElement(secondBox);
        let num3 = getRandomElement(thirdBox);
        let num4 = getRandomElement(fourthBox);
        sodukoGrid.children[num1].textContent = sodukoGrid.children[num1].className;
        sodukoGrid.children[num1].style.color = "red";
        sodukoGrid.children[num2].textContent = sodukoGrid.children[num2].className;
        sodukoGrid.children[num2].style.color = "red";
        sodukoGrid.children[num3].textContent = sodukoGrid.children[num3].className;
        sodukoGrid.children[num3].style.color = "red";
        sodukoGrid.children[num4].textContent = sodukoGrid.children[num4].className;
        sodukoGrid.children[num4].style.color = "red";
    }

    function putTheNumbersInBoardHard(firstBox, secondBox, thirdBox, fourthBox, fifthBox, sixthBox, seventhBox, eighthBox, ninthBox) {
        let num1 = getRandomElement(firstBox);
        let num2 = getRandomElement(secondBox);
        let num3 = getRandomElement(thirdBox);
        let num4 = getRandomElement(fourthBox);
        let num5 = getRandomElement(fifthBox);
        let num6 = getRandomElement(sixthBox);
        let num7 = getRandomElement(seventhBox);
        let num8 = getRandomElement(eighthBox);
        let num9 = getRandomElement(ninthBox);
        sodukoGrid.children[num1].textContent = sodukoGrid.children[num1].className;
        sodukoGrid.children[num1].style.color = "red";
        sodukoGrid.children[num2].textContent = sodukoGrid.children[num2].className;
        sodukoGrid.children[num2].style.color = "red";
        sodukoGrid.children[num3].textContent = sodukoGrid.children[num3].className;
        sodukoGrid.children[num3].style.color = "red";
        sodukoGrid.children[num4].textContent = sodukoGrid.children[num4].className;
        sodukoGrid.children[num4].style.color = "red";
        sodukoGrid.children[num5].textContent = sodukoGrid.children[num5].className;
        sodukoGrid.children[num5].style.color = "red";
        sodukoGrid.children[num6].textContent = sodukoGrid.children[num6].className;
        sodukoGrid.children[num6].style.color = "red";
        sodukoGrid.children[num7].textContent = sodukoGrid.children[num7].className;
        sodukoGrid.children[num7].style.color = "red";
        sodukoGrid.children[num8].textContent = sodukoGrid.children[num8].className;
        sodukoGrid.children[num8].style.color = "red";
        sodukoGrid.children[num9].textContent = sodukoGrid.children[num9].className;
        sodukoGrid.children[num9].style.color = "red";
    }

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        time.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
           if (timeLeft > 0) {
                timeLeft--;
           } 
            else {
                clearInterval(timerInterval);
           }
    }

});


