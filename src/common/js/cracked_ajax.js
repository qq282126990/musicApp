import {getCookie} from "./cookie";

// 获取歌曲播放地址接口
/* eslint quotes: ["error", "double"] */
/* eslint-env es6 */
export function crackedPlayingAjax(strMediaMid, songtype) {
    return {
        "comm": {
            "uin": 0,
            "format": "json",
            "platform": "h5",
            "needNewCode": 1,
            "inCharset": "utf-8",
            "outCharset": "utf-8",
            "g_tk": 5381,
            "notice": 0
        },
        "url_mid": {
            "module": "vkey.GetVkeyServer",
            "method": "CgiGetVkey",
            "param": {
                "guid": getCookie("guid"),
                "songmid": strMediaMid,
                "songtype": songtype,
                "uin": "0",
                "loginflag": 0,
                "platform": "23"
            }
        }
    };
};
