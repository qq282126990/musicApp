<template>
    <div>
        <!--放大样式-->
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterleave"
        >
            <div class="normal-player" v-show="fullScreen">
                <!--背景-->
                <div class="background">
                    <img width="100%" height="100%"
                         v-lazy="currentSong.image">
                </div>
                <!--头部-->
                <div class="header">
                    <!--返回按np钮-->
                    <div class="back" @click="back">
                        <v-icon>keyboard_arrow_down</v-icon>
                    </div>
                    <!--头部标题-->
                    <div class="title">
                        <span v-html="currentSong.name"></span>
                    </div>
                    <!--menu-->
                    <div class="menu">
                    </div>
                </div>
                <!--内容-->
                <div class="normal-player-content">
                    <!--歌手名称-->
                    <div class="sing-name">
                        <v-icon>more_horiz</v-icon>
                        <span v-html="currentSong.singer"></span>
                        <v-icon>more_horiz</v-icon>
                    </div>
                    <!--切换 dot-->
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active': currentShow==='cd'}"></span>
                        <span class="dot" :class="{'active': currentShow==='lyric'}"></span>
                    </div>
                    <!--中间内容-->
                    <div class="middle"
                         @touchstart.prevent="middleTouchStart"
                         @touchmove.prevent="middleTouchMove"
                         @touchend="middleTouchEnd"
                    >
                        <div class="middle-l" ref="middleL">
                            <!--歌曲图片-->
                            <div class="cd-wrapper" :style="{width: `${cdWrapperWidth}px`}" ref="cdWrapper">
                                <div class="cd" :class="cdCls">
                                    <img class="image"
                                         v-lazy="currentSong.image"/>
                                </div>
                            </div>
                            <!--小歌词-->
                            <div class="playing-lyric-wrapper">
                                <div class="playing-lyric">{{playingLyric}}</div>
                            </div>
                        </div>
                        <scroll class="middle-r" ref="lyricList">
                            <!--歌词-->
                            <div class="lyric-wrapper">
                                <!--自动校正歌词-->
                                <p class="auto-regulate-lyric"
                                   v-show="currentLyric"
                                   @click="autoRegulateLyric">{{autoRegulateLyricTexT}}</p>
                                <!--有歌词时才显示-->
                                <div v-if="currentLineNum">
                                    <!--歌词行-->
                                    <p class="text"
                                       ref="lyricLine"
                                       :class="{'current': currentLineNum === index}"
                                       v-for="(line, index) in currentLyric.lines"
                                    >{{line.txt}}</p>
                                </div>
                                <!--错误提示-->
                                <div v-else>
                                    <p class="text">暂无歌词</p>
                                </div>
                            </div>
                        </scroll>
                    </div>
                </div>
                <!--播放控制按钮-->
                <div class="bottom">
                    <!--播发进度-->
                    <div class="progress-wrapper">
                        <!--开始时间-->
                        <span class="time time-l">{{formatTime(currentTime)}}</span>
                        <!--进度条-->
                        <div class="progress-bar-wrapper">
                            <progress-bar :progressBar="progressBar" @percentChange="onPercentChange"></progress-bar>
                        </div>
                        <!--结束时间-->
                        <div class="time time-r">{{formatTime(currentSong.duration)}}</div>
                    </div>
                    <!--切换歌曲等按钮-->
                    <div class="operators">
                        <!--喜欢按钮-->
                        <div class="icon i-left">
                            <v-icon :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)">
                                {{getFavoriteIcon(currentSong)}}
                            </v-icon>
                        </div>
                        <!--回到上一个-->
                        <div class="icon i-left">
                            <v-icon class="skip-previous" @click="prevPlay">skip_previous</v-icon>
                        </div>
                        <!--播放按钮-->
                        <div class="i-center play">
                            <v-icon @click.stop="togglePlaying">
                                {{playing ? 'pause_circle_outline' : 'play_circle_outline'}}
                            </v-icon>
                        </div>
                        <!--下一个-->
                        <div class="icon i-right">
                            <v-icon class="skip-next" @click="nextPlay">skip_next</v-icon>
                        </div>
                        <!--切换播放模式-->
                        <div class="icon i-right play-mode" @click="changeMode">
                            <i class="iconfont" :class="iconMode"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <!--最小化样式-->
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <!--有歌曲列表时显示-->
                <transition name="playList">
                    <div class="slide" v-show="currentSong.id" :key="currentSong.id">
                        <div class="avatar">
                            <img width="100%" height="100%" v-lazy="currentSong.image" ref="miniAvatar"/>
                        </div>
                        <div class="text">
                            <h2 class="name" v-html="currentSong.name"></h2>
                            <p class="desc" v-html="currentSong.singer"></p>
                        </div>
                    </div>
                </transition>
                <!--没有歌曲列表时显示-->
                <div class="no-play-list" v-show="!currentSong.id">
                    <span>QQ音乐 听我想听得歌</span>
                </div>
                <!--播放按钮-->
                <div class="control">
                    <v-icon class="play" @click.stop="togglePlaying">
                        {{playing ? 'pause_circle_outline' : 'play_circle_outline'}}
                    </v-icon>
                </div>
                <!--播放列表按钮-->
                <div class="queue" @click.stop="showPlaylist">
                    <v-icon class="queue_music">queue_music</v-icon>
                </div>
            </div>
        </transition>
        <!--播放列表-->
        <playlist ref="playList"></playlist>
        <!--播放器-->
        <audio ref="audio"
               :src="playUrl"
               @play="ready"
               @error="error"
               @timeupdate="updateTime"
               @ended="end"></audio>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapGetters} from 'vuex';
    // 歌词解析器插件
    import Lyric from 'lyric-parser';
    import {Base64} from 'js-base64';
    // 动画插件
    import animations from 'create-keyframe-animation';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';
    // 播放歌曲进度条组件
    import ProgressBar from 'base/progress-bar/progress-bar';
    // 歌曲播放列表组件
    import Playlist from 'components/playlist/playlist';
    // 获取歌曲播放链接 获取歌词
    import {getSinglePlayingUrl, getLyric} from 'api/songPlayingUrl';
    import {ERR_OK} from 'api/config';
    // 样式兼容方法
    import {prefixStyle} from 'common/js/dom';
    // 获取播放歌曲链接cookie
    import {getCookie} from 'common/js/cookie';
    // 获取控制歌曲播放模式
    import {isPlayMode} from 'common/js/config';

    // 播放器mixin
    import {playerMixin} from 'common/js/mixin';

    // transform 兼容
    const transform = prefixStyle('transform');
    // transitionDuration 兼容
    const transitionDuration = prefixStyle('transitionDuration');
    // 歌曲链接地址头部
    const URL_HEAD = `https://dl.stream.qqmusic.qq.com`;

    export default {
        mixins: [playerMixin],
        data() {
            return {
                /**
                 * 判断歌曲是否准备好播放了
                 * type {Boolean}
                 * */
                songReady: false,
                /**
                 * 歌曲播放错误
                 * type {Boolean}
                 * */
                playError: false,
                /**
                 * 歌曲播放报错次数错误
                 * type {Number}
                 * */
                playErrorCounter: 0,
                /**
                 * 播放歌曲链接地址 mp4
                 * type {String}
                 * */
                playUrl: null,
                /**
                 * 播放歌曲Url接口 filename
                 * type {String}
                 * */
                filename: '',
                /**
                 * 播放歌曲Url接口 vkey
                 * type {String}
                 * */
                vkey: '',
                /**
                 * 获取歌曲播放时间
                 * type {Number}
                 * */
                currentTime: 0,
                /**
                 * 获取歌曲歌词
                 * type {String}
                 * */
                currentLyric: null,
                /**
                 * 获取当前歌词所在的行
                 * type {String}
                 * */
                currentLineNum: 0,
                /**
                 * 获取显示的播放歌词-小歌词
                 * type {String}
                 * */
                playingLyric: '暂无歌词',
                /**
                 * 设置切换cd和歌词的 dot 的显示
                 * type {String}
                 * */
                currentShow: 'cd'
            };
        },
        created() {
            // 用于保存手指触摸移动的坐标
            this.touch = {};
        },
        computed: {
            // 控制歌曲图片旋转
            cdCls() {
                return this.playing ? 'play' : 'play pause';
            },
            // 获取进度条进度
            progressBar() {
                return this.currentTime / this.currentSong.duration;
            },
            //  计算cdWrapper宽度
            cdWrapperWidth() {
                if (window.innerWidth >= 1024) {
                    return Math.min(600, window.innerWidth - 75);
                }
                else if (window.innerWidth >= 750) {
                    return Math.min(460, window.innerWidth - 75);
                }
                else {
                    return window.innerWidth - 75;
                }
            },
            // 自动校正歌词文字
            autoRegulateLyricTexT() {
                if (this.currentSong.lyric || this.currentLyric) {
                    if (typeof this.currentLyric.lrc === 'string') {
                        return this.currentLyric.lrc.slice(10) === '此歌曲为没有填词的纯音乐，请您欣赏' ? '此歌曲为没有填词的纯音乐，请您欣赏' : '点击自动校正歌词';
                    }
                }
            },
            ...mapGetters('appStore', [
                /*
                 * 控制播发器放大缩小
                 * @type {Boolean}
                 * */
                'fullScreen',
                /**
                 * 当前播放的歌曲信息
                 * @type {Object}
                 */
                'currentSong',
                /**
                 * 当前播放歌曲索引
                 * @type {Number}
                 */
                'currentIndex',
                /**
                 * 播放列表
                 * @type {Array}
                 */
                'playList',
                /**
                 * 获取歌曲是否播放
                 * @type {Boolean}
                 */
                'playing',
                /**
                 * 控制歌曲播放模式
                 * @type {Boolean}
                 */
                'playMode'
            ])
        },
        methods: {
            // 初始化操作
            _initDom () {
                // 默认显示cd
                this.currentShow = 'cd';
                // 设置歌词偏移的位置
                this.$refs.lyricList.$el.style[transform] = `translate3d(0,0,0)`;
                // 设置cd出现动画
                this.$refs.middleL.style.opacity = 1;

                // 默认播放没有错误
                this.playError = false;

                // 重置歌曲报错次数
                this.playErrorCounter = 0;

                // 重置播放链接
                this.playUrl = '';

                // 重置歌曲的播放时间
                this.$refs.audio.currentTime = 0;

                // 设置歌曲播放状态
                this.setPlaying(!this.playing);

                // 执行初始化歌词列表
                if (this.currentLyric) {
                    // 停止歌词滚动
                    this.currentLyric.stop();
                    // 初始化播放时间
                    this.currentTime = 0;
                    // 初始化小歌词
                    this.playingLyric = '暂无歌词';
                    // 初始化歌词行
                    this.currentLineNum = 0;
                    // 初始化歌词滚动行数
                    this.$refs.lyricList.scrollToElement(0, 1000);
                }
            },
            // 播放器放大时执行的动画 开始
            enter(el, done) {
                // 获取放大和缩小时播放器的位置
                const {x, y, scale} = this._getPosAndScale();

                // 设置动画
                let animation = {
                    0: {
                        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0,0,0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0,0,0) scale(1)`
                    }
                };

                animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400, // 执行时间
                        easing: 'linear' // 动画曲线
                    }
                });

                // 执行动画
                animations.runAnimation(this.$refs.cdWrapper, 'move', done);
            },
            // 播放器放大时执行的动画 开始后
            afterEnter() {
                // 结束动画
                animations.unregisterAnimation('move');
                this.$refs.cdWrapper.style.animation = '';
            },
            // 播放器放大时执行的动画 离开
            leave(el, done) {
                // 获取放大和缩小时播放器的位置
                const {x, y, scale} = this._getPosAndScale();

                this.$refs.cdWrapper.style.transition = `all 0.4s`;
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
                this.$refs.cdWrapper.addEventListener('transitionend', done);
            },
            // 播放器放大时执行的动画 离开后
            afterleave() {
                // 结束动画
                this.$refs.cdWrapper.style.transition = '';
                this.$refs.cdWrapper.style[transform] = '';
            },
            // 切换cd和歌词的动画 开始
            middleTouchStart(e) {
                // 设置手指触摸了的状态
                this.touch.initiated = true;
                // 用来判断是否是一次移动
                this.touch.moved = false;

                // 记录手指第一次触摸的位置
                const touch = e.touches[0];
                this.touch.startX = touch.pageX;
                this.touch.startY = touch.pageY;
            },
            // 切换cd和歌词的动画 移动中
            middleTouchMove(e) {
                // 判断手指有没有触摸有才执行下一步
                if (!this.touch.initiated) {
                    return;
                }

                // 记录手指移动中的坐标
                const touch = e.touches[0];
                // 获取移动的手指触摸开始时的坐标到移动中的坐标的距离
                const deltaX = touch.pageX - this.touch.startX;
                const deltaY = touch.pageY - this.touch.startY;

                // 判断当前触摸的Y轴是否大于X 是就不执行下一步
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    return;
                }
                if (!this.touch.moved) {
                    this.touch.moved = true;
                }

                // 获取左边可以移动的宽度
                const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
                // 获取偏移的宽度
                const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));

                // 设置当前滑动的比例
                this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
                // 设置歌词偏移的位置
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = 0;
                // 设置cd出现动画
                this.$refs.middleL.style.opacity = 1 - this.touch.percent;
                this.$refs.middleL.style[transitionDuration] = 0;
            },
            // 切换cd和歌词的动画 结束
            middleTouchEnd() {
                if (!this.touch.moved) {
                    return;
                }

                let offsetwidth;
                let opacity;

                if (this.currentShow === 'cd') {
                    // > 0.1 就滑动向左
                    if (this.touch.percent > 0.1) {
                        offsetwidth = -window.innerWidth;
                        opacity = 0;
                        this.currentShow = 'lyric';
                    }
                    else {
                        offsetwidth = 0;
                        opacity = 1;
                    }
                }
                else {
                    // > 0.9 就滑动向右
                    if (this.touch.percent < 0.9) {
                        offsetwidth = 0;
                        this.currentShow = 'cd';
                        opacity = 1;
                    }
                    else {
                        offsetwidth = -window.innerWidth;
                        opacity = 0;
                    }
                }
                const time = 300;

                // 设置歌词偏移的位置
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetwidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
                // 设置cd出现动画
                this.$refs.middleL.style.opacity = opacity;
                this.$refs.middleL.style[transitionDuration] = `${time}ms`;

                // 设置手指触摸了的状态
                this.touch.initiated = false;
            },
            // 播放器放大动画执行时调用，获取放大和缩小时播放器的位置
            _getPosAndScale() {
                // 返回元素的大小及其相对于视口的位置
                const cdWrapper = this.$refs.cdWrapper.getBoundingClientRect();
                const miniAvatar = this.$refs.miniAvatar.getBoundingClientRect();

                // 放放大时才计算坐标
                if (this.fullScreen) {
                    this.x = -((cdWrapper.right - miniAvatar.left) - (miniAvatar.width / 2 + cdWrapper.width / 2));
                    this.y = miniAvatar.top - cdWrapper.top - (cdWrapper.height / 2);
                }

                // 动画缩放比例
                const width = window.innerWidth * 0.8;
                const scale = miniAvatar.width / width;
                // 动画x轴坐标
                const x = this.x;
                // 动画y轴坐标
                const y = this.y;

                return {x, y, scale};
            },
            // 切换到缩小的播放器
            back() {
                this.setFullScreen(false);
            },
            // 切换到放大的播放器
            open() {
                // 如果没有播放歌曲就不能点击放大播放器
                if (this.playList.length === 0) {
                    return;
                }
                this.setFullScreen(true);
                // 设置歌曲播放状态
//                this.setPlaying(true);
            },
            // 显示播放列表
            showPlaylist() {
                if (!this.playList.length) {
                    return;
                }
                this.$refs.playList.show();
            },
            // 设置播放器播放
            audioPlay(data) {
                const audio = this.$refs.audio;
                this.$nextTick(() => {
                    data ? audio.play() : audio.pause();
                });
            },
            // 控制播放
            togglePlaying() {
                // 判断是否准备好播放
                if (!this.songReady) {
                    return;
                }

                // 如果没有歌曲id就直接返回不执行
                if (!this.currentSong.id) {
                    return;
                }

                // 设置歌词开始播放
                if (this.currentLyric) {
                    this.currentLyric.togglePlay();
                }

                // 设置歌曲播放状态
                this.setPlaying(!this.playing);
            },
            // 播放准备状态
            ready() {
                this.songReady = true;
            },
            // 播放器错误事件
            error() {
                console.log('播放出错了');
                // 歌曲准备状态设置为false
                this.songReady = false;

                // 设置播放器错误
                this.playError = true;

                // 设置歌曲报错次数
                this.playErrorCounter++;
            },
            // 歌曲播放完后执行
            end() {
                // 判断播放模式执行那个方法，如果是当前模式是单曲循环就执行循环播放
                if (this.playMode === isPlayMode.loop) {
                    this.loopPlay();
                }
                // 否则播放下一首
                else {
                    this.nextPlay();
                }
            },
            // 播放上一首
            prevPlay() {
                // 判断歌曲是否准备好播放
                if (!this.songReady) {
                    return;
                }

                // 判断如果只有一首歌曲
                if (this.playList.length === 1) {
                    // 设置为循环播放
                    this.loopPlay();
                }
                // 否则设置播放上一首
                else {
                    let index = this.currentIndex - 1;
                    if (index === -1) {
                        index = this.playList.length - 1;
                    }
                    // 设置上一首歌曲的索引
                    this.setCurrentIndex(index);
                    // 如果按了暂停切换下一首歌曲自动开启播放
                    if (!this.playing) {
                        this.togglePlaying();
                    }
                }
                // 设置歌曲还没准备好播放
                this.songReady = false;
            },
            // 播发下一首
            nextPlay() {
                // 判断歌曲是否准备好播放
                if (!this.songReady) {
                    return;
                }
                // 判断如果只有一首歌曲
                if (this.playList.length === 1) {
                    // 设置为循环播放
                    this.loopPlay();
                }
                // 否则设置播放下一首
                else {
                    let index = this.currentIndex + 1;
                    if (index === this.playList.length) {
                        index = 0;
                    }
                    // 设置下一首歌曲的索引
                    this.setCurrentIndex(index);
                    // 如果按了暂停切换下一首歌曲自动开启播放
                    if (!this.playing) {
                        this.togglePlaying();
                    }
                }

                // 设置歌曲还没准备好播放
                this.songReady = false;
            },
            // 单曲循环模式执行的播放方法
            loopPlay() {
                // 重置当前播放时间
                this.$refs.audio.currentTime = 0;
                // 设置播放器播放
                this.$refs.audio.play();

                // 设置歌曲播放状态
                this.setPlaying(true);

                // 单曲循环设置歌词播放行为立即播放
                if (this.currentLyric) {
                    this.currentLyric.seek(0);
                }
            },
            // 获取当前播放时间
            updateTime(e) {
                this.currentTime = e.target.currentTime;
            },
            // 计算时间搓
            formatTime(interval) {
                // 向下取整 | 0 = Math.floor
                interval = interval | 0;
                // 分
                const minute = interval / 60 | 0;

                // 秒
                const second = this._pad(interval % 60);

                return `${minute}:${second}`;
            },
            // 计算计算搓 补位两位数
            _pad(num, n = 2) {
                // 先获取字符串的长度
                let len = num.toString().length;

                // 循环len
                while (len < n) {
                    num = '0' + num;
                    len++;
                }

                return num;
            },
            // 获取当前进度条的位置设置歌曲播放时间进度
            onPercentChange(percent) {
                this.percent = percent;
                // 获取当前歌曲播放时间  = 总时长 * 进度条偏移的量
                const currentTime = this.currentSong.duration * percent;
                // 设置歌曲的播放时间
                this.$refs.audio.currentTime = currentTime;

                // 如果当前歌曲没有播放，就设置歌曲开始播放
                if (!this.playing) {
                    this.togglePlaying();
                }
                // 拖动结束设置歌词进度
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000);
                }
            },
            // 点击自动校正歌词
            autoRegulateLyric() {
                if (!this.currentSong) {
                    return;
                }

                // 停止歌词滚动
                this.currentLyric.stop();
                // 初始化播放时间
                this.currentTime = 0;
                // 初始化小歌词
                this.playingLyric = '暂无歌词';
                // 初始化歌词行
                this.currentLineNum = 0;
                // 初始化歌词滚动行数
                this.$refs.lyricList.scrollToElement(0, 1000);
                // 初始化歌词数据
                this.currentLyric = null;

                // 获取歌词
                this.getLyric(this.currentSong.mid);

                // 延迟500后重新请求歌词
                setTimeout(() => {
                    // 吧歌词滑动到对应位置
                    // 获取当前歌曲播放时间  = 总时长 * 进度条偏移的量
                    let currentTime = this.currentSong.duration * this.percent;
                    this.currentLyric.seek(currentTime * 1000);
                }, 500);
            },
            // 获取歌词
            getLyric(mid) {
                // 设置当前没有自动校正
                if (!this.currentSong) {
                    return;
                }
                // 获取歌曲歌词
                getLyric(mid).then((res) => {
                    if (res.retcode === ERR_OK) {
                        const lyric = Base64.decode(res.lyric);

                        // 设置当前的歌词
                        this.currentLyric = new Lyric(lyric, this.handleLyric);
                        // 初始化歌词行
                        this.currentLineNum = 0;
                        // 如果有歌词就设置歌词开始滚动
                        if (this.playing) {
                            this.currentLyric.play();
                        }

                        // 设置歌词滚动组件的数据
                        this.setScrollData(this.currentLyric && this.currentLyric.lines);
                    }
                }).catch(() => {
                    // 初始化歌词数据
                    this.currentLyric = null;
                    // 初始化小歌词内容
                    this.playingLyric = '暂无歌词';
                    // 重置歌词行
                    this.currentLineNum = 0;
                });
            },
            // 处理歌词方法
            handleLyric({lineNum, txt}) {
                if (!lineNum) {
                    return;
                }
                // 获取当前歌曲播放的行
                this.currentLineNum = lineNum;
                // 设置如果当前的歌词行数进行到大于5才执行滚动动画
                if (lineNum > 5 && lineNum !== undefined) {
                    let lyricLine = this.$refs.lyricLine[lineNum - 5];
                    this.$refs.lyricList.scrollToElement(lyricLine, 1000);
                }
                else {
                    this.$refs.lyricList.scrollToElement(0, 0, 0);
                }
                // 设置显示的播放歌词-小歌词
                this.playingLyric = txt;
            },
            // 获取播放歌曲的播放链接
            _getSinglePlayingUrl(songmid, strMediaMid) {
                // 两种情况 如果请求找不到歌曲就执行以下个接口
                // 默认播放器没有错误
                if (strMediaMid) {
                    getSinglePlayingUrl(strMediaMid).then((res) => {
                        if (res.code === ERR_OK) {
                            this.filename = res.data.items[0].filename;
                            this.vkey = res.data.items[0].vkey;

                            // 歌曲播放地址
                            this.playUrl = `${URL_HEAD}/${this.filename}?vkey=${this.vkey}&guid=${getCookie('guid')}&uin=0&fromtag=66`;
                            console.log(this.playUrl);

                            // 设置播放器播放
                            this.audioPlay(this.playUrl);
                            // 设置歌曲播放状态
                            this.setPlaying(true);
                        }
                    });
                }
                else {
                    // 备用接口
                    getSinglePlayingUrl(songmid).then((res) => {
                        if (res.code === ERR_OK) {
                            this.filename = res.data.items[0].filename;
                            this.vkey = res.data.items[0].vkey;

                            // 歌曲播放地址
                            this.playUrl = `${URL_HEAD}/${this.filename}?vkey=${this.vkey}&guid=${getCookie('guid')}&uin=0&fromtag=66`;
                            console.log(this.playUrl);

                            // 设置播放器播放
                            this.audioPlay(this.playUrl);
                            // 设置歌曲播放状态
                            this.setPlaying(true);
                        }
                    });
                }
            },
            ...mapActions('appStore', {
                /*
                 * 控制播发器放大缩小
                 * @type {Boolean}
                 * */
                setFullScreen: 'fullScreen',
                /**
                 * 设置当前播放歌曲索引
                 * @type {Boolean}
                 */
                setCurrentIndex: 'currentIndex',
                /**
                 * 滚动组件数据
                 * @type {Boolean}
                 */
                setScrollData: 'data'
            })
        },
        watch: {
            // 监听播放器错误
            playError(newPlayError) {
                // 如果播放器错误就请求备用接口
                if (newPlayError) {
                    // this._getSinglePlayingUrl(this.currentSong.mid);
                    this._getSinglePlayingUrl(null, this.currentSong.strMediaMid);

                    // 如果有歌词就重置歌词状态
                    if (this.currentLyric) {
                        // 停止歌词滚动
                        this.currentLyric.stop();
                        // 初始化播放时间
                        this.currentTime = 0;
                        // 初始化小歌词
                        this.playingLyric = '暂无歌词';
                        // 初始化歌词行
                        this.currentLineNum = 0;
                        // 初始化歌词滚动行数
                        this.$refs.lyricList.scrollToElement(0, 1000);
                    }
                }
            },
            // 监听错误次数
            playErrorCounter(newCounter) {
                console.log(newCounter);
                // 歌曲链接报错2次以上请求新的歌曲播放地址
                if (newCounter === 2) {
                    // 请求歌曲地址 传入 songmid = mid
                    // this._getSinglePlayingUrl(null, this.currentSong.strMediaMid);

                    // 设置播放器播放地址
                    this.playUrl = this.currentSong.url;
                    this.audioPlay(this.playUrl);

                    console.log(this.playUrl);
                    // 设置歌曲播放状态
                    this.setPlaying(true);
                }
                // 歌曲链接报错3次以上请求新的歌曲播放地址
                else if (newCounter === 3) {
                    // 设置播放器播放地址
                    this.playUrl = this.currentSong.spare;
                    this.audioPlay(this.playUrl);
                    console.log(this.playUrl);

                    // 设置歌曲播放状态
                    this.setPlaying(true);
                }
            },
            // 监听播放器播放
            playing(newPlaying) {
                // 设置播放器播放
                this.audioPlay(newPlaying);
            },
            // 监听播放器放大缩小
            fullScreen(newVal) {
                if (newVal) {
                    setTimeout(() => {
                        this.$refs.lyricList.refresh();
                    }, 20);
                }
            },
            // 监听歌曲改变
            currentSong(newCurrentSong, oldSong) {
                console.log(newCurrentSong);

                // 如果没有歌曲id就不播放歌曲
                if (!newCurrentSong.id) {
                    // 清除播放链接
                    this.playUrl = null;
                    // 设置歌曲播放状态
                    this.setPlaying(false);
                    // 设置播放器不播放
                    this.$refs.audio.pause();

                    return;
                }

                // 判断是否是重复播放
                if (newCurrentSong.id === oldSong.id) {
                    return;
                }

                // 初始化一些操作
                this._initDom();

                // 设置播放器播放地址
                this._getSinglePlayingUrl(this.currentSong.mid);

                // 设置播放器播放地址
                // this.playUrl = this.currentSong.url;

                // 每次执行前先清除time
                clearTimeout(this.timer);
                // 设置歌曲播放
                this.timer = setTimeout(() => {
//                    // 设置播放器播放
//                    this.$refs.audio.play();
//                    this.setPlaying(true);

                    // 设置播放器播放
                    // this.audioPlay(this.playUrl);
                    // 获取歌曲歌词
                    this.getLyric(newCurrentSong.mid);
                }, 1000);

            }
        },
        components: {
            ProgressBar,
            Playlist,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    /*有播放歌曲时组件出现的动画*/
    .playList-enter-active, .playList-leave-active {
        transition: all .5s
    }

    .playList-enter, .playList-leave-to {
        opacity: 0;
    }

    /*播放器放大时的动画*/
    .normal-enter-active, .normal-leave-active {
        transition: all .4s;
        .header, .bottom {
            transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        }
    }

    .normal-enter, .normal-leave-to {
        opacity: 0;
        .header {
            transform: translate3d(0, px2rem(-100px), 0)
        }
        .bottom {
            transform: translate3d(0, px2rem(100px), 0)
        }
    }

    /*播放器缩小时的动画*/
    .mini-enter-active, .mini-leave-active {
        transition: all .4s;
    }

    .mini-enter, .mini-leave-to {
        opacity: 0;
    }

    /*左右滑动wrapper*/
    .slide {
        overflow: hidden;
        display: -webkit-box;
        width: 100%;
    }

    /*没有歌曲列表时显示*/
    .no-play-list {
        display: flex;
        align-items: center;
        padding-left: px2rem(40px);
        font-size: px2rem(32px);
        width: 100%;
        color: $no-play-list-color;
    }

    /*播放器最小化时的样式*/
    .mini-player {
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 200;
        width: 100%;
        height: px2rem(120px);
        box-shadow: 0 0 10px #999;
        background: $mini-player-color;
        /*播放的歌曲图片*/
        .avatar {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(30px) 0 px2rem(40px);
            img {
                display: block;
                border-radius: 50%;
            }
        }
        /*播放的歌曲标题和文字*/
        .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            overflow: hidden;
            text-align: left;
            line-height: px2rem(40px);
            .name {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-bottom: px2rem(10px);
                font-size: px2rem(32px);
                color: $text-name-color;
            }
            .desc {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                font-size: px2rem(32px);
                color: $text-desc-color;
            }
        }
        /*播放和歌曲icon样式*/
        .control {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(20px);
        }
        /*播放按钮图标*/
        .play {
            font-size: px2rem(70px);
            color: $play-color;
        }
        /*音乐列表图标*/
        .queue {
            flex: 0 0 px2rem(80px);
            width: px2rem(80px);
            padding: 0 px2rem(30px) 0 0;
        }
        /*播放列表按钮*/
        .queue_music {
            font-size: px2rem(70px);
            color: $play-color;
        }
    }

    /*播放器放大时的样式*/
    .normal-player {
        display: flex;
        flex-direction: column;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: $normal-player-bgcolor;
        /*背景*/
        .background {
            position: absolute;
            left: -50%;
            top: 0;
            width: 150%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter: blur(20px)
        }
        /*头部*/
        .header {
            position: relative;
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: px2rem(84px);
            z-index: 100;
            /*返回按钮*/
            .back {
                flex-basis: 20%;
                z-index: 50;
                i {
                    display: block;
                    padding: 0 px2rem(20px);
                    font-size: px2rem(84px);
                    line-height: px2rem(84px);
                    color: $icon-fanhui1-copy;
                }
            }
            /*标题*/
            .title {
                padding-left: px2rem(10px);
                width: 100%;
                margin: 0;
                text-align: center;
                line-height: px2rem(84px);
                font-size: px2rem(36px);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: $title-color;
                z-index: 40;
            }
            /*菜单*/
            .menu {
                flex-basis: 25%;
                z-index: 50;
                width: px2rem(124px);
            }
        }
        /*内容*/
        .normal-player-content {
            padding-top: px2rem(20px);
            display: flex;
            flex-direction: column;
            flex: 1;
            height: 100%;
            overflow: hidden;
            /*歌手名称*/
            .sing-name {
                display: flex;
                justify-content: center;
                padding: 0 px2rem(40px);
                text-align: center;
                font-size: px2rem(30px);
                color: $sing-name-color;
                i {
                    font-size: px2rem(40px);
                }
                span {
                    padding: 0 px2rem(10px);
                }
            }
            /*切换 dot*/
            .dot-wrapper {
                padding-top: px2rem(50px);
                text-align: center;
                font-size: 0;
                .dot {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    &.active {
                        border-radius: 5px;
                        background: #fff
                    }
                }
            }
            /*中间内容*/
            .middle {
                position: fixed;
                /*margin-top: px2rem(30px);*/
                width: 100%;
                top: px2rem(240px);
                bottom: px2rem(340px);
                white-space: nowrap;
                font-size: 0;
                /*左边滑块*/
                .middle-l {
                    display: inline-block;
                    vertical-align: top;
                    position: relative;
                    width: 100%;
                    height: 100%;
                    /*padding-top: 80%;*/
                    /*歌曲图片*/
                    .cd-wrapper {
                        /*position: absolute;*/
                        /*left: 10%;*/
                        /*top: 0;*/
                        margin: 0 auto;
                        /*width: px2rem(600px);*/
                        /*height: 100%;*/
                        .cd {
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            border: 10px solid rgba(0, 0, 0, 0.1);
                            border-radius: 50%;
                            &.play {
                                animation: rotate 20s linear infinite
                            }
                            &.pause {
                                animation-play-state: paused
                            }
                            .image {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                    }
                    /*小歌词*/
                    .playing-lyric-wrapper {
                        width: 80%;
                        margin: px2rem(40px) auto 0 auto;
                        overflow: hidden;
                        text-align: center;
                        .playing-lyric {
                            height: px2rem(40px);
                            line-height: px2rem(40px);
                            font-size: px2rem(28px);
                            color: $playing-lyric-color;
                        }
                    }
                }
                /*右边滑块*/
                .middle-r {
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    /*自动校正歌词按钮*/
                    .auto-regulate-lyric {
                        display: block;
                        width: 100%;
                        line-height: px2rem(50px);
                        font-size: px2rem(30px);
                        color: #fff
                    }
                    /*歌词*/
                    .lyric-wrapper {
                        width: 80%;
                        margin: 0 auto;
                        overflow: hidden;
                        text-align: center;
                        /*内容*/
                        .text {
                            line-height: px2rem(64px);
                            font-size: px2rem(28px);
                            color: $lyric-text-color;
                            // 当前的歌词行
                            &.current {
                                color: $lyric-text-current-color;
                            }
                        }
                    }
                    // 背景
                    .middle-r-bg {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        height: px2rem(100px);
                        background: rgba(0, 0, 0, .5);
                    }
                }
            }
        }
        /*播放控制按钮*/
        .bottom {
            position: absolute;
            bottom: px2rem(50px);
            width: 100%;
            /*播发进度*/
            .progress-wrapper {
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0 auto;
                padding: px2rem(20px) 0;
                /*播放时间*/
                .time {
                    flex: 0 0 px2rem(60px);
                    line-height: px2rem(60px);
                    width: px2rem(60px);
                    font-size: px2rem(24px);
                    color: $time-color;
                    &.time-l {
                        text-align: left;
                    }
                    &.time-r {
                        text-align: right;
                    }
                }
                /*进度条*/
                .progress-bar-wrapper {
                    flex: 1;
                }
            }
            /*切换歌曲等按钮*/
            .operators {
                display: flex;
                align-items: center;
                .icon {
                    flex: 1;
                    font-size: px2rem(70px);
                }
                /*没有收藏按钮*/
                .favorite_border {
                    color: $favorite_border;
                    font-size: px2rem(60px);
                }
                /*收藏按钮*/
                .favorite {
                    color: $favorite;
                    font-size: px2rem(60px);
                }
                /*回到上一个*/
                .skip-previous {
                    color: $kip-previous;
                }
                .skip-next {
                    color: $skip-next;
                }
                /*播放按钮*/
                .play {
                    flex: 1;
                    color: $play-color;
                    i {
                        font-size: px2rem(100px);
                    }
                }
                /*切换播放模式*/
                .play-mode {
                    margin-top: px2rem(10px);
                }
                .iconfont {
                    padding-top: px2rem(10px);
                    font-size: px2rem(65px);
                    color: $mode-color;
                }
                .icon-danquxunhuan {
                    margin-top: px2rem(-2px);
                    padding-top: 0;
                    font-size: px2rem(70px);
                }
                .i-left {
                    text-align: center;
                }
                .i-center {
                    padding: 0 px2rem(20px);
                    text-align: center;
                }
                .i-right {
                    text-align: right;
                }
            }
        }
    }

    @keyframes rotate {
        0% {
            transform: rotate(0);

        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
