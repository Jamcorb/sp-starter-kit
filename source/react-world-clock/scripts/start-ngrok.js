const { exec } = require('child_process');
const fs = require('fs');

exec('NGROK_ALLOW_INVALID_CERT=true npx ngrok http 4321 --log=stdout', (err, stdout, stderr) => {
  if (err) {
    console.error('Failed to start ngrok:', err);
    return;
  }

  const match = stdout.match(/https:\/\/[a-z0-9-]+\.ngrok-free\.app/);
  if (match) {
    const ngrokUrl = match[0];
    const manifestUrl = `${ngrokUrl}/temp/manifests.js`;
    const workbenchUrl = `https://cheffin.sharepoint.com/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=${manifestUrl}`;

    console.log('\n🌐 SPFx Manifest Workbench URL:\n' + workbenchUrl);
    fs.writeFileSync('.ngrok-url.txt', workbenchUrl);
  } else {
    console.warn('Ngrok URL not found in output.');
  }
});
