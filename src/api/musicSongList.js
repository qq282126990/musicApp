import {commonParams} from 'api/config';
import axios from 'axios';

export function getSongList(disstid) {
    const url = '/api/getSongList';

    const data = Object.assign({}, commonParams, {
        disstid,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        hostUin: 0,
        platform: 'yqq',
        format: 'json',
        needNewCode: 0,
        song_num: 15 // 一次加载15条数据
    });

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
};
