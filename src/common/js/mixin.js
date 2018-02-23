import {mapState, mapActions, mapGetters} from 'vuex';
// 获取控制歌曲播放模式
import {isPlayMode} from 'common/js/config';
// 设置随机播放列表数据
import {shuffle} from 'common/js/util';
// 保存主页选择对应歌单的数据到本地 saveSongSingle
import {saveSongSingle} from 'common/js/cache';
// 自定义歌单专辑数据
import {createSongSingle} from 'common/js/songSingle';

// 播放器mixin
export const playerMixin = {
    computed: {
        // 切换播放模式
        iconMode () {
            return this.getPlayMode === isPlayMode.sequence ? 'icon-shunxubofang' : this.getPlayMode === isPlayMode.loop ? 'icon-danquxunhuan' : 'icon-suijibofang';
        },
        ...mapGetters('appStore', {
            /**
             * 当前播放的歌曲信息
             * @type {Object}
             */
            getCurrentSong: 'currentSong',
            /**
             * 获取播放列表
             * @type {Array}
             */
            getPlayList: 'playList',
            /**
             * 控制歌曲播放模式
             * @type {Boolean}
             */
            getPlayMode: 'playMode',
            /**
             * 顺序播放列表
             * @type {Array}
             */
            getSequenceList: 'sequenceList',
            /**
             * 获取歌曲收藏列表
             * @type {Array}
             */
            getFavoriteList: 'favoriteList'
        })
    },
    methods: {
        // 切换歌曲播放模式
        changeMode () {
            const playMode = (this.getPlayMode + 1) % 3;
            this.setPlayMode(playMode);
            // 设置播放列表
            let list = null;
            // 根据不同的模式设置不同的播放列表
            if (playMode === isPlayMode.random) {
                list = shuffle(this.getSequenceList);
            }
            else {
                list = this.getSequenceList;
            }

            // 重新设置当前播放歌曲
            this.resetCurrentIndex(list);
            // 重新设置播放列表
            this.setPlayList(list);
        },
        // 重置当前播放歌曲
        resetCurrentIndex(list) {
            // 获取当前歌曲索引
            let index = list.findIndex((item) => {
                return item.id === this.getCurrentSong.id;
            });

            // 设置当前播放歌曲索引
            this.setCurrentIndex(index);

        },
        // 切换收藏图标
        getFavoriteIcon(currentSong) {
            if (this.isFavorite(currentSong)) {
                return 'favorite';
            }
            return 'favorite_border';
        },
        // 点击收藏歌曲方法
        toggleFavorite (currentSong) {
            // 如果当前收藏歌曲列表中有当前的歌曲就删除该歌词
            if (this.isFavorite(currentSong)) {
                this.setDeleteFavoriteList(currentSong);
            }
            // 否则收藏该歌曲
            else {
                this.setSaveFavoriteList(currentSong);
            }
        },
        // 寻找当前收藏歌曲列表时否有这首歌曲
        isFavorite (currentSong) {
            const index = this.getFavoriteList.findIndex((item) => {
                return item.id === currentSong.id;
            });
            return index > -1;
        },
        ...mapActions('appStore', {
            /**
             * 控制歌曲播放
             * @type {Boolean}
             */
            setPlaying: 'playing',
            /**
             * 设置播放列表数据
             * @type {Boolean}
             */
            setPlayList: 'playList',
            /**
             * 控制歌曲播放模式
             * @type {Boolean}
             */
            setPlayMode: 'playMode',
            /**
             * 设置当前播放歌曲索引
             * @type {Boolean}
             */
            setCurrentIndex: 'currentIndex',
            /**
             * 收藏当前歌曲
             * @type {Array}
             */
            setSaveFavoriteList: 'saveFavoriteList',
            /**
             * 取消收藏歌曲
             * @type {Array}
             */
            setDeleteFavoriteList: 'deleteFavoriteList'
        })
    }
};

