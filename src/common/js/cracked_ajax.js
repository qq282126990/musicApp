import {getCookie} from './cookie';
import {commonParams} from 'api/config';

// 获取歌曲播放地址接口

export function crackedPlayingAjax(strMediaMid, songtype) {
    const comm = Object.assign({}, commonParams, {
        'uin': 0,
        'platform': 'h5',
        'needNewCode': 1
    });

    return {
        comm,
        'url_mid': {
            'module': 'vkey.GetVkeyServer',
            'method': 'CgiGetVkey',
            'param': {
                'guid': getCookie('guid'),
                'songmid': strMediaMid,
                'songtype': songtype,
                'uin': '0',
                'loginflag': 0,
                'platform': '23'
            }
        }
    };
};
