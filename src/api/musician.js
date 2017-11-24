import jsonp from 'common/js/jsonp';
import {commonParams, options} from 'common/js/config';

export function getMusician() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  // assign将所有可枚举属性的值从一个或多个源对象复制到目标对象{}
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  });

  return jsonp(url, data, options);
}
