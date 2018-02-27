const HOT_SINGER_LEN = 10;
const HOT_NAME = '热';

export default class Singer {
    constructor ({id, name}) {
        this.id = id;
        this.name = name;
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`;
    }
}

// 自定义歌手数据
export function normalizeSinger (list) {
    let map = {
        // 创建热门数据
        hot: {
            title: HOT_NAME,
            items: []
        }
    };

    list.forEach((item, index) => {
        // 前10条数据为热门歌手
        if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer({
                name: item.Fsinger_name,
                id: item.Fsinger_mid
            }));
        }

        const key = item.Findex;

        // 设置其他歌手数据
        if (!map[key]) {
            map[key] = {
                title: key,
                items: []
            }
        }

        map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
        }));
    });

    // 为了得到有序列表，我们需要处理 map
    let ret = [];
    let hot = [];

    // 获取多有歌手数据
    for (let key in map) {
        // 把数据按照a-z 热门分别插入不同的数组
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
        }
        // 热门放到hot数组
        else if (val.title === HOT_NAME) {
            hot.push(val)
        }
    }

    ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    });

    // 把排序好的数组拼接到一开始的hot数组后面
    return hot.concat(ret);
}
