#include "Nicla_System.h"
#undef t_2_10s
#undef T1
#undef t_1_04s
#undef t_2_10s
#undef t_2_60s
#undef T1
#undef T2
#undef T4
#undef T8

#include "Arduino_BHY2.h"
#include <ArduinoBLE.h>
#include <LifeGuard_inferencing.h>

#define BLE_SENSE_UUID(val) ("19b10000-" val "-537e-4f6c-d104768a1214")

const int VERSION = 0x00000000;

#define CONVERT_G_TO_MS2 9.80665f
#define FREQUENCY_HZ     10
#define INTERVAL_MS      (1000 / (FREQUENCY_HZ + 1))

static unsigned long last_interval_ms = 0; 


float    features[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE];
size_t   feature_ix    = 0;
String   inferenceResult = "";

BLEService service(BLE_SENSE_UUID("0000"));
BLEUnsignedIntCharacteristic versionCharacteristic(BLE_SENSE_UUID("1001"), BLERead);
BLEFloatCharacteristic temperatureCharacteristic(BLE_SENSE_UUID("2001"), BLERead);
BLEUnsignedIntCharacteristic humidityCharacteristic(BLE_SENSE_UUID("3001"), BLERead);
BLEFloatCharacteristic pressureCharacteristic(BLE_SENSE_UUID("4001"), BLERead);

BLECharacteristic accelerometerCharacteristic(BLE_SENSE_UUID("5001"), BLERead | BLENotify, 3 * sizeof(float));  // Array of 3x 2 Bytes, XY
BLECharacteristic gyroscopeCharacteristic(BLE_SENSE_UUID("6001"), BLERead | BLENotify, 3 * sizeof(float));    // Array of 3x 2 Bytes, XYZ
BLECharacteristic quaternionCharacteristic(BLE_SENSE_UUID("7001"), BLERead | BLENotify, 4 * sizeof(float));     // Array of 4x 2 Bytes, XYZW

BLECharacteristic rgbLedCharacteristic(BLE_SENSE_UUID("8001"), BLERead | BLEWrite, 3 * sizeof(byte)); // Array of 3 bytes, RGB

BLEFloatCharacteristic bsecCharacteristic(BLE_SENSE_UUID("9001"), BLERead);
BLEIntCharacteristic  co2Characteristic(BLE_SENSE_UUID("9002"), BLERead);
BLEUnsignedIntCharacteristic gasCharacteristic(BLE_SENSE_UUID("9003"), BLERead);

BLEStringCharacteristic inferenceCharacteristic(BLE_SENSE_UUID("8005"), BLERead | BLENotify, 16);
// String to calculate the local and device name
String name;

Sensor temperature(SENSOR_ID_TEMP);
Sensor humidity(SENSOR_ID_HUM);
Sensor pressure(SENSOR_ID_BARO);
Sensor gas(SENSOR_ID_GAS);
SensorXYZ gyroscope(SENSOR_ID_GYRO);
SensorXYZ accelerometer(SENSOR_ID_ACC);
SensorQuaternion quaternion(SENSOR_ID_RV);
SensorBSEC bsec(SENSOR_ID_BSEC);

void blePeripheralDisconnectHandler(BLEDevice central){
  nicla::leds.setColor(red);
}

void onTemperatureCharacteristicRead(BLEDevice central, BLECharacteristic characteristic) {
  temperatureCharacteristic.setValue(temperature.value());
}
void onHumidityCharacteristicRead(BLEDevice central, BLECharacteristic characteristic) {
  humidityCharacteristic.setValue(humidity.value());
}
void onPressureCharacteristicRead(BLEDevice central, BLECharacteristic characteristic) {
  pressureCharacteristic.setValue(pressure.value());
}
void onBsecCharacteristicRead(BLEDevice central, BLECharacteristic characteristic) {
  bsecCharacteristic.setValue(bsec.iaq());
}
void onCo2CharacteristicRead(BLEDevice central, BLECharacteristic characteristic) {
  co2Characteristic.setValue(bsec.co2_eq());
}
void onGasCharacteristicRead(BLEDevice central, BLECharacteristic characteristic) {
  gasCharacteristic.setValue(gas.value());
}

void onRgbLedCharacteristicWrite(BLEDevice central, BLECharacteristic characteristic) {
  byte rgb[3];
  rgbLedCharacteristic.readValue(rgb, 3);
  nicla::leds.setColor(rgb[0], rgb[1], rgb[2]);
}


