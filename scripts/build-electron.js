const fs = require('fs');
const packager = require('electron-packager');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'build');
const outPath = path.join(__dirname, '..', 'electron-build');

const buildPackageJSONPath = path.join(__dirname, '..', 'build', 'package.json');

// only add the dependencies for the electron app here that are not bundled by webpack.
fs.writeFileSync(buildPackageJSONPath, JSON.stringify({
  name: 'jsconf-2017',
  main: 'start-electron.js',
  dependencies: {
    'express': '4.14.0',
    'portfinder': '1.0.10'
  }
}, null, 2));

const startFilePath = path.join(__dirname, 'start-electron.js');
const startFile = fs.readFileSync(startFilePath).toString();
const startFileDestPath = path.join(__dirname, '..', 'build', 'start-electron.js');
fs.writeFileSync(startFileDestPath, startFile);

require('child_process').exec('cd build && npm install', (err, a, b) => {
  packager({
    dir: dirPath,
    arch: 'x64',
    platform: ['darwin'/*, 'win32'*/],
    prune: true,
    overwrite: true,
    out: outPath
  }, (err, appPaths) => {
    if (err) {
      console.log('Could not create electron build', err.toString());
    } else {
      console.log('Successfully built the electron app');
      appPaths.forEach((p) => console.log(p));
    }
  });

})

