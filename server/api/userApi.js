const models = require('../db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const uuid = require('node-uuid');
const sql = require('../sqlMap.js');

// 链接数据库
// 使用createConnection创建链接
const conn = mysql.createConnection(models.mysql);

let jsonWrite = function (res, ret) {
    if (typeof ret === 'undefined') {
        res.send({
            error: -1
        });
    }
    else {
        res.send({
            code: 0
        });
    }
};

// 注册用户接口
router.post('/addUser', (req, res) => {
    // 查找用户名
    const sql_name = sql.user.select_name;
    // 添加用户
    const sql_add = sql.user.add;
    const params = req.body;

    console.log(params);
    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            conn.query(sql_add, [params.username, params.password], function (err, result) {
                if (err) {
                    res.send({
                        error: -1
                    }); // //查询不出username，data返回-1
                }
                else {
                    // jsonWrite(res, result);
                    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

                    // jsonWrite(res, result);
                    res.send({
                        code: 0,
                        username: params.username,
                        userip: ip
                    });
                }
            })
        }
        else {
            res.send({
                error: -1
            });    //当前注册username与数据库重复时，data返回-1
        }
    });
});


// 用户登录接口
router.post('/selectUser', (req, res) => {
    // 查找用户名
    const sql_name = sql.user.select_name;
    // 查找用户密码
    const sql_password = sql.user.select_password;
    const params = req.body;

    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send({
                error: -1
            }); // //查询不出username，data返回-1
        }
        else {
            conn.query(sql_password, params.password, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

                    // jsonWrite(res, result);
                    res.send({
                        code: 0,
                        username: params.username,
                        userip: ip
                    });
                }
            })
        }
    })
});

module.exports = router;