void setup(){
  

  nicla::begin();
  nicla::leds.begin();
  nicla::leds.setColor(green);

  Serial.begin(115200);

  Serial.println("Start");

  //Sensors initialization
  BHY2.begin(NICLA_STANDALONE);
  temperature.begin();
  humidity.begin();
  pressure.begin();
  gyroscope.begin();
  accelerometer.begin();
  quaternion.begin();
  bsec.begin();
  gas.begin();

  Serial.println("Reached BLE begin");
  if (!BLE.begin()){
    Serial.println("Failed to initialized BLE!");

    while (1)
      ;
  }
  Serial.println("After BLE.begin()");

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

  // Add all the previously defined Characteristics
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
  service.addCharacteristic(inferenceCharacteristic);
  // Disconnect event handler
  BLE.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

  // Sensors event handlers
  temperatureCharacteristic.setEventHandler(BLERead, onTemperatureCharacteristicRead);
  humidityCharacteristic.setEventHandler(BLERead, onHumidityCharacteristicRead);
  pressureCharacteristic.setEventHandler(BLERead, onPressureCharacteristicRead);
  bsecCharacteristic.setEventHandler(BLERead, onBsecCharacteristicRead);
  co2Characteristic.setEventHandler(BLERead, onCo2CharacteristicRead);
  gasCharacteristic.setEventHandler(BLERead, onGasCharacteristicRead);

  rgbLedCharacteristic.setEventHandler(BLEWritten, onRgbLedCharacteristicWrite);

  versionCharacteristic.setValue(VERSION);

  BLE.addService(service);
  BLE.advertise();
}

void loop(){
  while (BLE.connected()){
    BHY2.update();

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


    if (millis() - last_interval_ms >= INTERVAL_MS) {
      last_interval_ms = millis();
      // Read accel, convert to m/s^2
      float ax = (accelerometer.x() * 8.0f / 32768.0f) * CONVERT_G_TO_MS2;
      float ay = (accelerometer.y() * 8.0f / 32768.0f) * CONVERT_G_TO_MS2;
      float az = (accelerometer.z() * 8.0f / 32768.0f) * CONVERT_G_TO_MS2;
      features[feature_ix++] = ax;
      features[feature_ix++] = ay;
      features[feature_ix++] = az;

      if (feature_ix >= EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) {
        ei_impulse_result_t result;
        signal_t signal;
        numpy::signal_from_buffer(features, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);
        if (run_classifier(&signal, &result, false) == 0) {
          // Pick label >70%
          for (size_t i=0; i<EI_CLASSIFIER_LABEL_COUNT; i++) {
            if (result.classification[i].value > 0.7f) {
              inferenceResult = result.classification[i].label;
              break;
            }
          }
        }

        // --- inside your loop(), after you compute inferenceResult but before resetting feature_ix:
  
// Print sensor values and inference to USB-serial:
        Serial.print("T: "); Serial.print(temperature.value());  // temperature in °C
        Serial.print("  H: "); Serial.print(humidity.value());   // humidity in %
        Serial.print("  P: "); Serial.print(pressure.value());   // pressure in hPa
        Serial.print("  Inference: "); Serial.println(inferenceResult);

        feature_ix = 0;
      }

       if (inferenceCharacteristic.subscribed()) {
      inferenceCharacteristic.writeValue(inferenceResult);
    }

  }
    //nicla::leds.setColor(off);
}

// void blePeripheralDisconnectHandler(BLEDevice central){
//   nicla::leds.setColor(red);
// }

// void onTemperatureCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
//   float temperatureValue = temperature.value();
//   temperatureCharacteristic.writeValue(temperatureValue);
// }

// void onHumidityCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
//   uint8_t humidityValue = humidity.value() + 0.5f;  //since we are truncating the float type to a uint8_t, we want to round it
//   humidityCharacteristic.writeValue(humidityValue);
// }

// void onPressureCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
//   float pressureValue = pressure.value();
//   pressureCharacteristic.writeValue(pressureValue);
// }

// void onBsecCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
//   float airQuality = float(bsec.iaq());
//   bsecCharacteristic.writeValue(airQuality);
// }

// void onCo2CharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
//   uint32_t co2 = bsec.co2_eq();
//   co2Characteristic.writeValue(co2);
// }

// void onGasCharacteristicRead(BLEDevice central, BLECharacteristic characteristic){
//   unsigned int g = gas.value();
//   gasCharacteristic.writeValue(g);
// }

// void onRgbLedCharacteristicWrite(BLEDevice central, BLECharacteristic characteristic){
//   byte r = rgbLedCharacteristic[0];
//   byte g = rgbLedCharacteristic[1];
//   byte b = rgbLedCharacteristic[2];
// }
  
}






