import { View, Text, StyleSheet, Switch } from 'react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

interface NotificationSetting {
  id: string;
  title: string;
  enabled: boolean;
}

interface SettingsSection {
  title: string;
  items: NotificationSetting[];
}

const initialSettings: SettingsSection[] = [
  {
    title: 'Common',
    items: [
      { id: 'general', title: 'General Notification', enabled: true },
      { id: 'sound', title: 'Sound', enabled: false },
      { id: 'vibrate', title: 'Vibrate', enabled: true },
      { id: 'emergency', title: 'Emergency Contact', enabled: true },
      { id: 'anomaly', title: 'Anomaly Detection', enabled: true },
    ],
  },
  {
    title: 'System & Services Update',
    items: [
      { id: 'updates', title: 'App updates', enabled: false },
    ],
  },
  {
    title: 'Others',
    items: [
      { id: 'newService', title: 'New Service Available', enabled: false },
      { id: 'tips', title: 'New Tips Available', enabled: true },
    ],
  },
];

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (sectionIndex: number, itemIndex: number) => {
    const newSettings = [...settings];
    newSettings[sectionIndex].items[itemIndex].enabled = 
      !newSettings[sectionIndex].items[itemIndex].enabled;
    setSettings(newSettings);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {settings.map((section, sectionIndex) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <View key={item.id} style={styles.settingItem}>
              <Text style={styles.settingTitle}>{item.title}</Text>
              <Switch
                value={item.enabled}
                onValueChange={() => handleToggle(sectionIndex, itemIndex)}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
});
