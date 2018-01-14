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

// 主页新歌速递模块数据
export function createNewSong(list) {
    let items = {};

    list.forEach((item) => {
        let id = item.album_mid;
        let name = item.album_name;
        let singerName = item.singer_name;

        items = (new Song({
            id: id,
            albumName: name,
            singerName: singerName
        }));

        if (item.singer) {
            let id = item.album.mid;
            let name = item.album.name;
            let singerName = item.singer[0].name;

            items = (new Song({
                id: id,
                albumName: name,
                singerName: singerName,
                edge_mark: null
            }));
        }

        if (item.author) {
            let id = item.album.mid;
            let name = item.album.name;
            let singerName = item.author[0].name;

            items = (new Song({
                id: id,
                albumName: name,
                singerName: singerName
            }));
        }
    });
    return items;
}
