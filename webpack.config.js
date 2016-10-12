const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/entry.ts',
    output: {
        filename: 'subatomic.js',
        path: path.resolve('dist'),
        publicPath: '/assets/',
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        hot: true,
        contentBase: './demo/'
    }
};