// 分类歌单专辑列表mixin
export const chosenSongList = {
    data () {
        return {
            /*
             * sortId
             * @type {Number}
             * @default 2
             * */
            sortId: 5,
            /*
             * 分类歌单显示列表的起始位置
             * @type {Number}
             * @default 0
             * */
            sin: 0,
            /*
             * 分类歌单显示列表的结束位置
             * @type {Number}
             * @default 29
             * */
            ein: 29,
            /*
             * 获取分类歌单歌曲信息
             * @types {Array}
             * */
            sortSongData: [{}, {}]
        }
    },
    mounted () {
        // 获取分类歌单歌曲信息
        this.setSortSongDataAjax({
            categoryId: this.categoryId,
            sortId: this.sortId,
            sin: this.sin,
            ein: this.ein
        });

        // 设置开启上拉加载
        this.setPullUpLoad(true);
    },
    computed: {
        // 获取请求接口对应的数据
        ...mapState('asyncAjax', {
            /*
             * 获取分类歌单歌曲信息
             * @type {Array}
             * */
            getSortSongData: 'sortSongData'
        })
    },
    methods: {
        // 选择歌单导航
        selectNavigation(sortId) {
            this.sortId = sortId;
            this.sin = 0;
            this.ein = 29;

            this.setSortSongData([]);

            if (sortId === 2) {
                if (!this.sortSongData[0].list) {
                    // 获取分类歌单歌曲信息
                    this.setSortSongDataAjax({
                        categoryId: this.categoryId,
                        sortId: this.sortId,
                        sin: this.sin,
                        ein: this.ein
                    });
                }
                else {
                    setTimeout(() => {
                        this.setSortSongData(this.sortSongData[0]);
                    }, 500);
                }
            }
            else if (sortId === 5) {
                if (!this.sortSongData[1].list) {
                    // 获取分类歌单歌曲信息
                    this.setSortSongDataAjax({
                        categoryId: this.categoryId,
                        sortId: this.sortId,
                        sin: this.sin,
                        ein: this.ein
                    })
                }
                else {
                    setTimeout(() => {
                        this.setSortSongData(this.sortSongData[1]);
                    }, 500);
                }
            }
        },
        // 点击选择歌单
        selectSongList(singer) {
            // 传入音乐列表数据  如果是歌单推荐就请求这个路由地址
            if (singer.dissid) {
                // 把选中的专辑的数据存入 localStorage多页通讯
                saveSongSingle(createSongSingle(singer));

                // 跳转到专辑页面
                this.$router.push({
                    path: `/songsingle/${singer.dissid}`
                });
            }
        },
        // 上拉加载更多歌单列表方法
        pullingUp () {
            // 如果当前列表的数量小于30就不能上拉加载
            if (this.getSortSongData.list.length < 30) {
                return;
            }

            this.sin += 30;
            this.ein += 30;

            // 请求更多歌单列表
            this.setSortSongDataAjax({
                categoryId: this.categoryId,
                sortId: this.sortId,
                sin: this.sin,
                ein: this.ein
            });
        },
        // 上拉加载更多歌单列表完成后刷新数据方法
        pullingUpRefresh () {
            // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载。
            this.$refs.scroll.finishPullUp();
            // 数据更新时刷新滚动列表数据
            this.$refs.scroll.refresh();
        },
        ...mapActions('asyncAjax', {
            /*
             * 获取分类歌单歌曲信息
             * */
            setSortSongDataAjax: 'getSortSongData',
            /*
             * 设置分类歌单歌曲信息
             * */
            setSortSongData: 'sortSongData'
        }),
        // 其他状态
        ...mapActions('appStore', {
            /**
             * 滚动组件外部传入的数据
             * @type {Array}
             */
            setScrollData: 'scrollData',
            /*
             * 设置是否开启上拉加载
             * @type {Boolean}
             * */
            setPullUpLoad: 'pullUpLoad'
        }),
    },
    watch: {
        // 监听分类歌单列表数据
        getSortSongData (newSortSongData) {
            if (!newSortSongData.list) {
                return;
            }
            // 上拉加载更多歌单列表完成后刷新数据方法
            this.pullingUpRefresh();

            // 滚动组件外部传入的数据
            this.setScrollData(newSortSongData);

            if (this.sortId === 2) {
                if (this.sin >= 30) {
                    this.sortSongData[0].list = this.sortSongData[0].list.concat(newSortSongData.list);
                }
                else {
                    this.sortSongData[0] = newSortSongData;
                }
            }
            else if (this.sortId === 5) {
                if (this.sin >= 30) {
                    this.sortSongData[1].list = this.sortSongData[1].list.concat(newSortSongData.list);
                }
                else {
                    this.sortSongData[1] = newSortSongData;
                }
            }
        }
    }
};
