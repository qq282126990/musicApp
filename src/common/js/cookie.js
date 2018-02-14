// 获取cookies
export function getCookie(key) {
    if (document.cookie.length > 0) {
        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
    }
}

// 设置cookies
export function setCookie(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    // 判断有没有传入sKey 或者 没有传入其他值 就返回false
    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) {
        return false;
    }

    // 过期时间
    let sExpires = '';

    if (vEnd) {
        switch (vEnd.constructor) {
            case Number:
                sExpires = vEnd === Infinity ? '; expires=Tue, 19 Jan 2038 03:14:07 GMT' : '; max-age=' + vEnd;
                break;
            case String:
                sExpires = '; expires=' + vEnd;
                break;
            case Date:
                sExpires = '; expires=' + vEnd.toUTCString();
                break;
        }
    }
    document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
    return true;
}
