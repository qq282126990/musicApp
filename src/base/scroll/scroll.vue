<template>
    <div ref="scrollWrapper">
        <slot></slot>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';

    export default {
        props: {
            // 滚动的状态
            // 当 probeType 为 1 的时候，会非实时（屏幕滑动超过一定时间后）派发scroll 事件；
            // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件；
            // 当 probeType 为 3 的时候，不仅在屏幕滑动的过程中，而且在 momentum 滚动动画运行过程中实时派发 scroll 事件。
            probeType: {
                type: Number,
                default: 1
            },
            // 分发点击事件
            click: {
                type: Boolean,
                default: true
            },
            // 外部传入的数据
            data: {
                type: Array,
                default: null
            },
            // scroll 要不要监听滚动事件
            listenScroll: {
                type: Boolean,
                default: false
            },
            // 是否开启下拉刷新
            pullup: {
                type: Boolean,
                default: false
            },
            // 开始滚动
            beforeScroll: {
                type: Boolean,
                default: false
            },
            // 刷新延迟
            refreshDelay: {
                type: Number,
                default: 20
            },
            // 是否开启回弹效果
            bounce: {
                type: Boolean,
                default: true
            }
        },
        mounted () {
            // 确保dom已经渲染了 初始化代码
            setTimeout(() => {
                this._initScroll();
            }, 20);
        },
        methods: {
            _initScroll() {
                // 判断有没有内容   没有就不执行
                if (!this.$refs.scrollWrapper) {
                    return;
                }

                // 设置滚动
                this.scroll = new BScroll(this.$refs.scrollWrapper, {
                    probeType: this.probeType,
                    click: this.click,
                    bounce: this.bounce // 是否开始回弹效果 boolean
                });

                // 如果监听了scroll 就派发scroll滚动事件
                if (this.listenScroll) {
                    let me = this;
                    // pos 滚动的实时坐标
                    this.scroll.on('scroll', (pos) => {
                        me.$emit('scroll', pos);
                    });
                }

                // 监听是否下拉刷新
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
            },
            // 启用 better-scroll
            enable() {
                this.scroll && this.scroll.enable();
            },
            // 禁用 better-scroll
            disable() {
                this.scroll && this.scroll.disable();
            },
            // 重新计算高度
            refresh() {
                this.scroll && this.scroll.refresh();
            },
            // 滚动到指定位置
            scrollTo() {
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
            },
            // 滚动到指定的目标元素
            scrollToElement() {
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
            }
        },
        // 监听数据的变化
        watch: {
            data() {
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
