import axios from 'axios';
import jsonp from 'common/js/jsonp';

// 获取歌曲播放地址
export function getSongPlayingUrl(data) {
    const url = '/api/getSongPlayingUrl';
    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}

// 获取歌曲播放地址
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


// 获取cookie
export function getCookie() {
    const url = 'https://pingfore.qq.com/pingd';
    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, {
        dm: 'y.qq.com.hot',
        url: '',
        hottag: 'Y_NEW.GEDAN.HEADER.PLAYALL',
        hotx: 9999,
        hoty: 9999,
        rand: 27649
    });
    return jsonp(url, data);
}
