/**
 * 更改状态  同步操作
 */
import * as types from './mutation-types';

const mutations = {
    /**
     * 设置是否显示搜索框
     * @type {Array}
     */
     [types.SET_SHOW_SEARCH](state, showSearch) {
        state.showSearch = showSearch;
     },
    /**
     * 是否显示更多按钮
     * @type {Array}
     */
     [types.SET_SHOW_MORE](state, showMore) {
        state.showMore = showMore;
     },
    /** *************播放组件状态********************** **/
    /**
     * 歌曲列表
     * @type {Array}
     */
     [types.SET_SONG_LIST](state, songList) {
        state.songList = songList;
     },
    /**
     * 顺序播放列表
     * @type {Array}
     */
     [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list;
     },
    /**
     * 获取播放列表
     * @type {Array}
     */
     [types.SET_PLAYLIST](state, list) {
        state.playList = list;
     },
    /**
     * 当前播放索引
     * @type {Number}
     */
     [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index;
     },
    /**
     * 控制歌曲播放
     * @type {Boolean}
     */
     [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag;
     },
    /*
     * 控制播发器放大缩小
     * @type {Boolean}
     * */
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag;
    },
    /**
     * 获取收藏歌曲列表
     * @type {Array}
     */
     [types.SET_FAVORITE_LIST](state, list) {
        state.favoriteList = list;
     },
    /*
     * 设置歌曲播放模式
     * @type {String}
     * */
    [types.SET_PLAY_MODE](state, playMode) {
        state.playMode = playMode;
    },
    /*
     * 播放历史
     * @type {String}
     * */
    [types.SET_PLAY_HISTORY](state, history) {
        state.playHistory = history
    },
    /*********************************************************/
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
    /*
     * 设置是否开启上拉加载
     * @type {Boolean}
     * */
    [types.SET_PULLUP_LOAD](state, pullUpLoad) {
        state.pullUpLoad = pullUpLoad;
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
    /** *************搜索框组件状态********************** **/
    /**
     * 获取搜索历史
     * @type {Array}
     */
    [types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history
    },
    /*********************************************************/
    /** *************排行榜组件状态********************** **/
    /**
     * 排行榜歌单
     * @type {Array}
     */
     [types.SET_RANKING_ID](state, data) {
        state.rankingId = data
     },
    /*********************************************************/
    /** *************歌手组件状态********************** **/
    /**
     * 歌手信息
     * @type {Object}
     */
        [types.SET_SINGGER_Message](state, singerMessage) {
        state.singerMessage = singerMessage
    },
    /*********************************************************/
    /** *************登录组件组件状态********************** **/
    /**
     * 是否显示登录组件
     * @type {Array}
     */
        [types.SET_SHOW_LOGIN](state, flag) {
        state.showLogin = flag
    },
    /*********************************************************/
};

export default mutations;
