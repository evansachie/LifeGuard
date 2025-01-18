import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function ProviderDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const provider = JSON.parse(params.provider as string);
  const [selectedDate, setSelectedDate] = useState(23);
  const [selectedTime, setSelectedTime] = useState('02:00 PM');

  const dates = [
    { day: 'Mon', date: 21 },
    { day: 'Tue', date: 22 },
    { day: 'Wed', date: 23 },
    { day: 'Thu', date: 24 },
    { day: 'Fri', date: 25 },
    { day: 'Sat', date: 26 },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '01:00 PM', available: false },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: true },
    { time: '07:00 PM', available: true },
    { time: '08:00 PM', available: false },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Provider Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Provider Info */}
        <View style={styles.providerCard}>
          <Image source={provider.image} style={styles.providerImage} />
          <View style={styles.providerInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.providerName}>{provider.name}</Text>
              {provider.isEmergencyProvider && (
                <View style={styles.emergencyBadge}>
                  <Text style={styles.emergencyText}>Emergency</Text>
                </View>
              )}
            </View>
            <Text style={styles.specialty}>{provider.specialty}</Text>
            <View style={styles.ratingContainer}>
              <Image 
                source={require('../../assets/star.svg')}
                style={styles.starIcon}
              />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.distance}>{provider.distance}</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Specialized in remote patient monitoring and emergency response. Has direct access to LifeGuard health data for immediate medical assistance when needed.
          </Text>
          <Pressable>
            <Text style={styles.readMore}>Read more</Text>
          </Pressable>
        </View>

        {/* Calendar */}
        <View style={styles.section}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.calendar}
          >
            {dates.map((date) => (
              <Pressable
                key={date.date}
                style={[
                  styles.dateCard,
                  selectedDate === date.date && styles.selectedDate,
                ]}
                onPress={() => setSelectedDate(date.date)}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === date.date && styles.selectedDateText,
                ]}>{date.day}</Text>
                <Text style={[
                  styles.dateNumber,
                  selectedDate === date.date && styles.selectedDateText,
                ]}>{date.date}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <View style={styles.timeGrid}>
            {timeSlots.map((slot) => (
              <Pressable
                key={slot.time}
                style={[
                  styles.timeSlot,
                  !slot.available && styles.unavailableSlot,
                  selectedTime === slot.time && styles.selectedTime,
                ]}
                onPress={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
              >
                <Text style={[
                  styles.timeText,
                  !slot.available && styles.unavailableText,
                  selectedTime === slot.time && styles.selectedTimeText,
                ]}>{slot.time}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Book Button */}
        <Pressable style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Emergency Consultation</Text>
        </Pressable>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  providerCard: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 14,
    color: '#4285F4',
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
  },
  dateCard: {
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedDate: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  dateDay: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  selectedTime: {
    backgroundColor: '#4285F4',
    borderColor: '#4285F4',
  },
  unavailableSlot: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  unavailableText: {
    color: '#999',
  },
  bookButton: {
    backgroundColor: '#FF4444',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
