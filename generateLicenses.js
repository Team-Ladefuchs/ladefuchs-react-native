const licenseChecker = require('license-checker');
const fs = require('fs');

licenseChecker.init({
  start: '.',
  production: true,
  json: true
}, function(err, json) {
  if (err) {
    console.error(err);
  } else {
    const filteredLicenses = {};
    const dependencies = require('./package.json').dependencies;

    Object.keys(dependencies).forEach(dep => {
      const version = dependencies[dep].replace('^', '').replace('~', '');
      const key = `${dep}@${version}`;
      if (json[key]) {
        filteredLicenses[key] = json[key];
      } else {
        console.warn(`Lizenzinformation für ${key} nicht gefunden`);
      }
    });

    fs.writeFileSync('assets/licenses.json', JSON.stringify(filteredLicenses, null, 2));
    console.log('Lizenzinformationen für dependencies wurden in assets/licenses.json gespeichert');
  }
});
