const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Launching Ngrok...');

const ngrok = spawn('npx', [
  'ngrok',
  'http',
  '4321',
  '--log', 'stdout'
], {
  env: {
    ...process.env,
    NGROK_ALLOW_INVALID_CERT: 'true'
  },
  stdio: ['pipe', 'pipe', 'pipe']
});

console.log('[Waiting for ngrok tunnel to start...]');

let buffer = '';

ngrok.stdout.on('data', (data) => {
  const output = data.toString();
  buffer += output;

  const match = buffer.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/);
  if (match) {
    const ngrokUrl = match[0];
    const manifestUrl = `${ngrokUrl}/temp/manifests.js`;
    const workbenchUrl = `https://cheffin.sharepoint.com/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=${manifestUrl}`;

    console.log('\n🌐 SPFx Manifest Workbench URL:\n' + workbenchUrl);
    try {
      fs.writeFileSync('.ngrok-url.txt', workbenchUrl);
      console.log('[✔] URL written to .ngrok-url.txt');
    } catch (err) {
      console.warn('[File write failed]', err.message);
    }

    ngrok.stdout.removeAllListeners('data'); // Stop further output parsing
  }
});

ngrok.stderr.on('data', (data) => {
  console.error('[Ngrok Error]', data.toString());
});

ngrok.on('close', (code) => {
  console.log(`[Ngrok exited with code ${code}]`);
});
