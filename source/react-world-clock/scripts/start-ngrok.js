const { spawn } = require('child_process');
const fs = require('fs');

console.log("🚀 Launching Ngrok...");

const ngrok = spawn('npx', ['ngrok', 'http', '4321', '--log', 'stdout'], {
  env: { ...process.env, NGROK_ALLOW_INVALID_CERT: 'true' },
  stdio: ['pipe', 'pipe', 'pipe']
});

ngrok.stdout.setEncoding('utf8');
ngrok.stdout.on('data', (data) => {
  console.log('[ngrok stdout]', data); // <-- stream logs for debugging
  const match = data.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/);

  if (match) {
    const ngrokUrl = match[0];
    const manifestUrl = `${ngrokUrl}/temp/manifests.js`;
    const workbenchUrl = `https://cheffin.sharepoint.com/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=${manifestUrl}`;

    console.log('\n🌐 SPFx Manifest Workbench URL:\n' + workbenchUrl);
    fs.writeFileSync('.ngrok-url.txt', workbenchUrl);
  }
});

ngrok.stderr.setEncoding('utf8');
ngrok.stderr.on('data', (data) => {
  console.error('[ngrok stderr]', data);
});

ngrok.on('exit', (code) => {
  console.log(`[ngrok exited with code ${code}]`);
});
