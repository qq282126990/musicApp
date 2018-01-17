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
                <span class="name">全部</span>
                <span class="name" v-for="item in dotsTitle">{{item.categoryName}}</span>
            </div>
            <!--dots-->
            <div class="dots-wrapper">
                <div class="dots" :style="{transform: `translate3d(${dotsScrollX}px, 0, 0)`}" ref="dots">
                    <span class="icon active"></span>
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
        data () {
            return {
                // 原点数量
                dots: [],
                // 当前的轮播图数量
                currentPageIndex: 0,
                // dots滑动的距离
                dotsScrollX: 0
            };
        },
        mounted () {
            // 更新数据
            this.update();
        },
        methods: {
            // 更新数据
            update () {
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
            init () {

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
            _setSliderSwitchWidth () {
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
            _initSliderSwitch () {
                this.sliderSwitch = new BScroll(this.$refs.sliderSwitch, {
                    // 开启向左滑动
                    scrollX: true,
                    momentum: false,
                    // 禁用回弹效果
                    bounce: false,
                    // Bscroll 类型为3
                    probeType: 3,
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
                    // 设置dots 滑动的距离
                    this.dotsScrollX = Math.abs(pos.x / 5);

                    this.$emit('scroll', pos);
                });

                // 滑动结束触发的事件
                this.sliderSwitch.on('scrollEnd', this._onScrollEnd);
            },
            // 滑动结束事件
            _onScrollEnd () {
                // 获取页面的数量
                let pageIndex = this.sliderSwitch.getCurrentPage().pageX;

                // 当前的页面的数量
                this.currentPageIndex = pageIndex;

                // 发送当前的页数
                this.$emit('pageIndex', this.currentPageIndex);
            },
            // 初始化dots
            _initDots () {
                this.dots = this.$refs.sliderSwitchGroup.children.length;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/variables";
    @import "../../common/sass/remAdaptive";

    .slider-switch {
        position: relative;
        width: 100%;
        height: 100%;
        /*dots*/
        .slider-switch-dots {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: px2rem(80px);
            background: $slider-switch-dots-bg;
            /*标题*/
            .title {
                display: flex;
                height: px2rem(40px);
                .name {
                    line-height: px2rem(40px);
                    flex-basis: 20%;
                    font-size: px2rem(28px);
                    color: $name-color;
                }
            }
            /*dots*/
            .dots-wrapper {
                display: flex;
                height: px2rem(40px);
                .dots {
                    line-height: px2rem(40px);
                    flex-basis: 20%;
                    .icon {
                        margin: px2rem(15px) auto 0 auto;
                        display: block;
                        width: px2rem(40px);
                        height: px2rem(6px);
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
            top: px2rem(80px);
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
