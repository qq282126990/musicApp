import axios from 'axios';

// 获取歌曲播放地址
export function getSongPlayingUrl(data) {
    const url = '/api/getSongPlayingUrl';

    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}

export function getabcefom() {
    const url = '/api/getAFB';

    const data = Object.assign({}, {
        g_tk: 108516887,
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        format: 'json',
        cid: 205361747,
        platform: 'yqq',
        hostUin: 0,
        needNewCode: 0,
        uin: 0,
        songmid: '0004wL3529o6IZ',
        filename: 'C4001004wL3529o6IZ.m4a',
        guid: 960229400,
        callback: 'jp1'
    });

    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });

}
