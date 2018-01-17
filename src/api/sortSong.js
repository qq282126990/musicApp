import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'api/config';

// 获取分类歌单导航
export function getDissTag() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg';

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0
    });

    return jsonp(url, data, options);
}


// 获取分类歌单
export function getSortSongData (categoryId, sin, ein) {
    const url = '/api/sortSongData';
    const data = Object.assign({}, commonParams, {
        picmid: 1,
        rnd: Math.random(),
        loginUin: 0,
        hostUin: 0,
        platform: 'yqq',
        needNewCode: 0,
        sortId: 5,
        categoryId: categoryId,
        sin: sin,
        ein: ein
    });
    return axios.get(url, {
        params: data
    }).then((res) => {
        return Promise.resolve(res.data);
    });
}
