/*
Arduino Nicla Sense ME WEB Bluetooth® Low Energy Sense dashboard demo
Hardware required: https://store.arduino.cc/nicla-sense-me
Web dashboard by D. Pajak
Device sketch based on example by Sandeep Mistry and Massimo Banzi
*/

#include "Nicla_System.h"
#include "Arduino_BHY2.h"
#include <ArduinoBLE.h>

#define BLE_SENSE_UUID(val) ("19b10000-" val "-537e-4f6c-d104768a1214")

const int VERSION = 0x00000000;

BLEService service(BLE_SENSE_UUID("0000"));

BLEUnsignedIntCharacteristic versionCharacteristic(BLE_SENSE_UUID("1001"), BLERead);
BLEFloatCharacteristic temperatureCharacteristic(BLE_SENSE_UUID("2001"), BLERead);
BLEUnsignedIntCharacteristic humidityCharacteristic(BLE_SENSE_UUID("3001"), BLERead);
BLEFloatCharacteristic pressureCharacteristic(BLE_SENSE_UUID("4001"), BLERead);

BLECharacteristic accelerometerCharacteristic(BLE_SENSE_UUID("5001"), BLERead | BLENotify, 3 * sizeof(float));
BLECharacteristic gyroscopeCharacteristic(BLE_SENSE_UUID("6001"), BLERead | BLENotify, 3 * sizeof(float));
BLECharacteristic quaternionCharacteristic(BLE_SENSE_UUID("7001"), BLERead | BLENotify, 4 * sizeof(float));

BLECharacteristic rgbLedCharacteristic(BLE_SENSE_UUID("8001"), BLERead | BLEWrite, 3 * sizeof(byte));

BLEFloatCharacteristic bsecCharacteristic(BLE_SENSE_UUID("9001"), BLERead);
BLEIntCharacteristic  co2Characteristic(BLE_SENSE_UUID("9002"), BLERead);
BLEUnsignedIntCharacteristic gasCharacteristic(BLE_SENSE_UUID("9003"), BLERead);

// Fall Detection Characteristics
BLECharacteristic fallDetectionCharacteristic(BLE_SENSE_UUID("8006"), BLERead | BLENotify, sizeof(uint8_t));
BLEStringCharacteristic activityInferenceCharacteristic(BLE_SENSE_UUID("8007"), BLERead | BLENotify, 20);

// Activity and Step Tracking Characteristics
BLEStringCharacteristic activityCharacteristic(BLE_SENSE_UUID("A001"), BLERead, 50);
BLEUnsignedLongCharacteristic stepCountCharacteristic(BLE_SENSE_UUID("A002"), BLERead);
BLECharacteristic stepDetectorCharacteristic(BLE_SENSE_UUID("A003"), BLERead | BLENotify, sizeof(uint8_t));

String name;

Sensor temperature(SENSOR_ID_TEMP);
Sensor humidity(SENSOR_ID_HUM);
Sensor pressure(SENSOR_ID_BARO);
Sensor gas(SENSOR_ID_GAS);
SensorXYZ gyroscope(SENSOR_ID_GYRO);
SensorXYZ accelerometer(SENSOR_ID_ACC);
SensorQuaternion quaternion(SENSOR_ID_RV);
SensorBSEC bsec(SENSOR_ID_BSEC);

// Activity and Step Tracking Sensors
SensorActivity activity(SENSOR_ID_AR);
Sensor stepCounter(SENSOR_ID_STC);
Sensor stepDetector(SENSOR_ID_STD);

// Timing variables for step detection
unsigned long lastStepTime = 0;
const unsigned long stepDebounceTime = 1000; // Increased debounce time to 1 second
unsigned long lastActivityUpdate = 0;
const unsigned long activityUpdateInterval = 2000; // Update activity every 2 seconds
unsigned long lastStepCount = 0;
unsigned long stepCountIncrement = 0;

