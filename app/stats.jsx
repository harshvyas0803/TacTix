import { View, Text, StyleSheet } from 'react-native';

export default function StatsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Stats</Text>
      <Text style={styles.stat}>Games Played: 10</Text>
      <Text style={styles.stat}>Wins: 5</Text>
      <Text style={styles.stat}>Losses: 4</Text>
      <Text style={styles.stat}>Draws: 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  stat: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 10,
  },
});
