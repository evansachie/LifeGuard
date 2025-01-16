import { View, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Auto navigate to main screen after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home'); // Replace with your main screen name
    }, 50000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4EBF7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;
