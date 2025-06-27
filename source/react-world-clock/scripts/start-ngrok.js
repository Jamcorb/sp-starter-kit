const fs = require('fs');
const ngrok = require('ngrok');

(async function () {
  console.log('🚀 Hey Jimmy, Launching Ngrok tunnel to https://localhost:4321');

  try {
    const url = await ngrok.connect({
      addr: 4321,
      allow_invalid_cert: true, // for self-signed SPFx cert
      onStatusChange: status => console.log(`[ngrok status] ${status}`),
    });

    const manifestUrl = `${url}/temp/manifests.js`;
    const workbenchUrl = `https://cheffin.sharepoint.com/_layouts/15/workbench.aspx?debug=true&noredir=true&debugManifestsFile=${manifestUrl}`;

    console.log('\n🌐 SPFx Manifest Workbench URL:\n' + workbenchUrl);

    try {
      fs.writeFileSync('.ngrok-url.txt', workbenchUrl);
      console.log('[✔] URL written to .ngrok-url.txt');
    } catch (err) {
      console.warn('[✖] Failed to write file:', err.message);
    }

  } catch (err) {
    console.error('[✖] Failed to start ngrok:', err.message);
  }
})();
