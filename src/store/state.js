import {isPlayMode} from 'common/js/config';
// 加载所有的收藏歌曲 loadFavorite
// 获取当前播放的歌曲信息 getPlayList
// 获取当前播放索引 getCurrentIndex
// 获取顺序播放列表 getSequenceList
// 获取搜索历史 loadSearchHistory
// 获取播放历史 loadPlayHistory
import {loadFavorite, getPlayList, getCurrentIndex, getSequenceList, loadSearchHistory, loadPlayHistory} from 'common/js/cache';

/**
 * 状态管理
 */
const state = {
    /**
     * 是否显示搜索层
     * @type {String}
     */
    showSearch: false,
    /** *****************播放器状态****************** **/
    /**
     * 歌曲播放模式
     * @type {String}
     */
    playMode: isPlayMode.sequence,
    /**
     * 顺序播放列表
     * @type {Array}
     */
    sequenceList: getSequenceList(),
    /**
     * 获取当前收藏列表
     * @type {Array}
     */
    favoriteList: loadFavorite(),
    /**
     * 播放列表
     * @type {Array}
     */
    playList: getPlayList(),
    /**
     * 当前播放索引
     * @type {Number}
     */
    currentIndex: getCurrentIndex(),
    /**
     * 控制歌曲播放
     * @type {Boolean}
     */
    playing: false,
    /*
     * 控制播发器放大缩小
     * @type {Boolean}
     * */
    fullScreen: false,
    // 播放历史 读取缓存的初始值
    playHistory: loadPlayHistory(),
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
    /*
     * 设置是否开启上拉加载
     * @type {Boolean}
     * */
    pullUpLoad: false,
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
    bounce: false,
    /**
     * 回弹时间
     * @type {Number}
     */
    bounceTime: 300,
    /*********************************************/
    /** *****************搜索框组件状态****************** **/
    /*
    * 获取搜索历史
    * @type {Array}
    * */
    searchHistory: loadSearchHistory(),
    /*********************************************/
    /** *****************排行榜组件状态****************** **/
    /*
     * 排行榜歌单Id
     * @type {Array}
     * */
    rankingId: {}
    /*********************************************/
};

export default state;
