import axios from 'axios';

// 获取歌曲播放地址
export function getSongPlayingUrl(data) {
    const url = '/api/getSongPlayingUrl';

    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}

export function getSinglePlayingUrl(songmid) {
    const url = '/api/getSinglePlayingUrl';

    const data = Object.assign({}, {
        g_tk: 102741871,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'json',
        cid: 205361747,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        uin: 0,
        songmid: songmid,
        filename: `C400${songmid}.m4a`,
        guid: 7026557876
    });

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });

}

// jsonpCallback:MusicJsonCallback8534093002856151
// loginUin:0
// hostUin:0
// format:json
// inCharset:utf8
// outCharset:utf-8
// notice:0
// platform:yqq
// needNewCode:0
// cid:205361747
// callback:MusicJsonCallback8534093002856151
// uin:282126990
// songmid:002B0TG44SrLlF
// filename:C400000Df0wU2RlVq6.m4a
// guid:7026557876
