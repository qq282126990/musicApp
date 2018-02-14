/** 映射 **/

/** 滚动组件状态 **/
// 滚动的状态
export const probeType = state => state.probeType;
// 分发点击事件
export const click = state => state.click;
// 滚动组件外部传入的数据
export const scrollData = state => state.scrollData;
// croll 要不要监听滚动事件
export const listenScroll = state => state.listenScroll;
// 是否开启滚动到到底部刷新
export const pullup = state => state.pullup;
// 开始滚动
export const beforeScroll = state => state.beforeScroll;
// 刷新延迟
export const refreshDelay = state => state.refreshDelay;
// 是否开启回弹效果
export const bounce = state => state.bounce;
// 回弹时间
export const bounceTime = state => state.bounceTime;
/***************/
