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
      {winner && <Button title="Reset Game" onPress={resetGame} color="#ff6347" />}
      <Button title="View Stats" onPress={() => setStatsVisible(true)} />

      {/* Stats Modal */}
      <Modal visible={statsVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Player Stats</Text>
            <Text style={styles.stat}>Games Played: {gamesPlayed}</Text>
            <Text style={styles.stat}>X Wins: {wins.X}</Text>
            <Text style={styles.stat}>O Wins: {wins.O}</Text>
            <Text style={styles.stat}>Draws: {draws}</Text>
            <Button title="Close" onPress={() => setStatsVisible(false)} color="#ff6347" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 10 },
  status: { fontSize: 20, color: '#ffffff', marginBottom: 20 },
  board: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: '33.3%', height: '33.3%', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ffffff' },
  cellText: { fontSize: 36, color: '#ffffff' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#222', padding: 20, borderRadius: 10, alignItems: 'center' },
  stat: { fontSize: 18, color: '#ffffff', marginBottom: 10 },
});
