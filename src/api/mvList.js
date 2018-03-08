import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'api/config';

/*
 * 获取MV列表接口
 * type {String}
 * */
export function getNewMvList (lan) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/getmv_by_tag';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        outCharset: 'GB2312',
        platform: 'yqq',
        needNewCode: 0,
        cmd: 'shoubo',
        lan: lan
    });

    return jsonp(url, data, options);
}

/*
 * 获取对应MV的信息接口
 * type {Object}
 * */
export function getMvMessage (vid) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    let stringData = {
        "getMvInfo": {
            "module": "MvService.MvInfoProServer",
            "method": "GetMvInfoList",
            "param": {
                "vidlist": [`${vid}`]
            }
        }
    };

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        uin: 0,
        ct: 23,
        cv: 0,
        data: JSON.stringify(stringData)
    });

    return jsonp(url, data);
}

/*
 * 获取MV播放地址请求
 * type {Object}
 * */
export function getMvPlayUrl (fileid) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    let stringData = {
        "getMvUrl": {
            "module": "Mv.MvDownloadUrlServer",
            "method": "GetMvUrls",
            "param": {
                "fileid": [`${fileid}`],
                "filetype": [-1]
            }
        }
    };

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        uin: 0,
        ct: 23,
        cv: 0,
        data: JSON.stringify(stringData)
    });

    return jsonp(url, data);
}
