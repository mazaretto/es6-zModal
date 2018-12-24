'use strict'

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    target: 'web',
    mode: 'development',

    entry: './src/App.js',

    output: {
        filename: 'zmodal.min.js',
        path: __dirname + '/dist'
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                exclude: /node_modules/,
                test: /\.js(\?.*)?$/i,
            }),
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {loader: 'babel-loader'}
                ]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'less-loader'}
                ]
            }
        ]
    },

    devServer: {
        port: 3000,
        host: '127.0.0.1',
        contentBase: __dirname + '/dist',
        watchOptions: {
            pull: true,
        },
        compress: true
    }
}