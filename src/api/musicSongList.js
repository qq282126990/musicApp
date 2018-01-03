import {commonParams} from 'api/config';
import axios from 'axios';

export function getSongList(disstid, songBegin) {
    const url = '/api/getSongList';

    const data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        nosign: 1,
        notice: 0,
        onlysong: 0,
        hostUin: 0,
        platform: 'yqq',
        format: 'json',
        pic: 500,
        needNewCode: 0,
        song_begin: songBegin, // 最大条数
        song_num: 15 // 一次加载15条数据
    });

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
};

// 专辑收藏量
export function getCollection(disstid) {
    const url = '/api/getCollection';

    const data = Object.assign({}, commonParams, {
        disstid,
        g_tk: 1866868671,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 322,
        nocompress: 1
    });

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}
