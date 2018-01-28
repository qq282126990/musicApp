import axios from 'axios';
import {getCookie} from 'common/js/cookie';
import {commonParams} from 'api/config';

// 获取歌曲播放地址
export function getSongPlayingUrl(data) {
    const url = '/api/getSongPlayingUrl';
    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}

// 获取歌曲 单曲 播放地址
export function getSinglePlayingUrl(songmid) {
    const url = '/api/getSinglePlayingUrl';
    const data = Object.assign({}, commonParams, {
        format: 'json',
        cid: 205361747,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        uin: 0,
        songmid: songmid,
        filename: `C400${songmid}.m4a`,
        guid: getCookie('guid')
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}

// 获取歌曲歌词
export function getLyric(mid) {
    const url = '/api/lyric';

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date(),
        format: 'json'
    });

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}
