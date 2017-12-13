var express = require('express')
var config = require('./config/index')
var axios = require('axios')

const app = express()

const apiRoutes = express.Router()

apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.get('/disc', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

apiRoutes.post('/music', function (req, res) {
  var url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  var data = `{"comm":{"g_tk":911376100,"uin":0,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"url_mid":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"7026557876","songmid":["002lSUhO4Z4J1o","00231NP41zL4Jd","003QMt9F3WhmXS","000o6TZh3WKHHe","003ytKHL3lZqpE","003BBDlj3apipE","001zPXgE3Mq4Hm","003MrQIy0C4Xee","0039VHwu2TBKM4","002XHFqB0q6H08","004InPKZ0BA2ad","004bP9bf35Nxk0","002ojKjE18591X","003zuSlO39UqQv","0018DHqG43ZW79","002hOotB1sdXoz","000MoKYA1AUJp3","002jx7ac1oHPEK","004A9V8h0LAy4C","000IW6FU1wR8bL","0029J46O26I51Q","002bLrs739BfG8","002CQ7e82p2SCl","000UurX744Ro8M","003J4Xjo1NJvck","0046EePJ1xIkd1","001QmpNG0u5N0z","000duyvA356pZf","0025vIrp10BG6f","0024POdg0yDf2A","000F77aS1qltR6","000s8Stn2Mtxn0","003ojkx92JQyP0","002JRUUh0PeZOQ","003urQpi3jXSwq","002ZJJXz3wPK24","0010Tp8Y23y5U5","003dzz1x1Z55ya","004BnZQK1jhExG","000DKlIm46NhD9","000yS5cQ1D6WNQ","002ZjNvq4g6pkC","004EkUyf2jSgJI","000sdoEZ3YLNPS","0028RZ5J23LCUl","0028HmYj2y5dYa","0044WNkN2hpaJ7","004URdXc1oOUPZ","002daqnB3lFTzR","003zPTbh3cwhi7"],"songtype":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"uin":"282126990","loginflag":1,"platform":"23"}}}`

  axios.post(url, data).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.PORT || config.build.port

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
