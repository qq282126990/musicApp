import originJsonp from 'jsonp';

export default function jsonp(url, data, option) {
    // 如果url连接中没有?就添加? 有就添加&
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
    // 返回请求
    return new Promise((resolve, reject) => {
        originJsonp(url, option, (error, data) => {
            if (!error) {
                resolve(data);
            }
            else {
                reject(error);
            }
        });
    });
}

// 为url 添加参数
function param(data) {
    let url = '';
    // 遍历data参数
    for (var k in data) {
        // 保存data值
        let value = data[k] !== undefined ? data[k] : '';
        // 输出键 / 值
        url += `&${k}=${encodeURIComponent(value)}`;
    }
    return url ? url.substring(1) : '';
}
