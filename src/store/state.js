/**
 * 状态管理
 */
const state = {
    /** *****************滚动组件状态****************** **/
    /**
     * 滚动的状态
     * 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
     * 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
     * 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
     * @type {Number}
     */
    probeType: 1,
    /**
     * 分发点击事件
     * @type {Boolean}
     */
    click: true,
    /**
     * 滚动组件外部传入的数据
     * @type {Array}
     */
    scrollData: null,
    /**
     * scroll 要不要监听滚动事件
     * @type {Boolean}
     */
    listenScroll: false,
    /**
     * 是否开启滚动到到底部刷新
     * @type {Boolean}
     */
    pullup: false,
    /**
     * 开始滚动
     * @type {Boolean}
     */
    beforeScroll: false,
    /**
     * 刷新延迟
     * @type {Number}
     */
    refreshDelay: 20,
    /**
     * 是否开启回弹效果
     * @type {Boolean}
     */
    bounce: true,
    /**
     * 回弹时间
     * @type {Number}
     */
    bounceTime: 300,
    /*********************************************/
};

export default state;
