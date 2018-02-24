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
var PORT = 8080;
var SSLPORT = 8081;

httpServer.listen(PORT, function () {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
httpsServer.listen(SSLPORT, function () {
    console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
});

app.use(express.static('./dist'));

// 处理HTML5 history API，映射例如/home路由到/home/index.html
let rewrites = [];
Object.keys(utils.getEntries('./src/pages', 'entry.js'))
    .forEach(entry => {
        rewrites.push({
            from: new RegExp('/'),
            to: '/' + home + '/index.html'
        });
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

// Welcome
app.get('/', function (req, res) {
    if (req.protocol === 'https') {
        res.status(200).send('Welcome to Safety Land!');
    }
    else {
        res.status(200).send('Welcome!');
    }
});
