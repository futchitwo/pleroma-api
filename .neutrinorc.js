module.exports = {
  use: [
    '@neutrinojs/standardjs',
    [
      '@neutrinojs/library',
      {
        name: 'pleroma-api'
      }
    ],
    '@neutrinojs/jest'
  ]
};
