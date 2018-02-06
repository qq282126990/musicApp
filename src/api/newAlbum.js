import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'api/config';

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
* @param area id
*        sin 页数
* */
export function getNewAlbumSongList(albummid) {
    const url = 'https://shc.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg';

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
