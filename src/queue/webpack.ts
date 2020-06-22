import * as path from 'path';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = env => {
  if (!env) { env = 'development'; }
  return {
    entry: {
      main: './src/queue/queue.ts'
    },
    target: 'electron-main',
    output: {
      path: path.resolve(__dirname, '../../dist/queue'),
      filename: 'queue.js'
    },
    externals: [ ],
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          loader: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
      plugins: [
        new TsconfigPathsPlugin({ configFile: './src/queue/tsconfig.json' })
      ],
      alias: { }
    },
    node: {
      __dirname: true,
      __filename: true
    },
    plugins: [
    ]
  };
};
