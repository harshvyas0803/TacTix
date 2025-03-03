import React, { useState, useEffect } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Easing,
} from 'react-native';

/** Helper function to check for a winner and return winning cells if any */
const checkWinner = (board) => {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningCells: combo };
    }
  }
  return board.includes(null)
    ? { winner: null, winningCells: [] }
    : { winner: 'Tie', winningCells: [] };
};

/** BoardCell component with animated pulse for winning cells */
function BoardCell({ index, value, isWinning, onPress }) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isWinning) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleValue.setValue(1);
    }
  }, [isWinning, scaleValue]);

  return (
    <TouchableOpacity style={styles.cell} onPress={() => onPress(index)}>
      <Animated.Text
        style={[
          styles.cellText,
          isWinning && styles.winningCellText,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        {value}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export default function GameScreen() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningCells, setWinningCells] = useState([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState({ X: 0, O: 0 });
  const [draws, setDraws] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  /** Handle cell press and update game state */
  const handlePress = (index) => {
    if (board[index] || winner) return; // ignore if cell is filled or game over

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const outcome = checkWinner(newBoard);
    setBoard(newBoard);

    if (outcome.winner) {
      setWinner(outcome.winner);
      setWinningCells(outcome.winningCells);
      setGamesPlayed((prev) => prev + 1);
      if (outcome.winner === 'Tie') {
        setDraws((prev) => prev + 1);
      } else {
        setWins((prev) => ({ ...prev, [outcome.winner]: prev[outcome.winner] + 1 }));
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  /** Reset board for a new round */
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
  };

  /** Reset all game statistics */
  const resetStats = () => {
    setGamesPlayed(0);
    setWins({ X: 0, O: 0 });
    setDraws(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
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
          <BoardCell
            key={index}
            index={index}
            value={cell}
            isWinning={winningCells.includes(index)}
            onPress={handlePress}
          />
        ))}
      </View>

      {/* Show Reset Game button when game ends */}
      {winner && (
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>New Round</Text>
        </TouchableOpacity>
      )}

      {/* Stats and Reset Stats Buttons */}
   
 
         
       
      </View>

    
     
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  status: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  board: {
    width: 320,
    height: 320,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFD700',
    marginBottom: 20,
  },
  cell: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: '#333',
  },
  cellText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  winningCellText: {
    color: '#00FF00', // change color for winning cells
  },
  button: {
    backgroundColor: '#FF4500',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  resetStatsBtn: {
    backgroundColor: '#008080',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#292929',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    width: 300,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
  },
  stat: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
  },
});
