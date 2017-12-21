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
export function getRandomNum (min, max) {
    let range = max - min;
    return (min + Math.floor(Math.random() * range));
}
