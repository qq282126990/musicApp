import jsonp from 'common/js/jsonp';
import {commonParams, options, MusicuMessageData} from 'api/config';

// 轮播图接口
export function getSlider() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1
    });

    return jsonp(url, data, options);
}

// 主页数据接口
export function getMusicuMessage() {
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

// 数字专辑接口
export function getDigitalAlbum() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/musicmall.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        cmd: 'pc_index_new'
    });
    return jsonp(url, data, options);
}

// 精选电台接口
export function getfeaturedRadio() {
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
