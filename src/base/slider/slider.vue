<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="slider-dots">
            <span class="dots" v-for="(item,index) in dots" :class="{active: currentPageIndex === index}"></span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {addClass} from 'common/js/dom';
    import BScroll from 'better-scroll';

    export default {
        data() {
            return {
                // 原点数量
                dots: [],
                // 当前的轮播图数量
                currentPageIndex: 0
            };
        },
        props: {
            // 是否循环播放
            loop: {
                type: Boolean,
                default: true
            },
            // 是否自动轮播
            autoPlay: {
                type: Boolean,
                default: true
            },
            // 切换时间
            interval: {
                type: Number,
                default: 2000
            },
            click: {
                type: Boolean,
                default: true
            }
        },
        mounted() {
            // 确保dom已经渲染了 初始化代码
            this.update();

            // 自适应大小
            window.addEventListener('resize', () => {
                if (!this.slider || !this.slider.enabled) {
                    return;
                }
                clearTimeout(this.resizeTimer);

                // 改变窗口时大小执行
                this.resizeTimer = setTimeout(() => {
                    // 判断当前 scroll 是否处于滚动动画过程中。
                    if (this.slider.isInTransition) {
                        this._onScrollEnd();
                    }
                    else {
                        if (this.autoPlay) {
                            this._play();
                        }
                    }
                    // 刷新轮播
                    this.refresh();
                }, 60);
            });
        },
        // 切换路由时也开启轮播
        activated() {
            if (!this.slider) {
                return;
            }
            // 启用 better-scroll, 默认 开启
            this.slider.enable();

            // 获取当前页面的信息。
            let pageIndex = this.slider.getCurrentPage().pageX;

            // 调用 goToPage 方法 滚动到指定的页面
            this.slider.goToPage(pageIndex, 0, 0);

            // 设置当前的页数 = pageIndex
            this.currentPageIndex = pageIndex;

            // 开启轮播
            if (this.autoPlay) {
                this._play();
            }
        },
        deactivated() {
            // 禁用 better-scroll
            this.slider.disable();
            clearTimeout(this.timer);
        },
        beforeDestroy() {
            this.slider.disable();
            clearTimeout(this.timer);
        },
        methods: {
            update() {
                if (this.slider) {
                    // 销毁 better-scroll，解绑事件
                    this.slider.destroy();
                }
                this.$nextTick(() => {
                    // 初始化 better-scroll
                    this.init();
                });
            },
            // 刷新轮播
            refresh() {
                this._setSliderWidth(true);
                this.slider.refresh();
            },
            // 滚动到下一个页面
            next() {
                this.slider.next();
            },
            // 初始化方法
            init() {
                clearTimeout(this.timer); // 清除定时器
                this.currentPageIndex = 0; // 设置当前页数为0

                this._setSliderWidth(); // 设置滚动的宽度
                this._initDots(); // 初始化轮播点
                this._initSlider(); // 初始化滑块

                if (this.autoPlay) {
                    this._play();
                }
            },
            // 设置滚动的宽度
            _setSliderWidth(isResize) {
                // 获取所有图片
                this.children = this.$refs.sliderGroup.children;
                console.log()
                // 初始化宽度
                let width = 0;
                // 初始化轮播图当前的宽度为当前视图宽度
                let sliderWidth = this.$refs.slider.clientWidth;

                // 循环轮播图
                for (let i = 0; i < this.children.length; i++) {
                    // 获取每个轮播图
                    let child = this.children[i];
                    // 添加类
                    addClass(child, 'slider-item');
                    // 设置轮播图的宽度
                    child.style.width = sliderWidth + 'px';
                    // 设置每个轮播图的宽度
                    width += sliderWidth;
                }

                // 判断如果开启了轮播在当前容器的宽度上 *2 + 轮播图宽度
                if (this.loop && !isResize) {
                    width += 2 * sliderWidth;
                }

                // 设置整个轮播的宽度
                this.$refs.sliderGroup.style.width = width + 'px';
            },
            // 初始化滑块
            _initSlider() {
                this.slider = new BScroll(this.$refs.slider, {
                    scrollX: true,
                    momentum: false,
                    snap: {
                        loop: this.loop,
                        threshold: 0.3,
                        speed: 400
                    },
                    click: this.click
                });

                // 滑动结束触发的事件
                this.slider.on('scrollEnd', this._onScrollEnd);

                // 手指离开 事件
                this.slider.on('touchend', () => {
                    if (this.autoPlay) {
                        this._play();
                    }
                });

                // 滚动开始之前 事件
                this.slider.on('beforeScrollStart', () => {
                    if (this.autoPlay) {
                        clearTimeout(this.timer);
                    }
                });
            },
            // 滑动结束事件
            _onScrollEnd() {
                // 获取页面的数量
                let pageIndex = this.slider.getCurrentPage().pageX;

                if (this.loop) {
                    pageIndex -= 1;
                }
                // 当前的页面的数量
                this.currentPageIndex = pageIndex;

                if (this.autoPlay) {
                    this._play();
                }
            },
            // 初始化轮播点
            _initDots() {
                this.dots = this.$refs.sliderGroup.children.length;
            },
            // 自动轮播
            _play() {
                clearTimeout(this.timer);
                // 轮播动画时间
                this.timer = setTimeout(() => {
                    this.slider.next();
                }, this.interval);
            }
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../common/sass/variables";
    @import "../../common/sass/remAdaptive";

    .slider {
        min-height: px2rem(2px);
        .slider-group {
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            .slider-item {
                position: relative;
                float: left;
                box-sizing: border-box;
                overflow: hidden;
                text-align: center;
                a {
                    display: block;
                    width: 100%;
                    overflow: hidden;
                    text-decoration: none;
                }
                img {
                    display: block;
                    width: 100%;
                }
            }
        }
        .slider-dots {
            position: absolute;
            left: 0;
            right: 0;
            bottom: px2rem(10px);
            padding: 0 px2rem(18px);
            text-align: center;
            line-height: px2rem(36px);
            .dots {
                display: inline-block;
                margin: 0 px2rem(8px) px2rem(10px) px2rem(8px);
                width: px2rem(10px);
                height: px2rem(10px);
                border-radius: 50%;
                background: $dotsBgColor;
                &.active {
                    background: $dotActiveBgColor-color;
                }
            }
        }
    }
</style>
