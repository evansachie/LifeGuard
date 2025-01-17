import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Image } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#5D3FD3',
        tabBarInactiveTintColor: '#A9A9A9',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/home-nav.svg')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#5D3FD3' : '#A9A9A9'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/insights.svg')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#5D3FD3' : '#A9A9A9'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/notifications.svg')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#5D3FD3' : '#A9A9A9'
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('../../assets/settings.svg')}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#5D3FD3' : '#A9A9A9'
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
