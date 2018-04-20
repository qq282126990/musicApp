import axios from 'axios';

// 用户登录接口
export function getSelectUser (param) {
    const url = 'https://linfengzhuiyi.cn:5000/serverApi/selectUser';

    return axios.post(url, param).then((res) => {
        return Promise.resolve(res.data);
    });
}

// 用户注册接口
export function getAddUser (param) {
    const url = 'http://119.29.97.214:3001/serverApi/addUser';

    return axios.post(url, param).then((res) => {
        return Promise.resolve(res.data);
    });
}

// 同步用户收藏歌曲
export function getAddFavorite (param) {
    const url = 'http://119.29.97.214:3001/serverApi/addFavorite';

    return axios.post(url, param).then((res) => {
        return Promise.resolve(res.data);
    });
}

// 同步用户最近播放歌曲到数据库接口
export function getAddPlayHistory (param) {
    const url = 'http://119.29.97.214:3001/serverApi/addPlayHistory';

    return axios.post(url, param).then((res) => {
        return Promise.resolve(res.data);
    });
}

// 获取该用户的uid判断是否在另一个地方登录接口
export function getUserUid (param) {
    const url = 'http://119.29.97.214:3001/serverApi/getUserUid';

    return axios.post(url, param).then((res) => {
        return Promise.resolve(res.data);
    });
}
