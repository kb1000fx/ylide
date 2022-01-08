const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    //mode: "development",
    devtool: "source-map",
    entry: {
        vendor: ["./src/ts/vendor.ts"],
        layout: ["./src/ts/layout.ts"],
        account: ["./src/ts/account.ts"],
        login: ["./src/ts/login.ts"],
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist",
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },   
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                include: /src/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader",
                ]
            },      
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                          warnRuleAsWarning: true,
                        },
                    },
                ],
            },   
            {
                test: require.resolve("jquery"),
                loader: "expose-loader",
                options: {
                  exposes: ["$", "jQuery"],
                },
            },        
            {
                test: require.resolve("axios"),
                loader: "expose-loader",
                options: {
                  exposes: "axios",
                },
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin()
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default",
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
            }),
            new TerserPlugin()
        ],
    },
    performance: {
        hints: false,
    },
    ignoreWarnings: [
        {
            module: /\.scss$/
        },
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 1000,
        ignored: /node_modules/,
    },

}