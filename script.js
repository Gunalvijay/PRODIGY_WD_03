const squares = document.querySelectorAll('.square');
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function checkWinner(board) {
    for (const combo of winCombinations) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }

    if (!board.includes('')) {
        return 'draw'; // Return 'draw' if the board is full
    }

    return null; // Return null if no winner yet
}

function minimax(board, depth, isMaximizing) {
    const result = checkWinner(board);
    if (result !== null) {
        if (result === 'X') return -10 + depth; // Minimize the score if 'X' wins
        if (result === 'O') return 10 - depth;  // Maximize the score if 'O' wins
        if (result === 'draw') return 0;        // Neutral score for a draw
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function makeMove(index) {
    if (!gameBoard[index] && !gameOver) {
        gameBoard[index] = currentPlayer;
        squares[index].textContent = currentPlayer;
        checkGameOver();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkGameOver() {
    const winner = checkWinner(gameBoard);
    if (winner) {
        gameOver = true;
        message.innerText = winner === 'draw' ? "It's a draw!" : `${winner} wins! 🎊`;
    }
}

squares.forEach((square, i) => {
    square.addEventListener('click', () => {
        if (!gameOver && currentPlayer === 'X') {
            makeMove(i);

            // Computer's turn
            if (!gameOver && currentPlayer === 'O') {
                const move = bestMove();
                if (move !== undefined) makeMove(move);
            }
        }
    });
});

resetButton.addEventListener('click', () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    currentPlayer = 'X';
    message.innerText = '';
    squares.forEach(square => square.textContent = '');
});