// Fall Detection Variables
bool fallDetected = false;
unsigned long lastFallTime = 0;
const unsigned long fallCooldownTime = 5000; // 5 second cooldown between fall alerts
float fallAccelThreshold = 2.5; // G-force threshold for potential fall
float fallGyroThreshold = 250.0; // Angular velocity threshold (deg/s)
String lastActivityInference = "still";
float accelMagnitude = 0.0;

void setup(){
  Serial.begin(115200);
  Serial.println("Start");

  nicla::begin();
  nicla::leds.begin();
  nicla::leds.setColor(green);

  BHY2.begin(NICLA_STANDALONE);
  temperature.begin();
  humidity.begin();
  pressure.begin();
  gyroscope.begin();
  accelerometer.begin();
  quaternion.begin();
  bsec.begin();
  gas.begin();
  
  activity.begin();
  stepCounter.begin();
  stepDetector.begin();

  if (!BLE.begin()){
    Serial.println("Failed to initialized BLE!");
    while (1);
  }

  String address = BLE.address();
  Serial.print("address = ");
  Serial.println(address);

  address.toUpperCase();

  name = "NiclaSenseME-";
  name += address[address.length() - 5];
  name += address[address.length() - 4];
  name += address[address.length() - 2];
  name += address[address.length() - 1];

  Serial.print("name = ");
  Serial.println(name);

  BLE.setLocalName(name.c_str());
  BLE.setDeviceName(name.c_str());
  BLE.setAdvertisedService(service);

  service.addCharacteristic(temperatureCharacteristic);
  service.addCharacteristic(humidityCharacteristic);
  service.addCharacteristic(pressureCharacteristic);
  service.addCharacteristic(versionCharacteristic);
  service.addCharacteristic(accelerometerCharacteristic);
  service.addCharacteristic(gyroscopeCharacteristic);
  service.addCharacteristic(quaternionCharacteristic);
  service.addCharacteristic(bsecCharacteristic);
  service.addCharacteristic(co2Characteristic);
  service.addCharacteristic(gasCharacteristic);
  service.addCharacteristic(rgbLedCharacteristic);
  service.addCharacteristic(activityCharacteristic);
  service.addCharacteristic(stepCountCharacteristic);
  service.addCharacteristic(stepDetectorCharacteristic);
  service.addCharacteristic(fallDetectionCharacteristic);
  service.addCharacteristic(activityInferenceCharacteristic);

  BLE.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  temperatureCharacteristic.setEventHandler(BLERead, onTemperatureCharacteristicRead);
  humidityCharacteristic.setEventHandler(BLERead, onHumidityCharacteristicRead);
  pressureCharacteristic.setEventHandler(BLERead, onPressureCharacteristicRead);
  bsecCharacteristic.setEventHandler(BLERead, onBsecCharacteristicRead);
  co2Characteristic.setEventHandler(BLERead, onCo2CharacteristicRead);
  gasCharacteristic.setEventHandler(BLERead, onGasCharacteristicRead);
  activityCharacteristic.setEventHandler(BLERead, onActivityCharacteristicRead);
  stepCountCharacteristic.setEventHandler(BLERead, onStepCountCharacteristicRead);
  stepDetectorCharacteristic.setEventHandler(BLERead, onStepDetectorCharacteristicRead);
  rgbLedCharacteristic.setEventHandler(BLEWritten, onRgbLedCharacteristicWrite);
  fallDetectionCharacteristic.setEventHandler(BLERead, onFallDetectionCharacteristicRead);
  activityInferenceCharacteristic.setEventHandler(BLERead, onActivityInferenceCharacteristicRead);

  versionCharacteristic.setValue(VERSION);

  BLE.addService(service);
  BLE.advertise();
}

