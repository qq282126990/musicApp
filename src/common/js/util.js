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


/**
 * 下载文件方法
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 */
export function downloadFile (downloadUrl, filename) {
    var saveLink = document.createElement( 'a');
    saveLink.href = downloadUrl;
    saveLink.download = filename;
    saveLink.click();


    // let blob = new Blob([downloadUrl], {type: 'audio/mpeg'});
    //
    // saveAs(blob, filename);
}

/**
 * 获取文件 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
function getBlob (url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            }
        };

        xhr.send();
    });
}

/**
 * 保存文件
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs (blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        const link = document.createElement('a');
        const body = document.querySelector('body');

        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = 'none';
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
    }
}
