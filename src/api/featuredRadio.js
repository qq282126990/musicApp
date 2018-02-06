import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'api/config';

/*
* 精选电台歌曲接口
* @param id 电台id
* */
export function getFeaturedRadio(param) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    const stringData = {
        'songlist': {
            'module': 'pf.radiosvr',
            'method': 'GetRadiosonglist',
            'param': {
                'id': parseInt(param),
                'firstplay': 1,
                'num': 10
            }
        }
    };

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const message = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        data: JSON.stringify(stringData)
    });

    return jsonp(url, message);
}


/*
* 个性电台歌曲接口
* @param id 电台id
* */
export function getPersonalFeaturedRadio() {
    const url = 'https://shc.y.qq.com/rcmusic2/fcgi-bin/fcg_guess_youlike_pc.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const message = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        cid: 703,
        uin: 0
    });

    return jsonp(url, message, options);
}

