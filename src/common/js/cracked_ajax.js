// 获取歌曲播放地址接口

export function crackedPlayingAjax(songmid, songtype) {
    return `{ 'comm': {'g_tk': 5381,'uin': 0,'format': 'json', 'inCharset': 'utf-8','outCharset': 'utf-8','notice': 0, 'platform': 'h5','needNewCode': 1},'urlMid': {'module': 'vkey.GetVkeyServer','method': 'CgiGetVkey','param': {'guid': '7026557876','songmid': [${songmid}],'songtype': [${songtype}],'uin': '0','loginflag': 0,'platform': '23'}}}`;
};
