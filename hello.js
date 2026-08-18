import { requestGPIOAccess } from "chirimen"; 
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // sleep 関数を定義

const gpioAccess = await requestGPIOAccess(); // GPIO を操作する
const port = gpioAccess.ports.get(5); // 26 番ポートを操作する

await port.export("in"); // ポートを出力モードに設定
