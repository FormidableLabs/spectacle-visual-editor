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
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.join(__dirname, 'src'), 'node_modules'],
      fallback: { path: false }
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
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    devServer: {
      historyApiFallback: true,
      port: 3000
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'async',
        cacheGroups: {
          default: {
            minChunks: 2,
            reuseExistingChunk: true,
          },
          vendor: {
            test(module) {
              if (!module.context) {
                return false;
              }
              if (!module.context.includes('node_modules')) {
                return false;
              }
              return !['react-ace', 'ace-builds'].some(moduleContext => module.context.includes(moduleContext));
            },
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser.js'
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ]
  };
};
