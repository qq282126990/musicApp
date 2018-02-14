/**
 * 更改状态  同步操作
 */
import * as types from './mutation-types';

const mutations = {
    /** *************滚动组件的状态********************** **/
    /**
     * 滚动的状态
     * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
     * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
     * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
     * @type {Number}
     */
    [types.SET_PROBETYPE](state, probeType) {
        state.probeType = probeType;
    },
    /**
     * 分发点击事件
     * @type {Boolean}
     */
    [types.SET_CLICK](state, click) {
        state.click = click;
    },
    /**
     * 外部传入的数据
     * @type {Array}
     */
    [types.SET_SCROLL_DATA](state, scrollData) {
        state.scrollData = scrollData;
    },
    /**
     * scroll 要不要监听滚动事件
     * @type {Boolean}
     */
    [types.SET_LISTEN_SCROLL](state, listenScroll) {
        state.listenScroll = listenScroll;
    },
    /**
     * 是否开启滚动到到底部刷新
     * @type {Boolean}
     */
    [types.SET_PULLUP](state, pullup) {
        state.pullup = pullup;
    },
    /**
     * 开始滚动
     * @type {Boolean}
     */
    [types.SET_BEFORE_SCROLL](state, beforeScroll) {
        state.beforeScroll = beforeScroll;
    },
    /**
     * 刷新延迟
     * @type {Number}
     */
    [types.SET_REFRESH_DELAY](state, refreshDelay) {
        state.refreshDelay = refreshDelay;
    },
    /**
     * 是否开启回弹效果
     * @type {Boolean}
     */
    [types.SET_BOUNCE](state, bounce) {
        state.bounce = bounce;
    },
    /**
     * 回弹时间
     * @type {Number}
     */
    [types.SET_BOUNCE_TIME](state, bounceTime) {
        state.bounceTime = bounceTime;
    },
    /*********************************************************/
};

export default mutations;
