/**
 * @file 开发环境服务端
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
const axios = require('axios');

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

let noop = function () {
};
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
const apiRoutes = express.Router();

// 获取歌单专辑信息
apiRoutes.get('/getSongAlbumMessage', function (req, res) {
    var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
        }
        res.json(ret);
    }).catch((e) => {
        console.log(e);
    });
});

// 获取收藏量
apiRoutes.get('/getCollection', function (req, res) {
    var url = 'https://c.y.qq.com/3gmusic/fcgi-bin/3g_dir_order_uinlist';

    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
        }
        res.json(ret);
    }).catch((e) => {
        console.log(e);
    });
});

// 获取歌曲播放地址
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
axios.defaults.withCredentials = true;
apiRoutes.post('/getSongListPlayingUrl', function (req, res) {

    // 获取请求的 body payload 转换成字符串
    var data = JSON.stringify(req.body).replace(/[\\]/g, '');

    var url = '';

    axios.post(url, data).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
        }
        res.json(ret);
    }).catch((e) => {
        console.log(e);
    });
});

// 获取歌曲列表的单个播放地址
apiRoutes.get('/getSinglePlayingUrl', function (req, res) {

    var url = '';

    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
            res.json(ret);
        }
    }).catch((e) => {
        console.log(e);
    });
});

// 获取歌曲歌词
apiRoutes.get('/lyric', function (req, res) {

    var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';

    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
            res.json(ret);
        }
    }).catch((e) => {
        console.log(e);
    });
});

// 获取全部数字专辑数据
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
axios.defaults.withCredentials = true;

apiRoutes.post('/getTotalDigitalAlbum', function (req, res) {

    // 获取请求的 body payload 转换成字符串
    var data = JSON.stringify(req.body).replace(/[\\]/g, '');

    var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    axios.post(url, data).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
        }
        res.json(ret);
    }).catch((e) => {
        console.log(e);
    });
});

// 获取更多数字专辑数据
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
axios.defaults.withCredentials = true;

apiRoutes.post('/getMoreAlbumList', function (req, res) {

    // 获取请求的 body payload 转换成字符串
    var data = JSON.stringify(req.body).replace(/[\\]/g, '');

    var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    axios.post(url, data).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
        }
        res.json(ret);
    }).catch((e) => {
        console.log(e);
    });
});

// 获取分类歌单歌曲
apiRoutes.get('/sortSongData', function (req, res) {

    var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';

    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
            res.json(ret);
        }
    }).catch((e) => {
        console.log(e);
    });
});


// 获取歌曲列表的单个播放地址
apiRoutes.get('/getSongDownloadUrl', function (req, res) {

    var url = '';

    axios.get(url, {
        responseType: 'blob',
        headers: {
            referer: 'http://isure.stream.qqmusic.qq.com/',
            host: 'isure.stream.qqmusic.qq.com'
        },
        params: req.query
    }).then((response) => {
        var ret = response.data;
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/;
            var matches = ret.match(reg);
            if (matches) {
                ret = JSON.parse(matches[1]);
            }
            res.json(ret);
        }
    }).catch((e) => {
        console.log(e);
    });
});

app.use('/api', apiRoutes);

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
