import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

// 获取歌手列表接口
export function getSingerList () {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

    const data = Object.assign({}, commonParams, {
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    });

    return jsonp(url, data, options)
}

// 歌手歌曲列表
export function getSingerDetail (singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

    const data = Object.assign({}, commonParams, {
        singerid: singerId,
        uin: 0,
        platform: 'h5page',
        needNewCode: 1,
        order: 'listen',
        from: 'h5',
        num: 15,
        begin: 0
    });

    return jsonp(url, data, options)
}

format:json
inCharset:utf-8
outCharset:utf-8
notice:0
platform:h5page
needNewCode:1
order:listen
from:h5
num:15
begin:0
