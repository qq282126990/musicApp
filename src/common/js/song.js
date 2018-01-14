export default class Song {
    constructor({id, mid, strMediaMid, singer, name, album, duration, image, url}) {
        this.id = id;
        this.mid = mid;
        this.strMediaMid = strMediaMid;
        this.singer = singer;
        this.name = name;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.url = url;
    };
};

// 创建歌曲列表
export function createSong(musicData, playingUrl, index) {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        strMediaMid: musicData.strMediaMid,
        // 歌手名称
        singer: filterSinger(musicData.singer),
        // 歌名
        name: musicData.songname,
        // 专辑名称
        album: musicData.albumname,
        // 播放时间
        duration: musicData.interval,
        // 专辑图片
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // 音乐链接
        url: `isure.stream.qqmusic.qq.com/C100${musicData.strMediaMid}.m4a`
        // url: `http://dl.stream.qqmusic.qq.com/${playingUrl.midurlinfo[index].purl}` || ''
    });
};

// musicData.singer是一个数组  过滤出singer的name
export function filterSinger(singer) {
    let ret = [];

    if (!singer) {
        return '';
    }

    singer.forEach((s) => {
        ret.push(s.name);
    });

    return ret.join('/');
};

// 对歌曲列表list数据做处理
export function normalizeSongs(list) {
    let ret = [];

    list.forEach((musicData) => {
        if (musicData) {
            ret.push(createSong(musicData));
        }
    });

    return ret;
}
