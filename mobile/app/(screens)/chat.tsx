import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

interface OnlineUserProps {
  name: string;
  image: any;
  isOnline?: boolean;
}

interface ChatMessageProps {
  name: string;
  message: string;
  time: string;
  image: any;
  unreadCount?: number;
  isHealthcare?: boolean;
}

const OnlineUser = ({ name, image, isOnline }: OnlineUserProps) => (
  <View style={styles.onlineUser}>
    <View style={styles.avatarContainer}>
      <Image source={image} style={styles.avatar} />
      {isOnline && <View style={styles.onlineIndicator} />}
    </View>
    <Text style={styles.onlineName}>{name}</Text>
  </View>
);

const ChatMessage = ({ name, message, time, image, unreadCount, isHealthcare }: ChatMessageProps) => (
  <Pressable style={styles.chatMessage}>
    <View style={styles.avatarContainer}>
      <Image source={image} style={styles.avatar} />
      {isHealthcare && <View style={styles.healthcareIndicator} />}
    </View>
    <View style={styles.messageContent}>
      <Text style={styles.messageName}>{name}</Text>
      <Text style={styles.messageText}>{message}</Text>
    </View>
    <View style={styles.messageRight}>
      <Text style={styles.messageTime}>{time}</Text>
      {unreadCount && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{unreadCount}</Text>
        </View>
      )}
    </View>
  </Pressable>
);

export default function ChatScreen() {
  const router = useRouter();

  const healthcareTeam = [
    { name: 'Dr. Smith', image: require('../../assets/user.svg'), isOnline: true },
    { name: 'Nurse Chen', image: require('../../assets/user.svg'), isOnline: true },
    { name: 'Dr. Johnson', image: require('../../assets/user.svg'), isOnline: false },
  ];

  const recentChats = [
    {
      name: 'Emergency Response',
      message: 'Available 24/7 for emergencies',
      time: '24/7',
      image: require('../../assets/user.svg'),
      isHealthcare: true,
    },
    {
      name: 'Dr. Sarah Smith',
      message: 'Your test results are ready',
      time: '04:04 AM',
      image: require('../../assets/user.svg'),
      unreadCount: 3,
      isHealthcare: true,
    },
    {
      name: 'Nurse Chen',
      message: 'How are you feeling today?',
      time: '08:58 PM',
      image: require('../../assets/user.svg'),
      unreadCount: 1,
      isHealthcare: true,
    },
    {
      name: 'Mental Health Support',
      message: "Remember, we're here to help",
      time: '11:33 PM',
      image: require('../../assets/user.svg'),
      isHealthcare: true,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Healthcare Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HEALTHCARE TEAM</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.onlineUsers}
          >
            {healthcareTeam.map((user, index) => (
              <OnlineUser 
                key={index}
                name={user.name}
                image={user.image}
                isOnline={user.isOnline}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Chats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT MESSAGES</Text>
          <View style={styles.chatList}>
            {recentChats.map((chat, index) => (
              <ChatMessage 
                key={index}
                name={chat.name}
                message={chat.message}
                time={chat.time}
                image={chat.image}
                unreadCount={chat.unreadCount}
                isHealthcare={chat.isHealthcare}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    fontSize: 24,
    color: '#333',
    padding: 10,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  onlineUsers: {
    flexDirection: 'row',
  },
  onlineUser: {
    alignItems: 'center',
    marginRight: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  healthcareIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#5D3FD3',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  chatList: {
    gap: 20,
  },
  chatMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
    marginLeft: 12,
  },
  messageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#666',
  },
  messageRight: {
    alignItems: 'flex-end',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#5D3FD3',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
