/**
 * @file app shell mutation types
 * @author jianzhongmin(282126990@qq.com)
 */

export const ENABLE_PAGE_TRANSITION = 'ENABLE_PAGE_TRANSITION';
export const DISABLE_PAGE_TRANSITION = 'DISABLE_PAGE_TRANSITION';
export const SET_PAGE_SWITCHING = 'SET_PAGE_SWITCHING';
export const SET_PAGE_TRANSITION_NAME = 'SET_PAGE_TRANSITION_NAME';
export const SET_APP_HEADER = 'SET_APP_HEADER';
export const SET_APP_BOTTOM_NAV = 'SET_APP_BOTTOM_NAV';
export const ACTIVATE_APP_BOTTOM_NAV = 'ACTIVATE_APP_BOTTOM_NAV';
export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY';
export const SAVE_SCROLLTOP = 'SAVE_SCROLLTOP';

export const SET_HOME_SONG_LIST = 'SET_HOME_SONG_LIST';  // 歌曲列表数据
export const SET_SLIDER = 'SET_SLIDER'; // 轮播图数据
export const SET_DIGITAL_ALBUM = 'SET_DIGITAL_ALBUM'; // 数字专辑数据
export const SET_FEATERED_RADIO = 'SET_FEATERED_RADIO'; // 精选电台数据
export const SET_RECOMMEND = 'SET_RECOMMEND'; // 精选电台数据

export const SET_MASKLAYER = 'SET_MASKLAYER'; // 设置遮罩层显示隐藏
export const SET_SONG_BEGIN = 'SET_SONG_BEGIN'; // 歌曲列表接口一次请求的页数 一次 +15

// 滚动组件状态
export const SET_PROBETYPE = 'SET_PROBETYPE'; // 分发点击事件
export const SET_CLICK = 'SET_CLICK'; // 分发点击事件
export const SET_DATA = 'SET_DATA'; // 外部传入的数据
export const SET_LISTEN_SCROLL = 'SET_LISTEN_SCROLL'; // scroll 要不要监听滚动事件
export const SET_PULLUP = 'SET_PULLUP'; // 是否开启滚动到到底部刷新
export const SET_BEFORE_SCROLL = 'SET_BEFORE_SCROLL'; // 是否开启滚动
export const SET_REFRESH_DELAY = 'SET_REFRESH_DELAY'; // 刷新延迟
export const SET_BOUNCE = 'SET_BOUNCE'; // 是否开启回弹效果
export const SET_BOUNCE_TIME = 'SET_BOUNCE_TIME'; // 回弹时间

// 歌曲列表状态
export const SET_SONG_LIST_DATA = 'SET_SONG_LIST_DATA'; // 获取歌曲列表原始数据
export const SET_SONG_LIST_MESSAGE = 'SET_SONG_LIST_MESSAGE'; // 获取歌曲列表信息
export const SET_SONG_LIST = 'SET_SONG_LIST'; // 获取歌曲列表

// 播放器组件状态
export const SET_PLAYLIST = 'SET_PLAYLIST'; // 获取播放列表
export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'; // 顺序播放列表
export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'; // 当前播放索引
export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'; // 控制歌曲播放
export const SET_FULL_SCREEN = 'SET_FULL_SCREEN'; // 控制播发器放大缩小
export const SET_PLAY_MODE = 'SET_PLAY_MODE'; // 设置歌曲播放模式
export const SET_FAVORITE_LIST = 'SET_FAVORITE_LIST'; // 获取收藏歌曲列表

// 分类歌单状态
export const SET_DISS_NAVIGATE = 'SET_DISS_NAVIGATE'; // 分类歌单标题
export const SET_SORT_SONG_DATA = 'SET_SORT_SONG_DATA'; // 获取分类歌单推荐歌单信息
export const SET_SORT_SONG_DATA_OK = 'SET_SORT_SONG_DATA_OK'; // 获取分类歌单推荐歌单信息请求是否完成

// 新歌速递模块状态
export const SET_NEW_SONG_LIST = 'SET_NEW_SONG_LIST'; // 新歌速递模块数据
export const SET_NEW_SONG_LIST_TITLE = 'SET_NEW_SONG_LIST_TITLE'; // 新歌速递模块点击内容标题
export const SET_SWITCH_NEW_SONG_LIST_TITLE = 'SET_SWITCH_NEW_SONG_LIST_TITLE'; // 新歌速递模块点击内容标题 对应type的数据
