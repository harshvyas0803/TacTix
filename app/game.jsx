import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GameScreen() {
  // State for the game board (9 cells), the current player, and the game outcome.
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);

  // Function to check for a winner or tie.
  const checkWinner = (board) => {
    const winningCombos = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal top-left to bottom-right
      [2, 4, 6], // Diagonal top-right to bottom-left
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Returns "X" or "O" as the winner.
      }
    }
    // If there are no empty cells, it's a tie.
    return board.includes(null) ? null : 'Tie';
  };

  // Called when a cell is pressed.
  const handlePress = (index) => {
    // Prevent moves if the cell is already filled or if the game is over.
    if (board[index] || winner) return;

    // Create a new board, update the pressed cell, and check for a winner.
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const gameOutcome = checkWinner(newBoard);
    setBoard(newBoard);

    if (gameOutcome) {
      setWinner(gameOutcome);
    } else {
      // Switch turns if no winner yet.
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  // Resets the game to its initial state.
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Tic-Tac-Toe</Text>

      {/* Display current turn or winner/tie message */}
      <Text style={styles.status}>
        {winner
          ? winner === 'Tie'
            ? "It's a Tie!"
            : `Winner: ${winner}`
          : `Next Turn: ${currentPlayer}`}
      </Text>

      {/* Game Board */}
      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cell}
            onPress={() => handlePress(index)}
          >
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Show Reset Button if the game is over */}
      {winner && (
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  status: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 20,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '33.3%',
    height: '33.3%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cellText: {
    fontSize: 36,
    color: '#ffffff',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});
