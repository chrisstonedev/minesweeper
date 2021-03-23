document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left');
    const result = document.querySelector('#result');
    const restart = document.querySelector('.restart');
    let width = 10;
    let flags = 0;
    let bombAmount = 20;
    let squares: HTMLDivElement[] = [];
    let isGameOver = false;

    function createBoard() {
        flagsLeft!.innerHTML = bombAmount.toString();

        // Get shuffled game array with random bombs.
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i.toString());
            square.classList.add(shuffledArray[i]);
            grid!.appendChild(square);
            squares.push(square);

            square.addEventListener('click', function(e) {
                clickSquare(square);
            });

            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

      // Add numbers.
      for (let i = 0; i < squares.length; i++) {
        let total = 0;

        const isLeftEdge = i % width === 0;
        const isRightEdge = i % width === width -1;
        const isTopEdge = i < width;
        const isBottomEdge = i >= width * width - width;

        if (squares[i].classList.contains('valid')) {
            if (!isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
            if (!isLeftEdge && !isTopEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
            if (!isTopEdge && squares[i - width].classList.contains('bomb')) total++;
            if (!isTopEdge && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
            if (!isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
            if (!isRightEdge && !isBottomEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
            if (!isBottomEdge && squares[i + width].classList.contains('bomb')) total++;
            if (!isBottomEdge && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
            squares[i].setAttribute('data', total.toString());
        }
      }
    }

    createBoard();

    restart!.addEventListener('click', function(e) {
        restartBoard();
    });

    function addFlag(square: HTMLDivElement) {
        if (isGameOver) return;
        if (square.classList.contains('checked')) return;
        if (flags >= bombAmount && !square.classList.contains('flag')) return;

        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            square.innerHTML = '🚩';
            flags++;
            flagsLeft!.innerHTML = (bombAmount - flags).toString();
            checkForWin();
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags--;
            flagsLeft!.innerHTML = (bombAmount - flags).toString();
        }
    }

    function clickSquare(square: HTMLElement) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;

        if (square.classList.contains('bomb')) {
            gameOver(square);
            return;
        }
        const total = Number(square.getAttribute('data'));
        square.classList.add('checked');
        if (total > 0) {
            if (total === 1) square.classList.add('one');
            else if (total === 2) square.classList.add('two');
            else if (total === 3) square.classList.add('three');
            else if (total === 4) square.classList.add('four');
            square.innerHTML = total.toString();
        } else {
            checkSquare(square, +currentId);
        }
    }

    function checkSquare(square: HTMLElement, currentId: number) {
        const isLeftEdge = currentId % width === 0;
        const isRightEdge = currentId % width === width - 1;
        const isTopEdge = currentId < width;
        const isBottomEdge = currentId >= width * width - width;

        setTimeout(() => {
            if (!isLeftEdge) {
                const newId = squares[currentId - 1].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isLeftEdge && !isTopEdge) {
                const newId = squares[currentId - 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isTopEdge) {
                const newId = squares[currentId - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isTopEdge && !isRightEdge) {
                const newId = squares[currentId + 1 - width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isRightEdge) {
                const newId = squares[currentId + 1].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isRightEdge && !isBottomEdge) {
                const newId = squares[currentId + 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isBottomEdge) {
                const newId = squares[currentId + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
            if (!isBottomEdge && !isLeftEdge) {
                const newId = squares[currentId - 1 + width].id;
                const newSquare = document.getElementById(newId);
                if (newSquare !== null) clickSquare(newSquare);
            }
        }, 10);
    }

    function gameOver(square: HTMLElement) {
        result!.innerHTML = 'BOOM! Game Over!';
        isGameOver = true;

        // Show all the bombs.
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        });
    }

    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                result!.innerHTML = 'YOU WIN!';
                isGameOver = true;
                return;
            }
        }
    }

    function restartBoard() {
        result!.innerHTML = '';
        isGameOver = false;
        squares = [];
        flags = 0;

        while (grid!.firstChild) {
            grid!.removeChild(grid!.firstChild);
        }

        createBoard();
    }
});
