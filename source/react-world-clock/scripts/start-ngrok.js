const { spawn } = require('child_process');
const fs = require('fs');

console.log("🚀 Launching Ngrok...");

const ngrok = spawn('npx', ['ngrok', 'http', '4321', '--log=stdout', '--config=none'], {
  env: { ...process.env, NGROK_ALLOW_INVALID_CERT: 'true' },
  stdio: ['pipe', 'pipe', 'pipe']
});

ngrok.stdout.on('data', (data) => {
  const output = data.toString();
  const match = output.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/);

  if (match) {
    const ngrokUrl = match[0];
    const manifestUrl = `${ngrokUrl}/temp/manifests.js`;
    const workbenchUrl = `https://cheffin.sharepoint.com/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=${manifestUrl}`;

    console.log('\n🌐 SPFx Manifest Workbench URL:\n' + workbenchUrl);
    fs.writeFileSync('.ngrok-url.txt', workbenchUrl);
  } else {
    console.log('[Waiting for ngrok tunnel to start...]');
  }
});

ngrok.stderr.on('data', (data) => {
  console.error('[Ngrok Error]', data.toString());
});

ngrok.on('close', (code) => {
  console.log(`[Ngrok exited with code ${code}]`);
});
