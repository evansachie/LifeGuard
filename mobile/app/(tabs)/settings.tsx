import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const menuItems = [
  {
    id: 'account',
    title: 'Account',
    icon: require('../../assets/account.svg'),
    route: '/(screens)/account',
  },
  {
    id: 'notification',
    title: 'Notification',
    icon: require('../../assets/notifications.svg'),
    route: '/(screens)/notification-settings',
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    icon: require('../../assets/security.svg'),
    route: '/(screens)/privacy',
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const userEmail = "evansachie01@gmail.com";

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.headerTitle}>Settings</Text>

      {/* Profile Section */}
      <Pressable 
        style={styles.profileSection}
        onPress={() => router.push('/(screens)/account')}
      >
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../../assets/profile.svg')}
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Image 
              source={require('../../assets/edit.svg')}
              style={styles.editIcon}
            />
          </View>
        </View>
        <Text style={styles.profileName}>Evans Acheampong</Text>
        <Text style={styles.profileEmail}>{userEmail}</Text>
      </Pressable>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            style={styles.menuItem}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.menuItemLeft}>
              <Image source={item.icon} style={styles.menuIcon} />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Image 
              source={require('../../assets/chevron-right.svg')}
              style={styles.chevronIcon}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D3FD3',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  editIcon: {
    width: 16,
    height: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  chevronIcon: {
    width: 24,
    height: 24,
  },
});
