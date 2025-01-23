import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'purple' | 'yellow' | 'blue' | 'orange';
}

// Mock notifications data
const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Notification Title',
    description: 'Lorem ipsum dolor sit amet, consectetur\nLorem ipsum dolor sit amet, ipsum dolor',
    type: 'purple',
  },
  {
    id: '2',
    title: 'Notification Title',
    description: 'Lorem ipsum dolor sit amet, consectetur\nLorem ipsum dolor sit amet, ipsum dolor',
    type: 'yellow',
  },
  {
    id: '3',
    title: 'Notification Title',
    description: 'Lorem ipsum dolor sit amet, consectetur',
    type: 'blue',
  },
  {
    id: '4',
    title: 'Notification Title',
    description: 'Lorem ipsum dolor sit amet, consectetur\nLorem ipsum dolor sit amet, ipsum dolor',
    type: 'orange',
  },
];

const NotificationCard = ({ notification }: { notification: NotificationItem }) => {
  const dotColor = {
    purple: '#5D3FD3',
    yellow: '#FFB344',
    blue: '#4285F4',
    orange: '#FF6B6B',
  }[notification.type];

  return (
    <View style={styles.notificationCard}>
      <View style={[styles.notificationDot, { backgroundColor: dotColor }]} />
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationDescription}>{notification.description}</Text>
      </View>
    </View>
  );
};

const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Image 
      source={require('../../assets/no-notifications.svg')} 
      style={styles.emptyImage}
    />
    <Text style={styles.emptyTitle}>No Notifications</Text>
    <Text style={styles.emptyDescription}>
      You have no notifications yet,{'\n'}please come back later
    </Text>
  </View>
);

export default function NotificationsScreen() {
  const hasNotifications = notifications.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      {hasNotifications ? (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map(notification => (
            <NotificationCard 
              key={notification.id} 
              notification={notification} 
            />
          ))}
        </ScrollView>
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyImage: {
    width: 240,
    height: 240,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
