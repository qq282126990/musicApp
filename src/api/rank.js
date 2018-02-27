import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

// 获取排行榜数据接口
export function getRankingList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return jsonp(url, data, options);
}

// 获取排行榜歌曲数据接口
export function getRankingSongList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const data = Object.assign({}, commonParams, {
    topid: topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5'
  });

  return jsonp(url, data, options);
}
