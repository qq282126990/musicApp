/**
 * @file 开发环境 webpack 配置文件
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const MultipageWebpackPlugin = require('multipage-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
            .concat(SkeletonWebpackPlugin.loader({
                resource: resolve('src/router.js'),
                options: {
                    entry: Object.keys(utils.getEntries('./src/pages')),
                    importTemplate: 'import [nameHash] from \'@/pages/[name]/[nameCap].skeleton.vue\';'
                }
            }))
    },

    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),

        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].css')
        }),

        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),

        new SkeletonWebpackPlugin({
            webpackConfig: require('./webpack.skeleton.conf')
        }),

        new MultipageWebpackPlugin({
            bootstrapFilename: 'manifest',
            templateFilename: 'index.html',
            templatePath: '[name]',
            htmlTemplatePath: resolve('src/pages/[name]/index.html'),
            htmlWebpackPluginOptions: {
                inject: true,
                favicon: utils.assetsPath('img/icons/favicon.ico')
            }
        }),

        new FriendlyErrorsPlugin()
    ]
});
