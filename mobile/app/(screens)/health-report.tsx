import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

interface ReportCardProps {
  date: string;
  onPress?: () => void;
}

const ReportCard = ({ date, onPress }: ReportCardProps) => (
  <Pressable style={styles.reportCard} onPress={onPress}>
    <View style={styles.reportCardLeft}>
      <Image 
        source={require('../../assets/general-report.svg')}
        style={styles.reportIcon}
      />
      <View>
        <Text style={styles.reportTitle}>General report</Text>
        <Text style={styles.reportDate}>{date}</Text>
      </View>
    </View>
    <Image 
      source={require('../../assets/settings.svg')}
      style={[styles.moreIcon, { transform: [{ rotate: '90deg' }] }]}
    />
  </Pressable>
);

export default function HealthReportScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Health Report</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Temperature Card */}
        <View style={styles.temperatureCard}>
          <Text style={styles.cardTitle}>Average Temperature</Text>
          <View style={styles.temperatureContent}>
            <Text style={styles.temperatureValue}>30°C</Text>
            <Image 
              source={require('../../assets/temp.svg')}
              style={styles.temperatureIcon}
            />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#E6F0FF' }]}>
            <Image 
              source={require('../../assets/humidity.svg')}
              style={styles.statIcon}
            />
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statValue}>58.8%</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FFF5E6' }]}>
            <Image 
              source={require('../../assets/steps.svg')}
              style={styles.statIcon}
            />
            <Text style={styles.statLabel}>Steps</Text>
            <Text style={styles.statValue}>1200</Text>
          </View>
        </View>

        {/* Latest Reports */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Latest report</Text>
          <ReportCard date="Jul 10, 2023" />
          <ReportCard date="Jul 5, 2023" />
        </View>

        {/* Generate Report Button */}
        <Pressable style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate Report</Text>
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
    padding: 20,
  },
  temperatureCard: {
    backgroundColor: '#FFE6E6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  temperatureContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  temperatureValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  temperatureIcon: {
    width: 48,
    height: 48,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  reportsSection: {
    gap: 15,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  reportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  reportCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  reportIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    padding: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reportDate: {
    fontSize: 14,
    color: '#666',
  },
  moreIcon: {
    width: 24,
    height: 24,
  },
  generateButton: {
    backgroundColor: '#4285F4',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
