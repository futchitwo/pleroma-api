const library = require('@neutrinojs/library')
const standardjs = require('@neutrinojs/standardjs');
const jest = require('@neutrinojs/jest');

module.exports = {
  use: [
    standardjs(),
    library({
      name: 'pleroma-api',
    }),
    jest({
      setupFilesAfterEnv: ["./test/jest.init.js"]
    })
  ],
}