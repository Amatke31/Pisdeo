const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const info = require('./info.json');

const config = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './main.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'build'),
        library: {
            type: 'commonjs2'
        }
    },
    externalsType: 'global',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, 'locales'),
                    to: path.join(__dirname, 'build/locales'),
                },
                {
                    from: path.join(__dirname, 'assets'),
                    to: path.join(__dirname, 'build/assets'),
                },
                {
                    from: path.join(__dirname, 'info.json'),
                    to: path.join(__dirname, 'build/info.json'),
                },
                {
                    from: path.join(__dirname, 'template'),
                    to: path.join(__dirname, 'build/template'),
                },
            ]
        }),
    ]
};

module.exports = config;
