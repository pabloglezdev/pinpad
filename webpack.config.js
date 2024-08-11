import path from 'path';
import { fileURLToPath } from 'url';
import HtmlBundlerPlugin from 'html-bundler-webpack-plugin';
// import HtmlWebpackPlugin from 'html-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'production',
  // entry: './src/scripts/index.js',
  output: {
    path: path.join(__dirname, 'dist/'),
    clean: true,
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './src/views/index.html',
    // }),
    new HtmlBundlerPlugin({
      entry: {
        index: './src/views/index.html',
      },
      js: {
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'css/[name].[contenthash:8].css',
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpg|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
    ],
  },
};
