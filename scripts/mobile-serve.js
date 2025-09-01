import { spawn } from 'child_process';
import os from 'os';
import qrcode from 'qrcode-terminal';

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const ip = getLocalIp();
const url = `http://${ip}:4200`;

console.log(`🌐 Local IP: ${ip}`);
console.log(`🚀 Starting Angular dev server on ${url} ...`);

qrcode.generate(url, { small: true }); // Print QR code in terminal

const child = spawn(
  'npx',
  ['ng', 'serve', '--host', '0.0.0.0', '--disable-host-check'],
  { stdio: 'inherit' }
);

child.on('close', (code) => {
  console.log(`Angular dev server exited with code ${code}`);
});
