// tmp117-read-temperature.js
//
// Reads the temperature from a TMP117 sensor connected via I2C
// on a Raspberry Pi, using the node-web-i2c library.
//
// Wiring:
//   TMP117 VCC -> Pi Pin 1 (3.3V)
//   TMP117 GND -> Pi Pin 6 (GND)
//   TMP117 SDA -> Pi Pin 3 (GPIO 2 / SDA)
//   TMP117 SCL -> Pi Pin 5 (GPIO 3 / SCL)
//
// Datasheet reference: https://www.ti.com/lit/ds/symlink/tmp117.pdf

import { requestI2CAccess } from "node-web-i2c";

// --- Constants from the TMP117 datasheet ---
const TMP117_I2C_ADDRESS = 0x48;      // Default address (ADD0 pin -> GND)
const TEMP_RESULT_REGISTER = 0x00;    // Register that stores the latest temperature
const TEMP_RESOLUTION = 0.0078125;    // °C per LSB (from the datasheet)

// Converts the raw 16-bit value from the sensor into a signed number.
// The TMP117 uses "two's complement" format, so values above 32767
// actually represent negative temperatures.
function toSignedInt16(rawValue) {
  if (rawValue > 0x7fff) {
    return rawValue - 0x10000;
  }
  return rawValue;
}

async function readTemperature() {
  // Step 1: Get access to the Pi's I2C system
  const i2cAccess = await requestI2CAccess();

  // Step 2: Open the I2C bus (bus 1 is standard on Raspberry Pi)
  const port = i2cAccess.ports.get(1);

  // Step 3: Open a connection to the TMP117 sensor specifically
  const tmp117 = await port.open(TMP117_I2C_ADDRESS);

  // Step 4: Read the 16-bit raw value from the temperature register
  const rawValue = await tmp117.read16(TEMP_RESULT_REGISTER);

  // Step 5: Convert the raw value to a proper signed number
  const signedValue = toSignedInt16(rawValue);

  // Step 6: Apply the conversion formula from the datasheet
  const temperatureCelsius = signedValue * TEMP_RESOLUTION;

  return temperatureCelsius;
}

// Run it and print the result
readTemperature()
  .then((temp) => {
    console.log(`Temperature: ${temp.toFixed(2)} °C`);
  })
  .catch((err) => {
    console.error("Failed to read temperature:", err);
  });