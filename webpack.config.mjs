import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const __dirname = path.resolve();

export default (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'app.js'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.join(__dirname, 'src'), 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.js/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          },
          resolve: {
            fullySpecified: false
          }
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      port: 3000
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ]
  };
};
