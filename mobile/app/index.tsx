import { View, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/(onboarding)/screen1" as any);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.backgroundElements}>
        <Image
          source={require('../assets/pills.png')}
          style={styles.pillsTop}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/stethoscope.png')}
          style={styles.stethoscope}
          resizeMode="contain"
        />
      </View>
      <Image
        source={require('../assets/lifeguard-logo.svg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundElements: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  logo: {
    width: 200,
    height: 200,
  },
  pillsTop: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 100,
    height: 100,
    transform: [{ rotate: '15deg' }],
  },
  stethoscope: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 150,
    height: 150,
    transform: [{ rotate: '-15deg' }],
  },
});
