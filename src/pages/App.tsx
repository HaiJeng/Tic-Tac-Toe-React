import React from "react";

export default function Game() {
    const [history, setHistory] = React.useState<((string | null)[])[]>([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = React.useState<number>(0);
    const [isDesc, setIsDesc] = React.useState<boolean>(false);
    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;

    function handlePlay(nextSquares: (string | null)[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function handleEnd() {
        setHistory([Array(9).fill(null)])
        setCurrentMove(0);
        setIsDesc(false);
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    function sortMove() {
        setIsDesc(!isDesc);
    }

    const moves = history.map((squares, move) => {
        let description;
        let li;
        if (move === currentMove) {
            description = "You are at move #" + move;
            li = (<li key={move}>
                <p>{description}</p>
            </li>);
        } else if (move > 0) {
            description = 'Go to move #' + move;
            li = (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            );
        } else {
            description = 'Go to game start';
            li = (
                <li key={move}>
                    <button onClick={() => jumpTo(move)}>{description}</button>
                </li>
            );
        }
        return li;
    });
    if (isDesc) {
        moves.reverse();
    }


    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} handlePlay={handlePlay} handleEnd={handleEnd}/>
            </div>
            <div className="game-info">
                <button className="setSortType" onClick={sortMove}>sort</button>
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function Board({xIsNext, squares, handlePlay, handleEnd}: {
    xIsNext: boolean,
    squares: (string | null)[],
    handlePlay: (nextSquares: (string | null)[]) => void
    handleEnd: () => void
}) {

    function handleClick(i: number) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        handlePlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner.winner;
    } else if (squares.every(square => square !== null)) {
        status = 'It\'s a draw!';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
    const renderSquare = (i: number) => {
        return (
            <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
                highlight={winner.line.includes(i)} // 判断该方块是否在获胜方块中
            />
        );
    };

    // 使用 map 渲染每一行
    return (
        <>
            <button className="clean" onClick={handleEnd}>clean</button>
            <div className="status">{status}</div>
            {Array.from({length: 3}).map((_, rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {Array.from({length: 3}).map((_, colIndex) =>
                        renderSquare(rowIndex * 3 + colIndex)
                    )}
                </div>
            ))}
        </>
    );
}

function Square({value, onSquareClick, highlight}: {
    value: string | null,
    onSquareClick: () => void,
    highlight: boolean
}) {
    return (<button
        className={`square ${highlight ? 'highlight' : ''}`}
        onClick={onSquareClick}
    >
        {value}
    </button>);
}

function calculateWinner(squares: (string | null)[]): { winner: string | null, line: (number)[] } {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], line: [a, b, c]};
        }
    }
    return {winner: null, line: []};
}