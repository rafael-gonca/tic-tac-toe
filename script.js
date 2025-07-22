const gameboard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(' ');
        };
    };

    const getBoard = () => board;

    const updateBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = ' ';
            };
        };
    };
    

    return { getBoard, updateBoard };
})();



const game = (function () {

    let gameOver = false;

    function Player(name, mark) {
        this.name = name;
        this.mark = mark;
        this.score = 0;
        this.win = () => {
            this.score++;
        };
    };

    const player1 = new Player('Player', 'o')
    const player2 = new Player('Computer', 'x')

    const players = [
        player1,
        player2      
    ]

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const addMark = (row, column) => {
        if (gameOver) return;

        const board = gameboard.getBoard()

        if (board[row-1][column-1] !== ' ') return;

        board[row-1][column-1] = activePlayer.mark

        if (verifyWin()) return;

        switchPlayerTurn();

        if (activePlayer === players[1] && !gameOver) {
            setTimeout(() => {
                computerMove()
            }, 400);
        }
    };

    const verifyWin = () => {

        const winningCombos = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]], 
            [[0, 2], [1, 1], [2, 0]]
        ];

        for (let i = 0; i < 8; i++) {
            let check = 0
            for (let j = 0; j < 3; j++) {
                if (gameboard.getBoard()[winningCombos[i][j][0]][winningCombos[i][j][1]] === activePlayer.mark) {
                    check++
                };
            };
            if (check === 3) {
                gameOver = true;
                activePlayer.win()
                const playerScore = document.querySelector('.playerScore')
                const computerScore = document.querySelector('.computerScore')

                if (activePlayer === players[0]) {
                    playerScore.textContent = Number(playerScore.textContent) + 1
                } else {
                    computerScore.textContent = Number(computerScore.textContent) + 1
                }

                const showWin = document.querySelector('.win')
                showWin.classList.remove('display-none')

                showWin.textContent = `${activePlayer.name} won`

                activePlayer = players[0]
                setTimeout(() => {
                    resetGame()
                }, 600)
                return true
            }
            
        };

        const checkForTie = (function () {   
            let isTie = true
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameboard.getBoard()[i][j] === ' ') {
                        isTie = false;
                        break;
                    }
                };
            };

            if (isTie) {
                gameOver = true;

                const showWin = document.querySelector('.win')
                showWin.classList.remove('display-none')

                showWin.textContent = `It's a tie`

                setTimeout(() => {
                    resetGame()
                }, 600)

                return true
            }

            return false
        })()
    }

    const resetGame = () => {
        setTimeout(() => {
            gameboard.updateBoard()
            altDOM.restart();
            gameOver = false;
            activePlayer = players[0]
        }, 10);
    }



    const computerMove = () => {

        const board = gameboard.getBoard()

        num1 = Math.floor(Math.random() * 3) 
        num2 = Math.floor(Math.random() * 3) 

        while (board[num1][num2] !== ' ') {
            num1 = Math.floor(Math.random() * 3) 
            num2 = Math.floor(Math.random() * 3) 
        }

        addMark(num1+1, num2+1)

        const computer = game.players[1]

        const div = document.querySelector(`[id='${num1+1}'][data-index='${num2+1}']`)
        div.textContent = computer.mark
       
    }

    const addMarkToDOM = () => {
        const squares = document.querySelectorAll('.square')
        squares.forEach((square) => {
            square.addEventListener('click', () => {
                if (activePlayer !== players[0]) {
                    return
                }
                const closest = square.closest('.square')
                if (gameboard.getBoard()[Number(closest.id)-1][Number(closest.dataset.index)-1] === ' ') {
                    closest.textContent = activePlayer.mark
                }
                addMark(closest.id, closest.dataset.index)
            })
        })



    }

    return { addMarkToDOM, players }

})();

const altDOM = (function() {

    const scores = document.querySelector('.scores')
    scores.classList.add('display-none')

    const showWin = document.querySelector('.win')
    showWin.classList.add('display-none')

    function restart() {
        const squares = document.querySelectorAll('.square')
        squares.forEach((square) => {
            square.remove()
        })

        for (let i = 1; i < 4; i++) {
            for (let j = 1; j < 4; j++) {
                const squaresBoard = document.querySelector('.squares')
                const div = document.createElement('div')
                div.classList.add(`square`)
                div.id = (`${i.toString()}`)
                div.dataset.index = (`${j.toString()}`)
                squaresBoard.appendChild(div)
            }
        }

        game.addMarkToDOM()

        gameboard.updateBoard()
    }

    const startBtnF = () => {
        const playerName = document.querySelector('#name');
        const playerOne = document.querySelector('.player1');
        const startBtn = document.querySelector('#start');
        const startBtnClick = startBtn.addEventListener('click', () => {
            restart()
            scores.classList.remove('display-none')
            playerOne.textContent = `${playerName.value}: `;
            game.players[0].name = playerName.value

            const span = document.createElement('span')
            span.classList.add('playerScore')
            span.textContent = 0
            playerOne.appendChild(span)

            const player = document.querySelector('.player')
            player.remove()


            const restartBtn = document.createElement('button')
            restartBtn.classList.add('restart')
            restartBtn.textContent = 'Restart'
            const main = document.querySelector('.main')
            main.appendChild(restartBtn)


            const restartBtnClick = restartBtn.addEventListener('click', () => {
                restart()
                scores.classList.add('display-none')
                showWin.classList.add('display-none')
                for (let i = 0; i < 2; i++) {
                game.players[i].score = 0
                }
                document.querySelector('.playerScore').textContent = 0
                document.querySelector('.computerScore').textContent = 0

                restartBtn.remove()

                const player = document.createElement('div')
                player.classList.add('player')
                const div = document.createElement('div')
                const label = document.createElement('label')
                label.for = 'name'
                label.textContent = `Player's name:`
                const input = document.createElement('input')
                input.type = 'text'
                input.name = 'name'
                input.id = 'name'
                input.value = 'Player'
                const button = document.createElement('button')
                button.id = 'start'
                button.textContent = 'Start'

                main.prepend(player)
                player.appendChild(div)
                div.appendChild(label)
                div.appendChild(input)
                player.appendChild(button)

                startBtnF()
                
                const squares = document.querySelectorAll('.square')
                squares.forEach((square) => {
                    square.remove()
                })

                for (let i = 1; i < 4; i++) {
                    for (let j = 1; j < 4; j++) {
                        const squaresBoard = document.querySelector('.squares')
                        const div = document.createElement('div')
                        div.classList.add(`square`)
                        div.id = (`${i.toString()}`)
                        div.dataset.index = (`${j.toString()}`)
                        squaresBoard.appendChild(div)
                    }
                }

                gameboard.updateBoard()
                
            })
        })
    }

    startBtnF()

    return { restart }
})()