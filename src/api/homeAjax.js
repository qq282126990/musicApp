import jsonp from 'common/js/jsonp';
import {commonParams, options, MusicuMessageData} from 'api/config';

// 主页数据接口
export function getHomeMessage() {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: MusicuMessageData
    });
    return jsonp(url, data);
}

// 主页精选电台导航
export function getHomeFeaturedRadio() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        channel: 'radio',
        page: 'index',
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        p: Math.random()
    });
    return jsonp(url, data, options);
}


// 主页歌单推荐刷新后的数据
export function getReplaceHomeRecomPlaylist(param) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    const stringData = {
        "comm":{
            "ct":24
        },
        "playlist":{
            "method":"get_playlist_by_category",
            "param":{
                "id": param,
                "curPage":1,
                "size":7,
                "order":5,
                "titleid":param
            },
            "module":"playlist.PlayListPlazaServer"
        }
    };



    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: JSON.stringify(stringData)
    });
    return jsonp(url, data);
}