void loop(){
  while (BLE.connected()){
    BHY2.update();
    
    // Get current time once for the entire loop iteration
    unsigned long currentTime = millis();

    if (gyroscopeCharacteristic.subscribed()){
      float x, y, z;
      x = gyroscope.x();
      y = gyroscope.y();
      z = gyroscope.z();
      float gyroscopeValues[3] = {x, y, z};
      gyroscopeCharacteristic.writeValue(gyroscopeValues, sizeof(gyroscopeValues));
    }

    if (accelerometerCharacteristic.subscribed()){
      float x, y, z;
      x = accelerometer.x();
      y = accelerometer.y();
      z = accelerometer.z();
      float accelerometerValues[] = {x, y, z};
      accelerometerCharacteristic.writeValue(accelerometerValues, sizeof(accelerometerValues));
    }

    if(quaternionCharacteristic.subscribed()){
      float x, y, z, w;
      x = quaternion.x();
      y = quaternion.y();
      z = quaternion.z();
      w = quaternion.w();
      float quaternionValues[] = {x,y,z,w};
      quaternionCharacteristic.writeValue(quaternionValues, sizeof(quaternionValues));
    }

    // Handle step detection with improved debouncing
    if (stepDetectorCharacteristic.subscribed()){
      // Check if step detector sensor has new data
      if (stepDetector.value() > 0) {
        // Only process if enough time has passed since last step
        if (currentTime - lastStepTime >= stepDebounceTime) {
          lastStepTime = currentTime;
          stepCountIncrement++;
          
          uint8_t stepDetected = 1;
          stepDetectorCharacteristic.writeValue(stepDetected);
          Serial.print("Valid step detected! Total steps: ");
          Serial.println(stepCounter.value());
        }
      }
    }
    
    // FALL DETECTION LOGIC
    // Calculate accelerometer magnitude
    float ax = accelerometer.x();
    float ay = accelerometer.y(); 
    float az = accelerometer.z();
    accelMagnitude = sqrt(ax*ax + ay*ay + az*az);
    
    // Calculate gyroscope magnitude  
    float gx = gyroscope.x();
    float gy = gyroscope.y();
    float gz = gyroscope.z();
    float gyroMagnitude = sqrt(gx*gx + gy*gy + gz*gz);
    
    // Get current activity
    String currentActivity = activity.getActivity();
    
    // Fall Detection Algorithm
    bool potentialFall = false;
    
    // Check for sudden acceleration change (free fall or impact)
    if (accelMagnitude < 0.5 || accelMagnitude > fallAccelThreshold) {
      potentialFall = true;
    }
    
    // Check for rapid rotation (tumbling)
    if (gyroMagnitude > fallGyroThreshold) {
      potentialFall = true;
    }
    
    // Enhanced detection: check activity inference
    if (currentActivity.indexOf("fall") >= 0 || currentActivity.indexOf("Fall") >= 0) {
      potentialFall = true;
    }
    
    // Trigger fall detection with cooldown
    if (potentialFall && !fallDetected && (currentTime - lastFallTime > fallCooldownTime)) {
      fallDetected = true;
      lastFallTime = currentTime;
      
      // Set LED to red for fall alert
      nicla::leds.setColor(red);
      
      // Send immediate fall notification
      if (fallDetectionCharacteristic.subscribed()) {
        uint8_t fallAlert = 1;
        fallDetectionCharacteristic.writeValue(fallAlert);
      }
      
      // Update activity inference
      lastActivityInference = "FALL_DETECTED";
      if (activityInferenceCharacteristic.subscribed()) {
        activityInferenceCharacteristic.writeValue(lastActivityInference);
      }
      
      Serial.println("🚨 FALL DETECTED!");
      Serial.print("Accel Magnitude: "); Serial.print(accelMagnitude);
      Serial.print(" | Gyro Magnitude: "); Serial.print(gyroMagnitude);
      Serial.print(" | Activity: "); Serial.println(currentActivity);
    }
    
    // Reset fall detection after alert period
    if (fallDetected && (currentTime - lastFallTime > 3000)) { // 3 second alert
      fallDetected = false;
      nicla::leds.setColor(green); // Back to normal
      
      if (fallDetectionCharacteristic.subscribed()) {
        uint8_t fallAlert = 0;
        fallDetectionCharacteristic.writeValue(fallAlert);
      }
      
      lastActivityInference = currentActivity;
      if (activityInferenceCharacteristic.subscribed()) {
        activityInferenceCharacteristic.writeValue(lastActivityInference);
      }
    }

    // Update activity status periodically
    if (currentTime - lastActivityUpdate >= activityUpdateInterval) {
      lastActivityUpdate = currentTime;
      
      // Update activity characteristic with current activity
      activityCharacteristic.writeValue(currentActivity);
      
      // Update step count characteristic
      uint32_t currentStepCount = stepCounter.value();
      stepCountCharacteristic.writeValue(currentStepCount);
      
      // Update activity inference if not in fall state
      if (!fallDetected) {
        lastActivityInference = currentActivity;
        if (activityInferenceCharacteristic.subscribed()) {
          activityInferenceCharacteristic.writeValue(lastActivityInference);
        }
      }
      
      Serial.print("Activity: \"");
      Serial.print(currentActivity);
      Serial.print("\" | Steps: ");
      Serial.print(currentStepCount);
      Serial.print(" | Accel: ");
      Serial.print(accelMagnitude, 2);
      Serial.print("g | Fall: ");
      Serial.println(fallDetected ? "YES" : "NO");
    }
  }
}

