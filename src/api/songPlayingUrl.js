import axios from 'axios';
import {getCookie} from 'common/js/cookie';
import {commonParams} from 'api/config';

/*
 * 获取歌曲播放地址
 * data // 字符串数据
 * */
export function getSongPlayingUrl(data) {
    const url = '/api/getSongPlayingUrl';
    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}

/*
 * 获取歌曲单曲播放地址
 * songmid // 歌曲mid
 * */
export function getSinglePlayingUrl(songmid) {
    const url = '/api/getSinglePlayingUrl';
    const data = Object.assign({}, commonParams, {
        jsonpCallback: 'MusicJsonCallback7776788287808083',
        callback: 'MusicJsonCallback7776788287808083',
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

/*
 * 获取歌曲歌词
 * songmid // 歌曲mid
 * */
export function getLyric(songmid) {
    const url = '/api/lyric';

    const data = Object.assign({}, commonParams, {
        songmid: songmid,
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
