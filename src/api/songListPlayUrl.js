import axios from 'axios';
import {getCookie} from 'common/js/cookie';
import {commonParams} from 'api/config';
import jsonp from 'common/js/jsonp';

/*
 * 获取歌曲列表播放地址
 * @param {String}
 * */
export function getSongListPlayingUrl (param) {
    const url = '/api/getSongListPlayingUrl';

    return axios.post (url,
        createdSongListParam (param)
    ).then ((res) => {
        return Promise.resolve (res.data);
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
    list.forEach ((data) => {
        if (data) {
            strMediaMid.push (`${data.mid}`);
            songtype.push (0);
        }
    });
    return crackedUrl (strMediaMid, songtype);
}

// 获取歌曲播放地址接口
function crackedUrl (strMediaMid, songtype) {
    const comm = Object.assign ({}, commonParams, {
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
                'guid': getCookie ('guid'),
                'songmid': strMediaMid,
                'songtype': songtype,
                'uin': '1020989782',
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
// export function getSinglePlayingUrl (songmid) {
//     const jsonpCallback = `${"MusicJsonCallback" + (Math.random () + "").replace ("0.", "")}`;
//     const url = '/api/getSinglePlayingUrl';
//     const data = Object.assign ({}, commonParams, {
//         jsonpCallback: jsonpCallback,
//         callback: jsonpCallback,
//         format: 'json',
//         cid: 205361747,
//         platform: 'yqq',
//         loginUin: 282126990,
//         hostUin: 0,
//         needNewCode: 0,
//         uin: 282126990,
//         songmid: songmid,
//         filename: `C4001${songmid.slice (1)}.m4a`,
//         guid: getCookie('guid')
//     });
//     return axios.get (url, {
//         params: data
//     }).then ((res) => {
//         return Promise.resolve (res.data);
//     });
// }

export function getSinglePlayingUrl (songmid) {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
    const jsonpCallback = `${"MusicJsonCallback" + (Math.random () + "").replace ("0.", "")}`;

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams,{
        jsonpCallback: jsonpCallback,
        callback: jsonpCallback,
        format: 'json',
        cid: 205361747,
        platform: 'yqq',
        loginUin: 1559482835,
        hostUin: 0,
        needNewCode: 0,
        uin: 1559482835,
        songmid: songmid,
        filename: `C4001${songmid.slice (1)}.m4a`,
        guid: getCookie('guid')
    });

    return jsonp(url, data);
}

/*
 * 获取歌曲歌词
 * songmid // 歌曲mid
 * */
export function getLyric (songmid) {
    const url = '/api/lyric';

    const data = Object.assign ({}, commonParams, {
        songmid: songmid,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        categoryId: 10000000,
        pcachetime: +new Date (),
        format: 'json'
    });

    return axios.get (url, {
        params: data
    }).then ((res) => {
        return Promise.resolve (res.data);
    });
}
