const React = require('react')

/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 */
exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    React.createElement('script', {
      key: 'runtime-config',
      src: '/config.js',
    }),
    React.createElement('script', {
      key: 'google-gsi',
      src: 'https://accounts.google.com/gsi/client',
      async: true,
      defer: true,
    }),
  ])
}
