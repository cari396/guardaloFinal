// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: 'Guardalo.com',
    description: 'Alquiler de depósitos para pertenencias en Chivilcoy',
    author: '@ianmethyst',
    siteUrl: 'https://guardalo.com.ar',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-eslint',
      options: {
        test: /\.[tj]sx?$/,
        exclude: /(_this_is_virtual_fs_path_|node_modules|.cache|public)/,
        stages: ['develop'],
        options: {
          emitWarning: true,
          failOnError: false,
        },
      },
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-image',
    'gatsby-plugin-svgr-svgo',
    'gatsby-plugin-react-helmet',
    `gatsby-transformer-yaml`,
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'text',
        path: `${__dirname}/src/text`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve('./src/components/Layout.tsx'),
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Guardalo.com',
        short_name: 'Guardalo',
        start_url: '/',
        background_color: '#1E3264',
        theme_color: '#1E3264',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-transformer-remark',
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-matomo',
      options: {
        siteId: '1',
        matomoUrl: 'https://guardalo.com.ar/matomo',
        siteUrl: 'https://guardalo.com.ar',
      },
    },
    // "gatsby-plugin-offline",
  ],
}
