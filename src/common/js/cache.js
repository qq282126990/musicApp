import storage from 'good-storage';

// key
const SONG_SINGLE_KEY = '__songsingle__';
const FAVORITE_KEY = '__favorite__';
const NEW_SONG_SPEED_TITLE_KEY = '__newSongSpeedTitle__';
const INIT_NEW_SONG_LIST_KEY = '__initNewSongList__';
const CURRENT_SONG_KEY = '__currentSong__';
const CURRENT_INDEX_KEY = '__currentIndex__';
const PlAULIST_KEY = '__playList__';
const PLAYURL_KEY = '__playUrl__';
const SEQUENCE_LIST_KEY = '__sequenceList__';
const SEARCH_HISTORY_KEY = '__searchHistory__';
const PLAU_HISTORY_KEY = '__playHistory__'

// 收藏歌曲最大存储长度 200
const FAVORITE_MAX_LENGTH = 200;
// 搜索历史最大存储15条数据
const SEARCH_HISTORY_MAX_LENGTH = 15;
// 保存播放历史最大存储200条数据
const PLAY_HISTORY_MAX_LENGTH = 200


// 保存主页选择对应歌单的数据到本地
export function saveSongSingle (currentSong) {
    return storage.set(SONG_SINGLE_KEY, currentSong);
}

// 获取主页选择对应歌单的数据
export function getSongSingle () {
    return storage.get(SONG_SINGLE_KEY, []);
}

// 保存主页新歌模块跳转对应的模块的标题
export function saveNewSongSpeedTitle (title) {
    return storage.set(NEW_SONG_SPEED_TITLE_KEY, title);
}

// 获取主页新歌模块跳转对应的模块的标题
export function getNewSongSpeedTitle () {
    return storage.get(NEW_SONG_SPEED_TITLE_KEY, '');
}

// 保存一开始的新歌数据
export function saveInitNewSongList (data) {
    return storage.set(INIT_NEW_SONG_LIST_KEY, data);
}

// 获取一开始的新歌数据
export function getInitNewSongList () {
    return storage.get(INIT_NEW_SONG_LIST_KEY, []);
}

// 保存当前播放的歌曲信息
export function saveCurrentSong (currentSong) {
    return storage.set(CURRENT_SONG_KEY, currentSong);
}
// 获取当前播放的歌曲信息
export function getCurrentSong () {
    return storage.get(CURRENT_SONG_KEY, []);
}

// 保存播放列表
export function savePlayList (playlist) {
    return storage.set(PlAULIST_KEY, playlist);
}
// 获取当前播放的歌曲信息
export function getPlayList () {
    return storage.get(PlAULIST_KEY, []);
}

// 保存当前播放索引
export function saveCurrentIndex (index) {
    return storage.set(CURRENT_INDEX_KEY, index);
}
// 获取当前播放索引
export function getCurrentIndex () {
    return storage.get(CURRENT_INDEX_KEY, []);
}

// 保存当前播放歌曲链接
export function savePlayUrl (url) {
    return storage.set(PLAYURL_KEY, url);
}
// 获取当前播放歌曲链接
export function getPlayUrl () {
    return storage.get(PLAYURL_KEY, []);
}

// 保存顺序播放列表
export function saveSequenceList (url) {
    return storage.set(SEQUENCE_LIST_KEY, url);
}
// 获取顺序播放列表
export function getSequenceList () {
    return storage.get(SEQUENCE_LIST_KEY, []);
}

// 删除重复数据，插入新增数据  compare数组的查找方法
export function insertArray (arr, val, compare, maxLen) {
    const index = arr.findIndex(compare);
    // 如果只有一个数据符合就直接返回
    if (index === 0) {
        return;
    }
    // 删除第一个数据
    if (index > 0) {
        arr.splice(index, 1);
    }
    // 重新插入要保存的数据到第一个
    arr.unshift(val);
    // 如果存入的数据长度大于maxLen条那么就删除最后一个数据
    if (maxLen && arr.length > maxLen) {
        arr.pop();
    }
}

// 删除收藏歌曲方法 compare数组的查找方法
function deleteFromArray (arr, compare) {
    // 寻找要删除的歌曲在数组中的index索引
    const index = arr.findIndex(compare);
    // 如果数组中有该歌词索引就删除他
    if (index > -1) {
        arr.splice(index, 1);
    }
}

// 保存收藏歌曲到本地
export function saveFavorite (currentSong) {
    // 初始化数据
    let songs = storage.get(FAVORITE_KEY, []);

    // 删除重复的数据 插入新增数据
    insertArray(songs, currentSong, (item) => {
        return item.id === currentSong.id;
    }, FAVORITE_MAX_LENGTH);

    // 保存到本地
    storage.set(FAVORITE_KEY, songs);
    return songs;
}

// 删除收藏歌曲
export function deleteFavorite (currentSong) {
    // 初始化数据
    let songs = storage.get(FAVORITE_KEY, []);

    deleteFromArray(songs, (item) => {
        return currentSong.id === item.id;
    });
    storage.set(FAVORITE_KEY, songs);
    return songs;
}

// 加载所有的收藏歌曲
export function loadFavorite () {
    return storage.get(FAVORITE_KEY, []);
}

// 保存搜索历史
export function saveSearchHistory (query) {
    let searchesHistory = storage.get(SEARCH_HISTORY_KEY, []);
    insertArray(searchesHistory, query, (item) => {
        return item === query;
    }, SEARCH_HISTORY_MAX_LENGTH);
    storage.set(SEARCH_HISTORY_KEY, searchesHistory);
    return searchesHistory;
}

// 删除搜索历史
export function deleteSearchHistory (query) {
    // 获取当前的记录
    let searchesHistory = storage.get(SEARCH_HISTORY_KEY, []);
    // 删除记录
    deleteFromArray(searchesHistory, (item) => {
        return item === query;
    });
    // 保存记录
    storage.set(SEARCH_HISTORY_KEY, searchesHistory);
    return searchesHistory;
}

// 加载搜索历史
export function loadSearchHistory () {
    return storage.get(SEARCH_HISTORY_KEY, []);
}

// 清除全部搜索历史
export function clearSearchHistory () {
    storage.remove(SEARCH_HISTORY_KEY);
    return [];
}

// 保存播放历史
export function savePlayHistory (song) {
    let songs = storage.get(PLAU_HISTORY_KEY, [])
    // 删除重复的数据 插入新增数据
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_HISTORY_MAX_LENGTH)
    // 保存到本地
    storage.set(PLAU_HISTORY_KEY, songs)
    return songs
}

// 获取播放历史的本地记录
export function loadPlayHistory () {
    return storage.get(PLAU_HISTORY_KEY, [])
}
