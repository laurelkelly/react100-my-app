import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {   
            value: null,
        };
    }

    // adds a constructor to the class to initialize the state.
    // stores the current value of the Square (changes when the Square is clicked)

    render() {
      return (
        <button 
            className="square" 
            onClick={() => this.props.onClick()}>
          {this.props.value}  
        </button>
      );
    }
        // {this.state.value} displays the value on the button using Square's own state (later changed to {this.props.value})
        // passes a function as the onClick prop 
        // the onClick prop tells React to set up a click event listener
  }
  */

  function Square(props) {
      return (
          <button className="square" onClick={props.onClick}>
              {props.value}
          </button>
      );
  }
  // function components are a simpler way to write components that only contain a render method and don’t have their own state.
  
  class Board extends React.Component { 
    /*  
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
        };
    }
    */
    // sets the Board's initial state to contain an array of 9 nulls corresponding to the 9 squares. 
    // sets the first move to be "X" by default.

    /*
    handleClick(i) {
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext,
        });
    }
    */
    // uses slice() to create a new copy of the squares array after every move, and treats it as immutable.
    // handleClick returns early by ignoring a click if someone has won or if a Square is already filled.
    // handleClick flips the value of xIsNext (a boolean) each time a player moves, then saves the game's state.
 
    renderSquare(i) {
      return (
        <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)} />
      );  
    }
    // passes down 2 props from Board to Square. The onClick prop is a function that Square can call when clicked.
    // passes the location of each Square into the onClick handler to indicate which Square was clicked.
  
    render() {
        /*
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        */
        // displays which player has the next turn & the winner
  
      return (
        <div>
          {/* <div className="status">{status}</div> */}
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }
    // sets up the initial state for the Game component within its constructor.

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    // moves handleClick method from Board to Game and modifies to align with new state structure; concatenates new history entries onto history.
    // updates stepNumber by adding stepNumber: history.length as part of the this.setState argument. This ensures we don’t get stuck showing the same move after a new one has been made.
    // this.state.history.slice(0, this.state.stepNumber + 1) ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
    // updates the stepNumber in Game component's state. Sets xIsNext to true if the number that we’re changing stepNumber to is even.

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares); 

      const moves = history.map((step, move) => {
          const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
      });
      // [this.state.stepNumber] renders the currently selected move according to stepNumber.
      // maps our history of moves to React elements representing buttons on the screen, and displays a list of buttons to “jump” to past moves.
      // uses the move index as a unique key prop to differentiate each rendered list item, so React can determine what has changed between updates.
      // Keys tell React about the identity of each component which allows React to maintain state between re-renders.

      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      // uses the most recent history entry to determine and display the game's status.
      
      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );