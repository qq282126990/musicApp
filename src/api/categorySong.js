import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'api/config';

// 分类歌单导航
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
