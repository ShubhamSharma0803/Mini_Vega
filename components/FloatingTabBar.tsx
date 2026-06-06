import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

export default function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabs = [
    { name: 'home', icon: '🏠', label: 'Home' },
    { name: 'finance', icon: '💰', label: 'Finance' },
    { name: 'voice', icon: '🎙️', label: 'Vega' },
    { name: 'habits', icon: '✅', label: 'Habits' },
    { name: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab, index) => {
          const isVoice = tab.name === 'voice';
          const isFocused = state.index === index && !isVoice;

          if (isVoice) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.voiceButton}
                onPress={() => {}}
              >
                <Text style={styles.voiceIcon}>{tab.icon}</Text>
              </TouchableOpacity>
            );
          }

          const route = state.routes.find(r => r.name === tab.name);

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => {
                if (route) navigation.navigate(route.name);
              }}
            >
              <Text style={styles.icon}>{tab.icon}</Text>
              <Text style={[styles.label, isFocused && styles.activeLabel]}>
                {tab.label}
              </Text>
              {isFocused && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    width: width,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 30,
    width: width - 40,
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  activeLabel: {
    color: '#6C63FF',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6C63FF',
    marginTop: 2,
  },
  voiceButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 16,
  },
  voiceIcon: {
    fontSize: 24,
  },
});