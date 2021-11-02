// Netlify Build Plugins must be CJS - ESM/TypeScript not supported
/* eslint-disable @typescript-eslint/no-var-requires */
const { promisify } = require('util');
const copyFile = promisify(require('fs').copyFile);
const readDir = promisify(require('fs').readdir);
const mkDir = promisify(require('fs').mkdir);
const rm = promisify(require('fs').rm);

const srcfolder = 'node_modules/chrome-aws-lambda/bin/';
const dstfolder = 'netlify/functions/bin/';

module.exports = {
  onPreBuild: async ({ utils }) => {
    mkDir(dstfolder, { recursive: true });
    try {
      const files = await readDir(srcfolder);
      for (const binfile of files) {
        console.log('Copied chromium binary: ', binfile);
        await copyFile(srcfolder + binfile, dstfolder + binfile);
      }
      // Succsesfully completed
      console.log(`Successfully moved chromium binaries`);
      return;
    } catch (err) {
      return utils.build.failBuild(`Failed to copy chromium binaries: ${err}`);
    }
  },
  onEnd: async () => {
    try {
      await rm(dstfolder, { recursive: true });
      console.log(`Removed chromium binaries from function folder`);
    } catch (err) {
      console.log(
        `Failed to remove chromium binaries from function folder: ${err}`
      );
    }
  }
};
