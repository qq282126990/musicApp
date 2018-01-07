import axios from 'axios';

// 获取歌曲播放地址
export function getMusicuMessage(data) {
    const url = '/api/getSongPlayingUrl';

    return axios.post(url, data).then((res) => {
        return Promise.resolve(res.data);
    });
}
