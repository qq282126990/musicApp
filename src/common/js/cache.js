import storage from 'good-storage';

// key
const FAVORITE_KEY = '__favorite__';
// 收藏歌曲最大存储长度 200
const PLAY_MAX_LENGTH = 200;

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
    }, PLAY_MAX_LENGTH);

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
