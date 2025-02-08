import React from "react";

export default function Game() {
    const [history, setHistory] = React.useState <{
        squares: (string | null)[],
        move: string
    }[]>([{squares: Array(9).fill(null), move: ""}])
    const [currentMove, setCurrentMove] = React.useState<number>(0);
    const [isDesc, setIsDesc] = React.useState<boolean>(false);
    const currentSquares = history[currentMove].squares;
    const currentMoveStr = history[currentMove].move;
    const xIsNext = currentMove % 2 === 0;

    function handlePlay(nextSquares: (string | null)[], move: string) {
        const nextHistory = [...history.slice(0, currentMove + 1),
            {squares: nextSquares, move: move}];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function handleEnd() {
        setHistory([{squares: Array(9).fill(null), move: ""}])
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
        if (move === currentMove && move > 0) {
            description = "You are at move #" + move + " === " + currentMoveStr;
            li = (<li key={move}>
                <p>{description}</p>
            </li>);
        } else if (move > 0) {
            description = 'Go to move #' + move + move + " === " + currentMoveStr;
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
    handlePlay: (nextSquares: (string | null)[], move: string) => void
    handleEnd: () => void
}) {

    function handleClick(i: number) {
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        // 计算行列坐标
        const row = Math.floor(i / 3);
        const col = i % 3;
        handlePlay(nextSquares, `(${row}, ${col})`);
    }

    const {winner, line} = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else if (squares.every(square => square !== null)) {
        status = 'It\'s a draw!';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    // 使用 map 渲染每一行
    return (
        <>
            <button className="clean" onClick={handleEnd}>clean</button>
            <div className="status">{status}</div>
            {Array.from({length: 3}).map((_, rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {Array.from({length: 3}).map((_, colIndex) =>
                        (<Square
                            key={rowIndex * 3 + colIndex}
                            value={squares[rowIndex * 3 + colIndex]}
                            onSquareClick={() => handleClick(rowIndex * 3 + colIndex)}
                            highlight={line.includes(rowIndex * 3 + colIndex)}
                        />)
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