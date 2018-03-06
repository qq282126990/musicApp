const sqlMap = {
    user: {
        add: 'insert into userData(username, password) value (?,?)',
        select_name: 'SELECT * from userData where username = ?', // 查询 用户名
        select_password: 'SELECT * from userData where password = ?', // 查询 用户密码
        select_playHistory: 'SELECT * from userData where username = ? and playHistory' // 查询 用户播放历史
    }
};
module.exports = sqlMap;
