export default class Song {
    constructor({id, albumName, singerName}) {
        this.status = 'newSong';
        this.id = id; // 专辑id
        this.cover = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${id}.jpg?max_age=2592000`;
        this.albumName = albumName; // 专辑名称
        this.singerName = singerName; // 歌手名
        this.title = this.albumName + ' - ' + this.singerName;
    }
};
