var express = require('express');
var axios = require('axios');
var app = express();
var fs = require('fs');
var http = require('http');
var https = require('https');
var utils = require('./build/utils');

var privateKey = fs.readFileSync('./linfengzhuiyi.cn.key', 'utf8');
var certificate = fs.readFileSync('./1_linfengzhuiyi.cn_bundle.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
var PORT = 80;
var SSLPORT = 443;

httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});


// 处理HTML5 history API，映射例如/home路由到/home/index.html
let rewrites = [];
Object.keys(utils.getEntries('./src/pages', 'entry.js'))
    .forEach(entry => {
        rewrites.push({
            from: new RegExp('/' + entry),
            to: '/' + entry + '.html'
        });
        // 额外插入skeleton路由
        rewrites.push({
            from: new RegExp('/skeleton-' + entry),
            to: '/' + entry + '.html'
        });
    });

app.use(require('connect-history-api-fallback')({
    htmlAcceptHeaders: ['text/html'],
    rewrites: rewrites
}));

app.use(express.static('./dist'));

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
var apiRoutes = express.Router();

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

// 获取歌曲列表的单个播放地址
apiRoutes.get('/getSinglePlayingUrl', function (req, res) {

    var url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

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

app.use('/api', apiRoutes);


app.use('/',function(req,res,next){
    if (req.hostname === 'linfengzhuiyi.cn') {
        return res.redirect(302, 'https://linfengzhuiyi.cn/home')
    }
    next();
});
