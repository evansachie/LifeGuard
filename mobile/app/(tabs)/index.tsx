import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

interface MenuItemProps {
  title: string;
  icon: any;
  onPress?: () => void;
}

const MenuItem = ({ title, icon, onPress }: MenuItemProps) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <Text style={styles.menuTitle}>{title}</Text>
    <Image source={icon} style={styles.menuIcon} resizeMode="contain" />
  </Pressable>
);

export default function HomeScreen() {
  const router = useRouter();
  const userName = "Evans"; // This would come from your auth state

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>👋 Hi {userName}!</Text>
        </View>
        <Pressable onPress={() => {}}>
          <Image 
            source={require('@/assets/user.svg')}
            style={styles.profileIcon}
          />
        </Pressable>
      </View>

      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        <MenuItem 
          title="Health Report"
          icon={require('../../assets/health-report.svg')}
          onPress={() => router.push("/(screens)/health-report")}
        />
        <MenuItem 
          title="Online Chat"
          icon={require('../../assets/online-chat.svg')}
          onPress={() => router.push("/(screens)/chat")}
        />
        <MenuItem 
          title="Healthcare Providers"
          icon={require('../../assets/finding-doctors.svg')}
          onPress={() => router.push("/(screens)/healthcare-providers")}
        />
        <MenuItem 
          title="Pollution Tracker"
          icon={require('@/assets/pollution-tracker.svg')}
          onPress={() => router.push("/(tabs)/pollution-tracker")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  waveIcon: {
    width: 24,
    height: 24,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuGrid: {
    padding: 20,
    gap: 20,
  },
  menuItem: {
    backgroundColor: '#F8F9FE',
    borderRadius: 16,
    padding: 20,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5D3FD3',
    maxWidth: '60%',
  },
  menuIcon: {
    width: 80,
    height: 80,
  },
});
