/**
 * @file 开发环境服务端
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

/* eslint-disable no-console */

'use strict';

require('./check-versions')();
const config = require('../config');

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

const opn = require('opn');
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const proxyMiddleware = require('http-proxy-middleware');
const webpackConfig = require('./webpack.dev.conf');
const utils = require('./utils');

// 默认调试服务器端口
let port = process.env.PORT || config.dev.port;

// 启动调试服务器时是否自动打开浏览器，默认为 false
let autoOpenBrowser = !!config.dev.autoOpenBrowser;

let app = express();
let compiler = webpack(webpackConfig);

let devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: true
});

let noop = function () {};
let hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: noop
});

// 当 html-webpack-plugin 的模版文件更新的时候，强制重新刷新调试页面
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        });
        cb();
    });
});

// 指定需要代理的请求列表
let proxyTable = config.dev.proxyTable;

// 代理请求
Object.keys(proxyTable).forEach(function (context) {
    let options = proxyTable[context];
    if (typeof options === 'string') {
        options = {
            target: options
        };
    }
    app.use(proxyMiddleware(options.filter || context, options));
});

// 处理HTML5 history API，映射例如/home路由到/home/index.html
let rewrites = [];
Object.keys(utils.getEntries('./src/pages', 'entry.js'))
    .forEach(entry => {
        rewrites.push({
            from: new RegExp('/' + entry),
            to: '/' + entry + '/index.html'
        });
        // 额外插入skeleton路由
        rewrites.push({
            from: new RegExp('/skeleton-' + entry),
            to: '/' + entry + '/index.html'
        });
    });

app.use(require('connect-history-api-fallback')({
    htmlAcceptHeaders: ['text/html'],
    rewrites: rewrites
}));

// 服务器部署 webpack 打包的静态资源
app.use(devMiddleware);

// 使用热更新， 如果编译出现错误会实时展示编译错误
app.use(hotMiddleware);

// 纯静态资源服务
let staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
app.use(staticPath, express.static('./static'));

let uri = 'http://localhost:' + port + '/home';

let newResolve;
let readyPromise = new Promise(function (resolve) {
    newResolve = resolve;
});

console.log('> Starting dev server...');

devMiddleware.waitUntilValid(function () {
    console.log('> Listening at ' + uri + '\n');

    // 当测试环境下，不需要打开浏览器
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
        opn(uri);
    }
    newResolve();
});

let server = app.listen(port);
let closeServer = function () {
    server.close();
};
module.exports = {
    ready: readyPromise,
    close: closeServer
};
