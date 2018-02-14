/** 异步更改 **/
import * as types from './mutation-types';

/** *****************滚动组件的状态*********************** **/
/**
 * 滚动的状态
 * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
 * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
 * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
 * @type {Number}
 */
export const probeType = function ({commit}, probeType) {
    commit(types.SET_PROBETYPE, probeType);
};

/**
 * 分发点击事件
 * @type {Boolean}
 */
export const click = function ({commit}, click) {
    commit(types.SET_CLICK, click);
};

/**
 * 滚动组件外部传入的数据
 * @type {Array}
 */
export const scrollData = function ({commit}, scrollData) {
    commit(types.SET_SCROLL_DATA, scrollData);
};

/**
 * scroll 要不要监听滚动事件
 * @type {Boolean}
 */
export const listenScroll = function ({commit}, listenScroll) {
    commit(types.SET_LISTEN_SCROLL, listenScroll);
};

/**
 * 是否开启滚动到到底部刷新
 * @type {Boolean}
 */
export const pullup = function ({commit}, pullup) {
    commit(types.SET_PULLUP, pullup);
};

/**
 * 开始滚动
 * @type {Boolean}
 */
export const beforeScroll = function ({commit}, beforeScroll) {
    commit(types.SET_BEFORE_SCROLL, beforeScroll);
};

/**
 * 刷新延迟
 * @type {Number}
 */
export const refreshDelay = function ({commit}, refreshDelay) {
    commit(types.SET_REFRESH_DELAY, refreshDelay);
};

/**
 * 是否开启回弹效果
 * @type {Boolean}
 */
export const bounce = function ({commit}, bounce) {
    commit(types.SET_BOUNCE, bounce);
};

/**
 * 回弹时间
 * @type {Boolean}
 */
export const bounceTime = function ({commit}, bounceTime) {
    commit(types.SET_BOUNCE_TIME, bounceTime);
};
/********************************************/
