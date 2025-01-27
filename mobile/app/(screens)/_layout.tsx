import { Stack } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';

const PollutionTrackerHeader = () => (
  <View style={styles.headerContainer}>
    <Image 
      source={require('../../assets/pollution.svg')}
      style={styles.headerIcon}
    />
    <Text style={styles.headerTitle}>Pollution Tracker</Text>
  </View>
);

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          color: '#333',
          fontSize: 18,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="health-report"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="healthcare-providers"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="provider-detail"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pollution-tracker"
        options={{
          headerTitle: () => <PollutionTrackerHeader />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="account"
        options={{
          title: "Account",
        }}
      />
      <Stack.Screen
        name="notification-settings"
        options={{
          title: "Notifications",
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: "Privacy Policy",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
