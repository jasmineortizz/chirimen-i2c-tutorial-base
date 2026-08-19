import { requestI2CAccess } from "node-web-i2c";
import TMP117 from "./tmp117.mjs";

async function main() {
  const i2cAccess = await requestI2CAccess();
  const tmp117 = new TMP117(i2cAccess.ports.get(1));
  await tmp117.init();

  const temperature = await tmp117.read();
  console.log(`Temperature: ${temperature.toFixed(2)} °C`);
}

main().catch((err) => {
  console.error("Error:", err);
});
