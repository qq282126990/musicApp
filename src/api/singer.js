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
export function getSingerDetail (param) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';

    const data = Object.assign({}, commonParams, {
        uin: 1020989782,
        platform: 'h5page',
        needNewCode: 1,
        order: 'listen',
        from: 'h5',
        begin: 0
    }, param);

    return jsonp(url, data, options)
}
