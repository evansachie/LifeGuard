import { View, Text, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface ReadingCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: any;
}

const ReadingCard = ({ title, value, unit, icon }: ReadingCardProps) => (
  <View style={styles.readingCard}>
    <View style={styles.readingHeader}>
      <Text style={styles.readingTitle}>{title}</Text>
      <Image source={icon} style={styles.readingIcon} />
    </View>
    <View style={styles.readingValue}>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.unitText}>{unit}</Text>
    </View>
  </View>
);

export default function InsightsScreen() {
  // Mock data for sensor readings
  const readings = [
    {
      title: 'Temperature',
      value: '29.9',
      unit: '°C',
      icon: require('../../assets/temp-in.svg'),
    },
    {
      title: 'Activities',
      value: '1.2k',
      unit: 'steps',
      icon: require('../../assets/footsteps-in.svg'),
    },
    {
      title: 'Humidity',
      value: '59.8',
      unit: '%',
      icon: require('../../assets/humidity-in.svg'),
    },
    {
      title: 'Pressure',
      value: '995.2',
      unit: 'mbar',
      icon: require('../../assets/atm-pressure.svg'),
    },
    {
      title: 'Air Quality',
      value: '272',
      unit: 'ppm',
      icon: require('../../assets/air-quality.svg'),
    },
    {
      title: 'CO2',
      value: '422',
      unit: 'ppm',
      icon: require('../../assets/co2.svg'),
    },
  ];

  // Mock data for the activity graph
  const graphData = {
    labels: ['', '', '', '', '', ''],
    datasets: [
      {
        data: [20, 25, 28, 32, 36, 40, 38],
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.greetingContainer}>
            {/* <Image 
              source={require('../../assets/wave.svg')} 
              style={styles.waveIcon}
            /> */}
            <Text style={styles.greeting}>👋 Hi Evans!</Text>
          </View>
        </View>
        <Image 
          source={require('../../assets/user.svg')} 
          style={styles.profileImage}
        />
      </View>

      {/* Sensor Readings Grid */}
      <View style={styles.readingsGrid}>
        {readings.map((reading, index) => (
          <ReadingCard key={index} {...reading} />
        ))}
      </View>

      {/* Current Activity */}
      <View style={styles.activityContainer}>
        <View style={styles.activityHeader}>
          <Image 
            source={require('../../assets/vehicle.svg')} 
            style={styles.activityIcon}
          />
          <Text style={styles.activityText}>Activity : On a Vehicle</Text>
        </View>

        {/* Activity Graph */}
        <LineChart
          data={graphData}
          width={Dimensions.get('window').width - 40}
          height={180}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.graph}
          withDots={false}
          withInnerLines={false}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={false}
          withHorizontalLabels={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  readingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 15,
  },
  readingCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  readingTitle: {
    fontSize: 14,
    color: '#666',
  },
  readingIcon: {
    width: 20,
    height: 20,
  },
  readingValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 4,
  },
  unitText: {
    fontSize: 14,
    color: '#666',
  },
  activityContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  activityText: {
    fontSize: 14,
    color: '#666',
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
