const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/js/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js')
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader','css-loader','sass-loader']
      },
      {
        test: /\.(woff|woff2|ttf|otf)$/i,
        use: {
            loader: 'file-loader',
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "fonts"
            }
        }

      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: {
            loader: 'file-loader',
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "imgs"          
            }
        }
      },
      {
        test: /\.(xml)$/i,
        use: ['xml-loader'],
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ]
};