// 设置随机播放列表数据
function getRandomIndex (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function shuffle (arr) {
    // 拷贝一份数据
    let _arr = arr.slice();
    // 循环洗牌
    for (let i = 0; i < _arr.length; i++) {
        let randomArr = getRandomIndex(0, i);
        let initArr = _arr[i];

        _arr[i] = _arr[randomArr];
        _arr[randomArr] = initArr;
    }
    return _arr;
}

// 节流函数
export function debounce (func, delay) {
    let timer;

    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

/**
 * 计算播放量
 * @type {String}  playNumber
 */
export function computedPlayNumber (playNumber) {
    // 如果当前播放量是1万才进行计算
    if (playNumber > 1e4) {
        playNumber = (playNumber / 1e4).toFixed(1) + '万';
    }
    return playNumber;
}
