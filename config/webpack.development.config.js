const path = require('path');

module.exports = (baseConfig, env, defaultConfig) => {
  // defaultConfig.module.rules.push({
  //   test: /\.(ts|tsx)$/,
  //   include: path.resolve(__dirname, '../src'),
  //   loader: require.resolve('ts-loader'),
  // });

  defaultConfig.module.rules.push(
    {
      test: /\.(jpe?g|png|gif|svg)$/,
      include: path.resolve(__dirname, '../stories'),
      loaders: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      ],
    },
    {
      test: /\.css$/,
      include: path.resolve(__dirname, '../src'),
      loaders: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
            importLoaders: 1,
          },
        },
        'postcss-loader',
      ],
    }
  );

  // defaultConfig.resolve.extensions.push('.ts', '.tsx');
  // defaultConfig.resolve.extensions.push('.jpg');

  return defaultConfig;
};
