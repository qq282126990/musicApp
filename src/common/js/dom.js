// 添加类
export function addClass(el, className) {
    if (hasClass(el, className)) {
        return;
    }

    // 分割
    let newClass = el.className.split(' ');
    // 添加
    newClass.push(className);
    // 合并
    el.className = newClass.join(' ');
}

// 查找类
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}

// 获取范围值的随机数
export function getRandomNum(min, max) {
    let range = max - min;
    return (min + Math.floor(Math.random() * range));
}

// 封装浏览器样式适配
let elementStyle = document.createElement('div').style;

let vendor = (() => {
    let transformNames = {
        webkit: 'webkitTransform',
        Moz: 'MozTransform',
        O: 'OTransform',
        ms: 'msTransform',
        standard: 'tansform'
    };

    // 遍历transformNames
    for (let key in transformNames) {
        if (elementStyle[transformNames[key]] !== undefined) {
            return key;
        }
    }

    return false;
})();

// 暴露浏览器样式适配方法
export function prefixStyle (style) {
    if (vendor === false) {
        return false;
    }

    if (vendor === 'standard') {
        return style;
    }

    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
