// Netlify Build Plugins must be CJS - ESM/TypeScript not supported
/* eslint-disable @typescript-eslint/no-var-requires */
const copyFile = require('fs').promises.copyFile;
const readDir = require('fs').promises.readdir;
const mkDir = require('fs').promises.mkdir;
const rmDir = require('fs').promises.rmdir;

const srcfolder = 'node_modules/chrome-aws-lambda/bin/';
const dstfolder = 'netlify/functions/bin/';

module.exports = {
  onPreBuild: async ({ utils }) => {
    mkDir(dstfolder, { recursive: true });
    try {
      const files = await readDir(srcfolder);
      for (const binfile of files) {
        console.log('Copying chromium binary: ', binfile);
        await copyFile(srcfolder + binfile, dstfolder + binfile);
      }
      // Succsesfully completed
      console.log(`Successfully moved chromium binaries`);
      return;
    } catch (err) {
      return utils.build.failBuild(`Failed to copy chromium binaries: ${err}`);
    }
  },
  onEnd: async ({ utils }) => {
    try {
      await rmDir(dstfolder, { recursive: true });
      console.log(`Removed chromium binaries from function folder`);
    } catch (err) {
      return utils.build.failBuild(
        `Failed to remove chromium binaries from function folder: ${err}`
      );
    }
  }
};
// Testing a thing
