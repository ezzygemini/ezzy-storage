let pkg;
try {
  pkg = require('../../../package.json');
} catch (e) {
  pkg = require('../package.json');
}
module.exports = pkg;
