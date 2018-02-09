/**
 * @file 生产环境 webpack 配置文件
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const SwRegisterWebpackPlugin = require('sw-register-webpack-plugin');
const MultipageWebpackPlugin = require('multipage-webpack-plugin');

let env = process.env.NODE_ENV === 'testing'
    ? require('../config/test.env')
    : config.build.env;

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

let webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true
        })
    },
    devtool: config.build.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    plugins: [

        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),

        // extract css into its own file
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash].css')
        }),

        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        new SkeletonWebpackPlugin({
            webpackConfig: require('./webpack.skeleton.conf')
        }),

        new MultipageWebpackPlugin({
            bootstrapFilename: utils.assetsPath('js/manifest.[chunkhash].js'),
            templateFilename: '[name].html',
            templatePath: config.build.assetsRoot,
            htmlTemplatePath: resolve('src/pages/[name]/index.html'),
            htmlWebpackPluginOptions: {
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                favicon: utils.assetsPath('img/icons/favicon.ico'),
                chunksSortMode: 'auto'
            }
        }),

        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),

        // service worker caching
        new SWPrecacheWebpackPlugin(config.swPrecache.build),
        new SwRegisterWebpackPlugin({
            filePath: path.resolve(__dirname, '../src/sw-register.js')
        })
    ]
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin');

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(''
                + '\\.('
                + config.build.productionGzipExtensions.join('|')
                + ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
