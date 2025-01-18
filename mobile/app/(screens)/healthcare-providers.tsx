import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

interface ProviderCardProps {
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  image: any;
  isEmergencyProvider?: boolean;
  onPress?: () => void;
}

const ProviderCard = ({ 
  name, 
  specialty, 
  rating, 
  distance, 
  image, 
  isEmergencyProvider,
  onPress 
}: ProviderCardProps) => (
  <Pressable style={styles.providerCard} onPress={onPress}>
    <Image source={image} style={styles.providerImage} />
    <View style={styles.providerInfo}>
      <View style={styles.nameContainer}>
        <Text style={styles.providerName}>{name}</Text>
        {isEmergencyProvider && (
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyText}>Emergency</Text>
          </View>
        )}
      </View>
      <Text style={styles.specialty}>{specialty}</Text>
      <View style={styles.ratingContainer}>
        <Image 
          source={require('../../assets/star.svg')} 
          style={styles.starIcon}
        />
        <Text style={styles.rating}>{rating}</Text>
        <Text style={styles.distance}>{distance}</Text>
      </View>
    </View>
  </Pressable>
);

export default function HealthcareProvidersScreen() {
  const router = useRouter();

  const providers = [
    {
      name: 'Dr. Rishi',
      specialty: 'Emergency Cardiologist',
      rating: 4.7,
      distance: '800m away',
      image: require('../../assets/doctor1.jpg'),
      isEmergencyProvider: true,
    },
    {
      name: 'Dr. Vaamana',
      specialty: 'Remote Health Specialist',
      rating: 4.7,
      distance: '800m away',
      image: require('../../assets/doctor2.jpg'),
      isEmergencyProvider: true,
    },
    {
      name: 'Dr. Nallarasi',
      specialty: 'Emergency Care',
      rating: 4.7,
      distance: '800m away',
      image: require('../../assets/doctor3.jpg'),
      isEmergencyProvider: true,
    },
    {
      name: 'Dr. Nihal',
      specialty: 'Remote Monitoring',
      rating: 4.7,
      distance: '800m away',
      image: require('../../assets/doctor4.jpg'),
    },
    {
      name: 'Dr. Rishita',
      specialty: 'Preventive Care',
      rating: 4.7,
      distance: '800m away',
      image: require('../../assets/doctor5.jpg'),
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
        <Text style={styles.headerTitle}>Healthcare Providers</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Emergency Notice */}
      <View style={styles.emergencyNotice}>
        <Image 
          source={require('../../assets/emergency.svg')} 
          style={styles.emergencyIcon}
        />
        <Text style={styles.emergencyText}>
          Emergency providers have direct access to your health data
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {providers.map((provider, index) => (
          <ProviderCard
            key={index}
            {...provider}
            onPress={() => router.push({
              pathname: '/(screens)/provider-detail',
              params: { provider: JSON.stringify(provider) }
            })}
          />
        ))}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: '#333',
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emergencyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE6E6',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  providerCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  providerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  providerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  emergencyBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  distance: {
    fontSize: 14,
    color: '#666',
  },
});
