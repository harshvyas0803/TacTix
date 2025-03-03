import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';

export default function GameScreen() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [wins, setWins] = useState({ X: 0, O: 0 });
  const [draws, setDraws] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);

  const checkWinner = (board) => {
    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(null) ? null : 'Tie';
  };

  const handlePress = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    const gameOutcome = checkWinner(newBoard);
    setBoard(newBoard);

    if (gameOutcome) {
      setWinner(gameOutcome);
      setGamesPlayed(gamesPlayed + 1);
      if (gameOutcome === 'Tie') {
        setDraws(draws + 1);
      } else {
        setWins({ ...wins, [gameOutcome]: wins[gameOutcome] + 1 });
      }
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.status}>
        {winner ? (winner === 'Tie' ? "It's a Tie!" : `Winner: ${winner}`) : `Next Turn: ${currentPlayer}`}
      </Text>
      <View style={styles.board}>
        {board.map((cell, index) => (
          <TouchableOpacity key={index} style={styles.cell} onPress={() => handlePress(index)}>
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {winner && <TouchableOpacity style={styles.button} onPress={resetGame}><Text style={styles.buttonText}>Reset Game</Text></TouchableOpacity>}
      <TouchableOpacity style={styles.button} onPress={() => setStatsVisible(true)}><Text style={styles.buttonText}>View Stats</Text></TouchableOpacity>

      {/* Stats Modal */}
      <Modal visible={statsVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Player Stats</Text>
            <Text style={styles.stat}>Games Played: {gamesPlayed}</Text>
            <Text style={styles.stat}>X Wins: {wins.X}</Text>
            <Text style={styles.stat}>O Wins: {wins.O}</Text>
            <Text style={styles.stat}>Draws: {draws}</Text>
            <TouchableOpacity style={styles.button} onPress={() => setStatsVisible(false)}><Text style={styles.buttonText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FFD700', marginBottom: 20 },
  status: { fontSize: 20, color: '#FFFFFF', marginBottom: 20, paddingHorizontal: 10, textAlign: 'center' },
  board: { width: 320, height: 320, flexDirection: 'row', flexWrap: 'wrap', borderRadius: 10, overflow: 'hidden' },
  cell: { width: '33.3%', height: '33.3%', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFD700', backgroundColor: '#333' },
  cellText: { fontSize: 36, fontWeight: 'bold', color: '#FFD700' },
  button: { backgroundColor: '#FF4500', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, marginTop: 15, alignItems: 'center', width: 200 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#292929', padding: 25, borderRadius: 15, alignItems: 'center', width: 300 },
  stat: { fontSize: 20, color: '#FFFFFF', marginBottom: 10 },
});
 