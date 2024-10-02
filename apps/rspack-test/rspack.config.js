const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { composePlugins, withNx } = require('@nx/rspack');
const { merge } = require('webpack-merge');

module.exports = composePlugins(withNx(), (config, { options, context }) => {
  const __config = merge(config, {
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'builtin:swc-loader',
          exclude: /[\\/]node_modules[\\/]/,
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                decorators: true,
                dynamicImport: true,
              },
              transform: {
                legacyDecorator: true,
                decoratorMetadata: true,
              },
              minify: {
                compress: {
                  unused: true,
                },
                mangle: true,
              },
              keepClassNames: true,
              externalHelpers: true,
              // loose: true,
            },
          },
        },
      ],
    },
    externals: [
      nodeExternals({
        modulesDir: path.join(__dirname, '../../', 'node_modules'),
      }),
    ],
    resolve: {
      extensions: ['...', '.ts'],
    },
  });

  // console.log('__config', __config);
  return __config;
});
