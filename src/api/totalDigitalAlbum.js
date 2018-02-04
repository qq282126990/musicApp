import axios from 'axios';
import {commonParams, options} from 'api/config';
import jsonp from 'common/js/jsonp';

// 获取全部数字专辑数据
export function getTotalDigitalAlbum () {
    const url = '/api/getTotalDigitalAlbum';

    const comm = Object.assign({}, commonParams, {
        'uin': 0,
        'platform': 'h5',
        'needNewCode': 1
    });
    const MusicHallDigitalAlbum = Object.assign({}, {
        'module': 'mall.AlbumPgcMgrServer',
        'method': 'GetMallIndexPage',
        'param': {}
    });
    const moreAlbum = Object.assign({}, {
        'module': 'mall.AlbumPgcMgrServer',
        'method': 'GetMoreAlbums',
        'param': {
            'start': 0,
            'count': 9
        }
    });
    let data = {
        comm,
        MusicHallDigitalAlbum,
        moreAlbum
    };

    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}

/*
 * 获取更多数字专辑数据
 * start // 开始位置
 * */
export function getMoreAlbumList (start) {
    const url = '/api/getMoreAlbumList';

    const comm = Object.assign({}, commonParams, {
        'uin': 0,
        'platform': 'h5',
        'needNewCode': 1
    });
    const moreAlbum = Object.assign({}, {
        'module': 'mall.AlbumPgcMgrServer',
        'method': 'GetMoreAlbums',
        'param': {
            'start': start,
            'count': 9
        }
    });

    let data = {
        comm,
        moreAlbum
    };

    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}

/*
 * 获取数字专辑音乐列表
 * id // 数字专辑id
 * */
export function getDigitalAlbumMusicList (id) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/musicmall.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        uin: 0,
        platform: 'h5',
        needNewCode: 1,
        albumid: id,
        cmd: 'get_base_sale_info',
        songlist: 1,
        desc: 1,
        singerinfo: 1,
        salecount: 1
    });

    return jsonp(url, data, options);
}