void blePeripheralDisconnectHandler(BLEDevice central){
  nicla::leds.setColor(red);
}

void onTemperatureCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  float temperatureValue = temperature.value();
  temperatureCharacteristic.writeValue(temperatureValue);
}

void onHumidityCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  uint8_t humidityValue = humidity.value() + 0.5f;
  humidityCharacteristic.writeValue(humidityValue);
}

void onPressureCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  float pressureValue = pressure.value();
  pressureCharacteristic.writeValue(pressureValue);
}

void onBsecCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  float airQuality = float(bsec.iaq());
  bsecCharacteristic.writeValue(airQuality);
}

void onCo2CharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  uint32_t co2 = bsec.co2_eq();
  co2Characteristic.writeValue(co2);
}

void onGasCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  unsigned int g = gas.value();
  gasCharacteristic.writeValue(g);
}

void onRgbLedCharacteristicWrite(BLEDevice central, BLECharacteristic characteristic){
  byte r = rgbLedCharacteristic[0];
  byte g = rgbLedCharacteristic[1];
  byte b = rgbLedCharacteristic[2];
  nicla::leds.setColor(r, g, b);
}

void onActivityCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  String currentActivity = activity.getActivity();
  activityCharacteristic.writeValue(currentActivity);
  Serial.print("Activity info: ");
  Serial.println(currentActivity);
}

void onStepCountCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  uint32_t steps = stepCounter.value();
  stepCountCharacteristic.writeValue(steps);
  Serial.print("Step count: ");
  Serial.println(steps);
}

void onStepDetectorCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  uint8_t stepDetected = 0;
  unsigned long currentTime = millis();
  
  // Check if step detector sensor has new data and enough time has passed
  if (stepDetector.value() > 0 && currentTime - lastStepTime >= stepDebounceTime) {
    lastStepTime = currentTime;
    stepDetected = 1;
    stepCountIncrement++;
    
    Serial.print("Valid step detected via read! Total steps: ");
    Serial.println(stepCounter.value());
  }
  
  stepDetectorCharacteristic.writeValue(stepDetected);
}

void onFallDetectionCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  uint8_t fallStatus = fallDetected ? 1 : 0;
  fallDetectionCharacteristic.writeValue(fallStatus);
  Serial.print("Fall detection status read: ");
  Serial.println(fallDetected ? "FALL DETECTED" : "Normal");
}

void onActivityInferenceCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
  activityInferenceCharacteristic.writeValue(lastActivityInference);
  Serial.print("Activity inference read: ");
  Serial.println(lastActivityInference);
}