const path = require('path');

module.exports = baseConfig => {
  baseConfig.module.rules[1] = {
    test: /\.css$/,
    include: path.resolve(__dirname, '../src'),
    loaders: [
      'style-loader',
      {
        loader: 'typings-for-css-modules-loader',
        options: {
          modules: true,
          namedExport: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
    ],
  };

  baseConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, '../src'),
    loader: require.resolve('ts-loader'),
  });

  baseConfig.resolve.extensions.push('.ts', '.tsx');

  return baseConfig;
};
