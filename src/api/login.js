import axios from 'axios';

// 用户登录接口
export function getSelectUser (param) {
    const url = 'http://119.29.97.214:3001/serverApi/selectUser';

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
