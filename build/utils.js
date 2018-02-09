/**
 * @file 工具包
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = function (newPath) {
    let assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory
    ;
    return path.posix.join(assetsSubDirectory, newPath);
};

exports.cssLoaders = function (options) {
    options = options || {};

    let cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: process.env.NODE_ENV === 'production',
            sourceMap: options.sourceMap
        }
    };

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        let loaders = [cssLoader];
        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            });
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            });
        }

        return ['vue-style-loader'].concat(loaders);
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {indentedSyntax: true}),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    let output = [];
    let loaders = exports.cssLoaders(options);

    Object.keys(loaders).forEach(function (extension) {
        let loader = loaders[extension];
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        });
    });
    return output;
};

// 在pageDir中寻找各个页面入口
exports.getEntries = function (pageDir, entryPath) {
    var entry = {};
    var pageDirPath = path.join(__dirname, '..', pageDir);
    fs.readdirSync(pageDirPath)
        // 发现文件夹，就认为是页面模块
        .filter(function (f) {
            return fs.statSync(path.join(pageDirPath, f)).isDirectory();
        })
        .forEach(function (f) {
            entry[path.basename(f)] = [pageDir, f, entryPath].join('/');
        });
    return entry;
};
