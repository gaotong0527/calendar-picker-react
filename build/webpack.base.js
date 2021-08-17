const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const rootDir = process.cwd();

module.exports = {
    entry: path.resolve(rootDir, 'src/index.tsx'),
    output: {
        path: path.resolve(rootDir, 'lib'),
        filename: 'bundle.[contenthash:8].js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(jsx|js)$/,
                use: 'babel-loader',
                include: path.resolve(rootDir, 'src'),
                exclude: /node_modules/,
            },
            {
                test: /\.(le|c)ss$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'public/index.html'),
            inject: 'body',
            scriptLoading: 'blocking',
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '*.js',
                    context: path.resolve(rootDir, "public/js"),
                    to: path.resolve(rootDir, 'lib/js'),
                },
            ],
        })

    ],
}