const musicApi = require('./api/musicApi');
const express = require('express');
const config = require('../config/index');
const app = express();

// 后端api路由
app.use('/api', musicApi);

app.use(express.static('./dist'));

// 处理 history API 的回退情况
app.use(require('connect-history-api-fallback')());

var port = config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
