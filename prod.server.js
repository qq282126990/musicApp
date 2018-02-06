var express = require('express')
var config = require('./config/index')
var axios = require('axios')

const app = express()

const apiRoutes = express.Router()

// 获取歌曲列表
apiRoutes.get('/getSongList', function (req, res) {
    var url = 'https://shc.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
    axios.get(url, {
        headers: {
            referer: 'https://shc.y.qq.com/',
            host: 'shc.y.qq.com'
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
    var url = 'https://shc.y.qq.com/3gmusic/fcgi-bin/3g_dir_order_uinlist';

    axios.get(url, {
        headers: {
            referer: 'https://shc.y.qq.com/',
            host: 'shc.y.qq.com'
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

apiRoutes.post('/getSongPlayingUrl', function (req, res) {

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

    var url = 'https://shc.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

    axios.get(url, {
        headers: {
            referer: 'https://shc.y.qq.com/',
            host: 'shc.y.qq.com'
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

// 获取分类歌单歌曲
apiRoutes.get('/sortSongData', function (req, res) {

    var url = 'https://shc.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg';

    axios.get(url, {
        headers: {
            referer: 'https://shc.y.qq.com/',
            host: 'shc.y.qq.com'
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

    var url = 'https://shc.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';

    axios.get(url, {
        headers: {
            referer: 'https://shc.y.qq.com/',
            host: 'shc.y.qq.com'
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

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

app.use(require('connect-history-api-fallback')());

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
