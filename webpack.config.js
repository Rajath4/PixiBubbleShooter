const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: "source-map",

    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        host: '0.0.0.0',  
        compress: true,   
        open: true,       
        port: 8000,       
        historyApiFallback: true,  
        hot: true,      
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [["@babel/preset-env", { "targets": "defaults" }]]
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: true 
                    }
                }]
            },            
            {
                test: /\.(png|gif)$/,
                loader: "url-loader",
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    entry: {
        bundle: './src/script/index.ts',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[fullhash].js',
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/assets', to: 'assets' }
            ]
        }),
    ],
};