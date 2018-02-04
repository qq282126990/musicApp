import jsonp from 'common/js/jsonp';
import {commonParams} from 'api/config';


/*
 * 新歌速递模块点击内容标题对应type的数据
 * type // 标题类型
 * */
export function getSwitchNewSongList(type) {
    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg';

    let stringData = {
        'comm': {'ct': 24},
        'new_song': {'module': 'QQMusic.MusichallServer', 'method': 'GetNewSong', 'param': {'type': type}}
    };

    // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
    const data = Object.assign({}, commonParams, {
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        data: JSON.stringify(stringData)
    });

    return jsonp(url, data);
}


