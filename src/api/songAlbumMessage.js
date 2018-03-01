import {commonParams} from 'api/config';
import axios from 'axios';

/*
 * 获取歌单专辑信息
 * 该接口下拉加载时传入的参数
 * songBegin
 * song_begin: songBegin, // 最大条数
 * song_num: 15 // 一次加载15条数据
 * pic: 500
 * */
export function getSongAlbumMessage (dissid, songBegin) {
    const url = '/api/getSongAlbumMessage';

    const data = Object.assign({}, commonParams, {
        disstid: dissid,
        song_begin: songBegin,
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        new_format: 1,
        pic: 500,
        type: 1,
        json: 1,
        utf8: 1,
        onlysong: 0,
        nosign: 1,
        song_num: 15,
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        let ret = res.data;
        // 如果data是字符串就转换成对象
        if (typeof ret === 'string') {
            ret = ret.replace(/jsonCallback\(/g, '').slice(0, -1);

            return Promise.resolve(JSON.parse(ret));
        }
        else {
            return Promise.resolve(ret);
        }
    });
};

/*
 * 歌单专辑收藏量
 * disstid // 专辑id
 * */
export function getCollection (disstid) {
    const url = '/api/getCollection';

    const data = Object.assign({}, commonParams, {
        disstid,
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
