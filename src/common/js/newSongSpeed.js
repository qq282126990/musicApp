// 新碟数据
class NewAlbum {
    constructor({dissid, mid, title, singerName, publicTime, start}) {
        this.dissid = dissid; // 专辑id
        this.mid = mid; // 专辑mid
        this.cover = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`;
        this.title = title; // 专辑名称
        this.singerName = singerName; // 歌手名,
        this.publicTime = publicTime; // 发行时间
        this.start = start;
    }
}

/**
 * 对新碟list数据做处理
 * @type {Array}  list
 */
export function initNewAlbumList(list) {
    let ret = [];

    let items = {};

    list.forEach((item) => {
        items = (new NewAlbum({
            dissid: item.album_id,
            mid: item.album_mid,
            title: item.album_name,
            singerName: filterSinger(item.singers),
            publicTime: item.public_time,
            start: 'newAlbum'
        }));

        ret.push(items);
    });

    return ret;
}

/*
 * singer是一个数组  过滤出singer的name
 * @type {String}
 * */
export function filterSinger(singer) {
    let ret = [];

    if (!singer) {
        return '';
    }

    singer.forEach((s) => {
        ret.push(s.singer_name);
    });

    return ret.join('/');
}
