const webpack = require('webpack');
const path = require('path');
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
     entry: './src/twurple-auth-interop.js',
    output: {
        path: path.resolve(__dirname, '../wwwroot/js'),
        filename: "jslib.js",
        library: "jslib"
    }
};