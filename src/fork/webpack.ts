import * as path from 'path';

module.exports = env => {
  if (!env) { env = 'development'; }
  return {
    entry: {
      main: './src/fork/child.ts'
    },
    target: 'electron-main',
    output: {
      path: path.resolve(__dirname, '../../dist/fork'),
      filename: 'child.js'
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
