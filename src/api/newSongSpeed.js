import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'api/config';
import axios from 'axios';

/*
 * 新歌速递模块点击内容标题对应type的数据
 * type // 标题类型
 * */
export function getSwitchNewSongList(type) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    let stringData = {
        'comm': {'ct': 24},
        'new_song': {
            'module': 'QQMusic.MusichallServer',
            'method': 'GetNewSong',
            'param': {
                'type': type
            }
        }
    };

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        data: JSON.stringify(stringData)
    });

    return jsonp(url, data);
}

/*
 * 新碟接口
 * @param area id
 *        sin 页数
 * */
export function getNewAlbum(param) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    const _param = Object.assign({}, param, {
        'company': -1,
        'genre': -1,
        'type': -1,
        'year': -1,
        'sort': 2,
        'get_tags': 1,
        'num': 20,
        'click_albumid': 0
    });

    const data = {
        'albumlib': {
            'method': 'get_album_by_tags',
            'param': _param,
            'module': 'music.web_album_library'
        }
    };

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const message = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: JSON.stringify(data)
    });

    return jsonp(url, message);
}

/*
 * 新碟专辑歌曲列表接口
 * @param albummid = mid
 * */
export function getNewAlbumSongList(albummid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const message = Object.assign({}, commonParams, {
        callback: 'albuminfoCallback',
        albummid: albummid,
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0
    });

    return jsonp(url, message, options);
}

/**
 * 获取全部数字专辑数据
 * */
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
 * 获取数字专辑歌曲列表
 * id // 数字专辑id
 * */
export function getDigitalAlbumSongList (id) {
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
