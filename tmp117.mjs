// tmp117.mjs
//
// Driver for the TMP117 high-precision temperature sensor.
// Datasheet: https://www.ti.com/lit/ds/symlink/tmp117.pdf

const TEMP_RESULT_REGISTER = 0x00;
const TEMP_RESOLUTION = 0.0078125; // °C per LSB

export default class TMP117 {
  constructor(i2cPort, address = 0x48) {
    this.i2cPort = i2cPort;
    this.address = address;
    this.device = null;
  }

  async init() {
    this.device = await this.i2cPort.open(this.address);
  }

  // Reads the current temperature in Celsius
  async read() {
    const rawValue = await this.device.read16(TEMP_RESULT_REGISTER);

    // node-web-i2c returns the two bytes in the opposite order from
    // what the TMP117 sends (MSB first per the datasheet), so we
    // swap them back before interpreting the value.
    const swappedValue = ((rawValue & 0xff) << 8) | (rawValue >> 8);

    // TMP117 temperature data is signed (two's complement)
    const signedValue =
      swappedValue > 0x7fff ? swappedValue - 0x10000 : swappedValue;

    return signedValue * TEMP_RESOLUTION;
  }
}

