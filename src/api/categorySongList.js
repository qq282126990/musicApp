import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'api/config';
import axios from 'axios';

// 获取分类歌单导航
export function getCategoryNavigation () {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign ({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0
    });

    return jsonp (url, data, options);
}

/*
 * 获取分类歌单
 * categoryId // categoryId
 * sin // 开始位置
 * ein // 结束位置
 * */
export function getSortSongData (param) {
    const url = '/api/sortSongData';

    const data = Object.assign ({}, commonParams, {
        jsonpCallback: 'getPlaylist',
        picmid: 1,
        rnd: Math.random (),
        loginUin: 0,
        hostUin: 0,
        inCharset: 'utf8',
        platform: 'yqq',
        needNewCode: 0,
    }, param);

    return axios.get (url, {
        params: data
    }).then ((res) => {
        let ret = res.data;
        // 如果data是字符串就转换成对象
        if (typeof ret === 'string') {

            if (ret.match (/MusicJsonCallback\(/g)) {
                ret = ret.replace (/MusicJsonCallback\(/g, '').slice (0, -1);
            }
            else {
                ret = ret.replace (/getPlaylist\(/g, '').slice (0, -1);
            }

            return Promise.resolve (JSON.parse (ret));
        }
        else {
            return Promise.resolve (ret);
        }
    });
}
