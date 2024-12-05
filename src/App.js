import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const BOARD_SIZE = 15;
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const renderSquare = (i) => (
    <Square value={squares[i]} onSquareClick={() => handleClick(i)} />
  );

  const boardRows = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    const squaresForRow = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      squaresForRow.push(renderSquare(row * BOARD_SIZE + col));
    }
    boardRows.push(<div className="board-row">{squaresForRow}</div>);
  }
  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(15 * 15).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const BOARD_SIZE = 15;
  const WIN_COUNT = 5;

  // 检查是否有连续五个相同的棋子
  function checkLine(line) {
    for (let i = 0; i <= line.length - WIN_COUNT; i++) {
      const [a, b, c, d, e] = line.slice(i, i + WIN_COUNT);
      if (a && a === b && a === c && a === d && a === e) {
        return a;
      }
    }
    return null;
  }
  // 检查所有行
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowLine = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      rowLine.push(squares[row * BOARD_SIZE + col]);
    }
    const winner = checkLine(rowLine);
    if (winner) return winner;
  }

  // 检查所有列
  for (let col = 0; col < BOARD_SIZE; col++) {
    const colLine = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      colLine.push(squares[row * BOARD_SIZE + col]);
    }
    const winner = checkLine(colLine);
    if (winner) return winner;
  }
  // 检查所有主对角线
  for (let start = 0; start <= BOARD_SIZE - WIN_COUNT; start++) {
    const mainDiagonalLine = [];
    for (let i = 0; i < BOARD_SIZE - start; i++) {
      mainDiagonalLine.push(squares[i * BOARD_SIZE + (start + i)]);
    }
    const winner = checkLine(mainDiagonalLine);
    if (winner) return winner;
  }

  for (let start = 1; start <= BOARD_SIZE - WIN_COUNT; start++) {
    const mainDiagonalLine = [];
    for (let i = 0; i < BOARD_SIZE - start; i++) {
      mainDiagonalLine.push(squares[(start + i) * BOARD_SIZE + i]);
    }
    const winner = checkLine(mainDiagonalLine);
    if (winner) return winner;
  }

  // 检查所有副对角线
  for (let start = 0; start <= BOARD_SIZE - WIN_COUNT; start++) {
    const antiDiagonalLine = [];
    for (let i = 0; i < BOARD_SIZE - start; i++) {
      antiDiagonalLine.push(
        squares[(start + i) * BOARD_SIZE + (BOARD_SIZE - 1 - i)]
      );
    }
    const winner = checkLine(antiDiagonalLine);
    if (winner) return winner;
  }

  for (let start = 1; start <= BOARD_SIZE - WIN_COUNT; start++) {
    const antiDiagonalLine = [];
    for (let i = 0; i < BOARD_SIZE - start; i++) {
      antiDiagonalLine.push(
        squares[i * BOARD_SIZE + (BOARD_SIZE - 1 - (start + i))]
      );
    }
    const winner = checkLine(antiDiagonalLine);
    if (winner) return winner;
  }

  return null;
}
