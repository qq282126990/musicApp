// 获取cookies
export function getCookies(key) {
    if (document.cookie.length>0) {
        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' +
                encodeURIComponent(key).replace(/[\-\.\+\*]/g, '\\$&') +
                '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
    }
    else {
        return '当前没有cookies';
    }
}

// 设置cookies
export function setCookies() {

}
//guid =  Math.round(2147483647 * Math.abs(Math.random() - 1)) * (new Date).getUTCMilliseconds() % 1e10
