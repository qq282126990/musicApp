<template>
    <div class="slider-switch" ref="sliderSwitch">
        <!--内容-->
        <div class="slider-switch-group" ref="sliderSwitchGroup">
            <slot></slot>
        </div>
        <!--导航-->
        <div class="slider-switch-dots">
            <!--标题名称-->
            <div class="title">
                <span class="name"
                      v-for="(item,index) in dotsTitle"
                >{{item.name}}</span>
            </div>
            <!--dots-->
            <div class="dots-wrapper">
                <div class="dots" ref="dots">
                    <span class="icon" v-for="(item,index) in dots" :class="{active: currentPageIndex === index}"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {addClass} from 'common/js/dom';
    import BScroll from 'better-scroll';

    export default {
        props: {
            /*
             * 头部导航标题
             * @type {Array}
             * */
            dotsTitle: {
                type: Array,
                default: []
            },
            /*
             * 是否循环播放
             * @type {Boolean}
             * */
            loop: {
                type: Boolean,
                default: false
            },
            click: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                // 原点数量
                dots: [],
                // 当前的轮播图数量
                currentPageIndex: 0,
                // dots滑动的距离
                dotsScrollX: 0
            };
        },
        mounted() {
            // 更新数据
            this.update();
        },
        methods: {
            // 更新数据
            update() {
                if (this.sliderSwitch) {
                    // 销毁 better-scroll，解绑事件
                    this.sliderSwitch.destroy();
                }
                this.$nextTick(() => {
                    // 初始化 better-scroll
                    this.init();
                });
            },
            // 初始化方法
            init() {
                // 设置当前页数为0
                this.currentPageIndex = 0;
                // 设置滑动的宽度
                this._setSliderSwitchWidth();
                // 初始化滑动
                this._initSliderSwitch();
                // 初始化dots
                this._initDots();
            },
            // 设置滑动的宽度
            _setSliderSwitchWidth() {
                // 获取所有图片
                this.children = this.$refs.sliderSwitchGroup.children;
                // 初始化宽度
                let width = 0;
                // 初始化当前的宽度为当前视图宽度
                let sliderSwitchWidth = this.$refs.sliderSwitch.clientWidth;
                // 循环滑动内容
                for (let i = 0; i < this.children.length; i++) {
                    // 获取每个滑动内容
                    let child = this.children[i];
                    // 为每个滑动内容添加一个类
                    addClass(child, 'slider-switch-item');
                    // 设置每个滑动内容的宽度 = 当前视图宽度
                    child.style.width = sliderSwitchWidth + 'px';
                    // 设置每个轮播图的宽度
                    width += sliderSwitchWidth;
                }
                // 设置整个滑动区域的宽度
                this.$refs.sliderSwitchGroup.style.width = width + 'px';
            },
            // 初始化滑动
            _initSliderSwitch() {
                this.sliderSwitch = new BScroll(this.$refs.sliderSwitch, {
                    // 开启向左滑动
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    // 禁用回弹效果
                    bounce: false,
                    // Bscroll 类型为3
                    probeType: 1,
                    snap: {
                        // 是否循环播放
                        loop: this.loop,
                        threshold: 0.3,
                        speed: 400
                    },
                    // 设置可以点击
                    click: this.click
                });
                // 向外层派发滚动事件
                this.sliderSwitch.on('scroll', (pos) => {
                    // 判断向左向右滑动 -1 向右 1 向左
                    let movingDirectionX = this.sliderSwitch.movingDirectionX;
                    // 设置dots 滑动的距离
                    this.dotsScrollX = Math.abs(pos.x / 5);
                    // 发送滚动事件
                    this.$emit('scroll', pos, movingDirectionX);
                });
                // 滑动结束触发的事件
                this.sliderSwitch.on('scrollEnd', this._onScrollEnd);
            },
            // 滑动结束事件
            _onScrollEnd() {
                // 获取页面的数量
                let pageIndex = this.sliderSwitch.getCurrentPage().pageX;
                // 当前的页面的数量
                this.currentPageIndex = pageIndex;

                if (this.currentPageIndex > 0) {
                    this.$refs.sliderSwitchGroup.style.height = this.$refs.sliderSwitchGroup.children[1].clientHeight + 'px'
                }
                else if (this.currentPageIndex === 0) {
                    this.$refs.sliderSwitchGroup.style.height = this.$refs.sliderSwitchGroup.children[0].clientHeight + 'px'
                }

                // 发送当前的页数
                this.$emit('pageIndex', this.currentPageIndex);
            },
            // 初始化dots
            _initDots() {
                this.dots = this.$refs.sliderSwitchGroup.children.length;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .slider-switch {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        /*dots*/
        .slider-switch-dots {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding-top: px2rem(20px);
            height: px2rem(80px);
            background: $slider-switch-dots-bg;
            /*标题*/
            .title {
                display: flex;
                height: px2rem(40px);
                .name {
                    line-height: px2rem(40px);
                    flex: 1;
                    font-size: px2rem(28px);
                    color: $slider-switch-name-color;
                }
            }
            /*dots*/
            .dots-wrapper {
                display: flex;
                background: $slider-switch-dots-bg;
                border-bottom: px2rem(1px) solid #999;
                .dots {
                    line-height: px2rem(40px);
                    display: flex;
                    width: 100%;
                    .icon {
                        flex: 0 0 px2rem(90px);
                        margin: px2rem(15px) auto 0 auto;
                        display: block;
                        width: px2rem(40px);
                        height: px2rem(8px);
                    }
                    .active {
                        background: $dots-bg;
                    }
                }
            }
        }
        /*内容*/
        .slider-switch-group {
            position: relative;
            padding-top: px2rem(100px);
            padding-bottom: px2rem(120px);
            overflow: hidden;
            .slider-switch-item {
                position: relative;
                float: left;
                box-sizing: border-box;
                overflow: hidden;
                text-align: center;
            }
        }
    }
</style>
