const models = require('../db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const uuid = require('node-uuid');
const sql = require('../sqlMap.js');

// 链接数据库
// 使用createConnection创建链接
const conn = mysql.createConnection(models.mysql);

// let jsonWrite = function (res, ret) {
//     if (typeof ret === 'undefined') {
//         res.send({
//             code: -1
//         });
//     }
//     else {
//         res.send({
//             code: 0
//         });
//     }
// };

// 注册用户接口
router.post('/addUser', (req, res) => {
    // 查找用户名
    const sql_name = sql.user.select_name;
    // 添加用户
    const sql_add = sql.user.add;
    const params = req.body;

    conn.query(sql_name, params.username, function (err, result) {
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            conn.query(sql_add, [params.username, params.password], function (err, result) {
                if (err) {
                    res.send({
                        code: -1
                    }); // //查询不出username，data返回-1
                }
                else {
                    // 生成UID
                    let uid = uuid.v1();
                    uid = uid.replace(/\-/g,'');

                    // 添加uid
                    conn.query(`update userData set uid = '${uid}' where username = '${params.username}'`, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    });

                    // 添加用户完成查找该用户
                    conn.query(sql_name, params.username, function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.send({
                                code: 0,
                                data: result[0]
                            });
                        }
                    });
                }
            })
        }
        else {
            res.send({
                code: -1
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
                code: -1
            }); // //查询不出username，data返回-1
        }
        else {
            // 生成UID
            let uid = uuid.v1();
            uid = uid.replace(/\-/g,'');

            // 更新uid
            conn.query(`update userData set uid = '${uid}' where username = '${params.username}'`, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });

            // 用户登录
            conn.query(sql_password, params.password, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send({
                        code: 0,
                        data: result[0]
                    });
                }
            });
        }
    })
});

// 同步用户歌曲和最近收听数据
router.post('/addUserSongList', (req, res) => {
    // 查找用户名
    const sql_name = sql.user.select_name;
    const params = req.body;

    conn.query(sql_name, params.username, function (err, result) {
        console.log(params.username)
        if (err) {
            console.log(err);
        }
        if (result[0] === undefined) {
            res.send({
                code: -1
            }); // //查询不出username，data返回-1
        }
        else {
            // 更新用户喜欢列表
            conn.query(`update userData set favorite = '${params.favorite}' where username = '${params.username}'`, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });

            // 更新用户最近收听列表
            conn.query(`update userData set playHistory = '${params.playHistory}' where username = '${params.username}'`, function (err, result) {
                if (err) {
                    console.log(err);
                }
            });


            // 更新用户完成查找该用户
            conn.query(sql_name, params.username, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send({
                        code: 0,
                        data: result[0]
                    });
                }
            });
        }
    })
});

module.exports = router;
