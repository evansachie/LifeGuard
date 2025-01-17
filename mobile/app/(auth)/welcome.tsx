import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <Image
        source={require('../../assets/lifeguard-logo.svg')}
        style={styles.logo}
        resizeMode="contain"
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to LifeGuard</Text>
        <Text style={styles.subtitle}>Your personal health companion</Text>
        
        <View style={styles.buttonContainer}>
          <Pressable 
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push("/(auth)/login" as any)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.signupButton]}
            onPress={() => router.push("/(auth)/register" as any)}
          >
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginTop: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#4285F4',
  },
  signupButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButtonText: {
    color: '#4285F4',
    fontSize: 16,
    fontWeight: '600',
  },
});
