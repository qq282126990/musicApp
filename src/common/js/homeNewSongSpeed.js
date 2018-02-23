export default class HomeNewSongSpeed {
    constructor ({status, name, id, albumName, singerName}) {
        this.status = status;
        this.name = name;
        this.id = id; // 专辑id
        this.cover = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${id}.jpg?max_age=2592000`;
        this.albumName = albumName; // 专辑名称
        this.singerName = singerName; // 歌手名
        this.title = this.albumName + ' - ' + this.singerName;
    }
};

// 主页新歌速递模块数据
export function createHomeNewSongSpeed (newSong, newAlbum) {
    let ret = [];
    let items = {};

    newSong.forEach((item) => {

        items = (new HomeNewSongSpeed({
            status: '歌单推荐',
            name: 'newSongSpeed',
            id: item.album.mid,
            albumName: item.album.name,
            singerName: filterSinger(item.singer)
        }));

        ret.push(items);
    });

    newAlbum.forEach((item) => {

        items = (new HomeNewSongSpeed({
            status: '数字专辑',
            name: 'digitalAlbum',
            id: item.album.mid,
            albumName: item.album.name,
            singerName: filterSinger(item.author)
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
        ret.push(s.name);
    });

    return ret.join('/');
}
