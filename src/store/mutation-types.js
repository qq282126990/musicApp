/**
 * @file app shell mutation types
 * @author jianzhongmin(282126990@qq.com)
 */

export const ENABLE_PAGE_TRANSITION = 'ENABLE_PAGE_TRANSITION';
export const DISABLE_PAGE_TRANSITION = 'DISABLE_PAGE_TRANSITION';
export const SET_PAGE_SWITCHING = 'SET_PAGE_SWITCHING';
export const SET_PAGE_TRANSITION_NAME = 'SET_PAGE_TRANSITION_NAME';
export const SET_APP_HEADER = 'SET_APP_HEADER';
export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY';
export const SAVE_SCROLLTOP = 'SAVE_SCROLLTOP';


// 主页状态
export const SET_HOME_SLIDER = 'SET_HOME_SLIDER'; // 获取主页轮播图
export const SET_HOME_RECOMMEND = 'SET_HOME_RECOMMEND'; // 获取主页热门推荐导航
export const SET_HOME_NEW_SONG_SPEED = 'SET_HOME_NEW_SONG_SPEED'; // 获取主页热门推荐导航
export const SET_HOME_FEATERED_RADIO = 'SET_HOME_FEATERED_RADIO'; // 获取主页精选电台导航
export const SET_SONG_ALBUM_MESSAGE = 'SET_SONG_ALBUM_MESSAGE'; // 获取歌单专辑信息

// 新歌速递模块状态
export const SET_NEW_SONG_LIST = 'SET_NEW_SONG_LIST'; // 新歌速递模块数据
export const SET_NEW_SONG_LIST_TITLE = 'SET_NEW_SONG_LIST_TITLE'; // 新歌速递模块点击内容标题
export const SET_SWITCH_NEW_SONG_LIST_TITLE = 'SET_SWITCH_NEW_SONG_LIST_TITLE'; // 新歌速递模块点击内容标题 对应type的数据
export const SET_NEW_ALBUM = 'SET_NEW_ALBUM'; // 获取新碟数据
export const SET_MUSIC_DIGITAL_ALBUM = 'SET_MUSIC_DIGITAL_ALBUM'; // 获取全部数字专辑数据 音乐数字专辑相册
export const SET_DIGITAL_MORE_ALBUM = 'SET_DIGITAL_MORE_ALBUM'; // 更多数字专辑数据
export const SET_DIGITAL_ALBUM_SONG_LIST = 'SET_DIGITAL_ALBUM_SONG_LIST'; // 获取数字专辑歌曲列表

// 分类歌单模块
export const SET_CATEGORY_NAVIGATION = 'SET_CATEGORY_NAVIGATION'; // 获取分类歌单导航信息
export const SET_SORT_SONG_DATA = 'SET_SORT_SONG_DATA'; // 获取分类歌单歌曲信息

// 滚动组件状态
export const SET_PROBETYPE = 'SET_PROBETYPE'; // 分发点击事件
export const SET_CLICK = 'SET_CLICK'; // 分发点击事件
export const SET_SCROLL_DATA = 'SET_SCROLL_DATA'; // 滚动组件外部传入的数据
export const SET_LISTEN_SCROLL = 'SET_LISTEN_SCROLL'; // scroll 要不要监听滚动事件
export const SET_PULLUP = 'SET_PULLUP'; // 是否开启滚动到到底部刷新
export const SET_BEFORE_SCROLL = 'SET_BEFORE_SCROLL'; // 是否开启滚动
export const SET_REFRESH_DELAY = 'SET_REFRESH_DELAY'; // 刷新延迟
export const SET_BOUNCE = 'SET_BOUNCE'; // 是否开启回弹效果
export const SET_BOUNCE_TIME = 'SET_BOUNCE_TIME'; // 回弹时间

// 播放器组件状态
export const SET_SONG_LIST = 'SET_SONG_LIST'; // 获取歌曲列表
export const SET_PLAYLIST = 'SET_PLAYLIST'; // 获取播放列表
export const SET_SEQUENCE_LIST = 'SET_SEQUENCE_LIST'; // 顺序播放列表
export const SET_CURRENT_INDEX = 'SET_CURRENT_INDEX'; // 当前播放索引
export const SET_PLAYING_STATE = 'SET_PLAYING_STATE'; // 控制歌曲播放
export const SET_FULL_SCREEN = 'SET_FULL_SCREEN'; // 控制播发器放大缩小
export const SET_PLAY_MODE = 'SET_PLAY_MODE'; // 设置歌曲播放模式
export const SET_FAVORITE_LIST = 'SET_FAVORITE_LIST'; // 获取收藏歌曲列表
export const SET_PULLUP_LOAD = 'SET_PULLUP_LOAD'; // 设置是否开启上拉加载
