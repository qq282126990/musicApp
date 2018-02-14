import axios from 'axios';
import {getCookie} from 'common/js/cookie';
import {commonParams} from 'api/config';

/*
 * 获取歌曲列表播放地址
 * @param {String}
 * */
export function getSongListPlayingUrl (param) {
    const url = '/api/getSongListPlayingUrl';

    return axios.post(url,
        createdSongListParam(param)
    ).then((res) => {
        return Promise.resolve(res.data);
    });
}

/**
 * 处理歌曲列表 param
 * @param {Object}
 */
function createdSongListParam (list) {
    let strMediaMid = [];
    let songtype = [];
    if (!list) {
        return;
    }
    list.forEach((data) => {
        if (data) {
            strMediaMid.push(`${data.mid}`);
            songtype.push(0);
        }
    });
    return crackedUrl(strMediaMid, songtype);
}

// 获取歌曲播放地址接口
function crackedUrl (strMediaMid, songtype) {
    const comm = Object.assign({}, commonParams, {
        'uin': 0,
        'platform': 'h5',
        'needNewCode': 1
    });

    return {
        comm,
        'url_mid': {
            'module': 'vkey.GetVkeyServer',
            'method': 'CgiGetVkey',
            'param': {
                'guid': getCookie('guid'),
                'songmid': strMediaMid,
                'songtype': songtype,
                'uin': '0',
                'loginflag': 0,
                'platform': '23'
            }
        }
    };
};

/*
 * 获取歌曲单曲播放地址
 * songmid // 歌曲mid
 * */
export function getSinglePlayingUrl (songmid) {
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
export function getLyric (songmid) {
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
