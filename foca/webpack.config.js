const path = require("path")
const destDir = path.resolve(__dirname, "dist")

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        index: './app/entry.js'
    },
    mode: 'development',
    devtool: 'source-map',
    output: {
        filename: "foca.js",
        path: destDir
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/index.html',
            chunks: ['index'],
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(hbs)$/,
                use: 'raw-loader'
            },
            {
                test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000',
            }
        ]
    }
};