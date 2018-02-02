<template>
    <div ref="scrollWrapper">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import {mapState} from 'vuex';

    export default {
        props: {
            /*
             * 设置开启X轴滚动
             * @type {Boolean}
             * */
            scrollX: {
                type: Boolean,
                default: false
            },
            /*
             * 默认设置开启Y轴滚动
             * @type {Boolean}
             * */
            scrollY: {
                type: Boolean,
                default: true
            },
            /*
             * 设置开启上啦底部加载
             * @type {Boolean}
             * */
            pullUpLoad: {
                type: null,
                default: false
            }
        },
        data () {
            return {
                isPullingDown: false
            };
        },
        computed: {
            ...mapState('appStore', [
                'probeType',
                'click',
                'data',
                'listenScroll',
                'pullup',
                'beforeScroll',
                'refreshDelay',
                'bounce',
                'bounceTime'
            ])
        },
        mounted () {
            // 确保dom已经渲染了 初始化代码
            setTimeout(() => {
                this._initScroll(true);
            }, 20);
        },
        methods: {
            _initScroll () {
                // 判断有没有内容   没有就不执行
                if (!this.$refs.scrollWrapper) {
                    return;
                }

                // 设置滚动
                this.scroll = new BScroll(this.$refs.scrollWrapper, {
//                    scrollY: this.scrollY, // 设置开启Y轴滚动
//                    scrollX: this.scrollX, // 设置开启X轴滚动
                    bounceTime: this.bounceTime, // 设置回弹时间
                    probeType: this.probeType,
                    click: this.click, // 设置可以点击
                    bounce: this.bounce, // 是否开始回弹效果 boolean
                    HWCompositing: true, // 硬件加速
                    pullUpLoad: this.pullUpLoad // 拉加载功能
                });

                // 如果监听了scroll 就派发scroll滚动事件
                if (this.listenScroll) {
                    let me = this;
                    // pos 滚动的实时坐标
                    this.scroll.on('scroll', (pos) => {
                        me.$emit('scroll', pos);
                    });
                }

                // 监听是否开启滚动到到底部刷新
                if (this.pullup) {
                    this.scroll.on('scrollEnd', () => {
                        // 如果当前滚动距离 小于等于  最大滚动距离，就向外部发送刷新事件
                        if (this.scroll.y <= this.scroll.maxScrollY + 50) {
                            this.$emit('scrollToEnd');
                        }
                    });
                }

                // 发送滚动开始事件
                if (this.beforeScroll) {
                    this.scroll.on('beforeScrollStart', () => {
                        this.$emit('beforeScroll');
                    });
                }


                if (this.pullUpLoad) {
                    this.scroll.on('pullingUp', () => {
                        this.$emit('pullingUp');
                    });
                }
            },
            // 禁用 better-scroll
            disable () {
                this.scroll && this.scroll.disable();
            },
            // 销毁 better-scroll，解绑事件。
            destroy () {
                this.scroll && this.scroll.destroy();
            },
            // 启用 better-scroll, 默认 开启。
            enable () {
                this.scroll && this.scroll.enable();
            },
            // 重新计算高度
            refresh () {
                this.scroll && this.scroll.refresh();
            },
            // 滚动到指定位置
            scrollTo () {
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
            },
            // 滚动到指定的目标元素
            scrollToElement () {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
            },
            // 当上拉加载数据加载完毕后，需要调用此方法告诉 better-scroll 数据已加载
            finishPullUp () {
                this.scroll && this.scroll.finishPullUp();
            }
        },
        // 监听数据的变化
        watch: {
            data () {
                setTimeout(() => {
                    // 数据发生变化时刷新滚动 重新计算滚动
                    this.refresh();
                }, this.refreshDelay);
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
