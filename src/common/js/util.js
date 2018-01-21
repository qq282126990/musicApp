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
export function computedPlayNumber(playNumber) {
    // 如果当前播放量是1万才进行计算
    if (playNumber > 1e4) {
        playNumber = (playNumber / 1e4).toFixed(1) + '万';
    }
    return playNumber;
}
