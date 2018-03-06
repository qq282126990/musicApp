const userApi = require('./api/userApi');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');

app.use(cors({
    methods:['GET','POST'],
    alloweHeaders:['Conten-Type', 'Authorization']
}));

// Use the session middleware
app.use(session({
////这里的name值得是cookie的name，默认cookie的name是：connect.sid
    //name: 'hhw',
    secret: 'keyboard cat',
    cookie: ('name', 'value', { path: '/serverApi', httpOnly: true,secure: false, maxAge:  60000 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true,
    //强制“未初始化”的会话保存到存储。
    saveUninitialized: true,

}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// 后端api路由
app.use('/serverApi', userApi);
// 监听端口
app.listen(3001);
console.log('success listen at port.....');
