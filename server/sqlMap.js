const sqlMap = {
    user: {
        add: 'insert into userData(username, password) value (?,?)', // 添加用户
        update_uid: 'update userData set uid = ? where username = ?', // 更新uid
        update_favorite: 'update userData set favorite = ? where username = ?', // 更新用户喜欢列表
        update_playHistory: 'update userData set playHistory = ? where username = ?', // 更新用户最近收听列表
        select_name: 'select * from userData where username = ?', // 查询 用户名
        select_password: 'select * from userData where password = ?', // 查询 用户密码
    }
};
module.exports = sqlMap;
