const express = require('express');
const fs = require('fs');
const http = require('http');
const https = require('https');
const axios = require('axios');
const compression = require('compression');
const app = express();
const utils = require('./build/utils');

//尽量在其他中间件前使用compression
const privateKey = fs.readFileSync('./linfengzhuiyi.cn.key', 'utf8');
const certificate = fs.readFileSync('./1_linfengzhuiyi.cn_bundle.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
const PORT = 8081;
const SSLPORT = 443;

httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: http://localhost:%s', PORT + '/home');
});
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT + '/home');
});

app.use(compression());

app.use(express.static('./dist'));

// 处理 history API 的回退情况
app.use(require('connect-history-api-fallback')());

// 处理HTML5 history API，映射例如/home路由到/home/index.html
let rewrites = Object.keys(utils.getEntries('./src/pages', 'entry.js'))
    .map(function (entry) {
        return {
            from: new RegExp('/' + entry),
            to: '/' + entry + '/index.html'
        };
    });

app.use(require('connect-history-api-fallback')({
    htmlAcceptHeaders: ['text/html'],
    rewrites: rewrites
}));

// Welcome
app.get('/', function (req, res) {
    if (req.protocol === 'https') {
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});

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

app.use('/api', apiRoutes);
