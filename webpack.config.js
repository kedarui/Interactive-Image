const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const env = require('yargs').argv.env;

let outputFile;
let plugins = [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    }),
    new ExtractTextPlugin({
        filename: (env === 'build' ? '[name].min.css' : '[name].css'),
        allChunks: true,
        disable: false
    })
];

if (env === 'build') {
    plugins.push(new UglifyJsPlugin({ comments: false, minimize: true }));
    plugins.push(new OptimizeCssAssetsPlugin({
        assetNameRegExp: /.min.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
    }));
    outputFile = '[name].min.js';
} else {
    outputFile = '[name].js';
}

module.exports = {
    entry: {
        "interactive-image": ["./src/js/index.js", "./src/js/styles.js"]
    },
    output: {
        filename: outputFile,
        path: path.resolve(__dirname, 'lib')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test:/\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: { plugins: function() { return [autoprefixer]; }}
                        }
                    ]
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ],
    },
    plugins: plugins,
    externals: {
        jquery: 'jQuery'
    },
    watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/
    }
};