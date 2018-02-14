// 自定义定义歌单信息
class Songsingle {
    constructor ({contentId, cover, rcmdtemplate, title, start, mid, publicTime}) {
        // 歌单id
        this.contentId = contentId;
        // 歌单图片
        this.cover = cover;
        // 歌单头部标题
        this.rcmdtemplate = rcmdtemplate;
        // 歌单标题
        this.title = title;
        // 状态设置是不是新碟跳转
        this.start = start;
        // 专辑mid
        this.mid = mid;
        // 专辑发行时间
        this.publicTime = publicTime;
    };
};

// 创建歌单信息
export function createSongSingle (data) {
    return new Songsingle({
        // 歌单id
        contentId: data.content_id || data.dissid,
        // 歌单图片
        cover: data.cover || data.imgurl,
        // 歌单头部标题
        rcmdtemplate: data.rcmdtemplate || '歌单推荐',
        // 歌单标题
        title: data.title || data.dissname,
        // 状态设置是不是新碟跳转
        start: data.start || null,
        // 专辑mid
        mid: data.mid || null,
        // 专辑发行时间
        publicTime: data.publicTime || null
    });
};
