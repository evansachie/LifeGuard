import { View, Text, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

const INITIAL_DATA = {
  fullName: 'Evans Acheampong',
  email: 'evansachie01@gmail.com',
  emergencyContact: '',
  phoneNumber: '',
  country: 'Ghana',
  gender: 'Male',
  address: 'Legon, Accra',
};

export default function AccountScreen() {
  const [formData, setFormData] = useState(INITIAL_DATA);

  const handleUpdate = () => {
    // Handle update logic here
    console.log('Updating profile:', formData);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Form Fields */}
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            placeholder="Full name"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Emergency Contact Number</Text>
          <TextInput
            style={styles.input}
            value={formData.emergencyContact}
            onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
            placeholder="Emergency Contact Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone number</Text>
          <View style={styles.phoneInputContainer}>
            <Image 
              source={require('../../assets/ghana-flag.png')}
              style={styles.flagIcon}
            />
            <TextInput
              style={[styles.input, styles.phoneInput]}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.input}
              value={formData.country}
              onChangeText={(text) => setFormData({ ...formData, country: text })}
              placeholder="Country"
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Genre</Text>
            <TextInput
              style={styles.input}
              value={formData.gender}
              onChangeText={(text) => setFormData({ ...formData, gender: text })}
              placeholder="Genre"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
            placeholder="Address"
          />
        </View>
      </View>

      {/* Update Button */}
      <Pressable style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>UPDATE PROFILE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingLeft: 16,
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  updateButton: {
    backgroundColor: '#007AFF',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
