<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
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
      }
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
        default: 100
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initSlider();
      }, 20);
    },
    methods: {
      // 设置滚动的宽度
      _setSliderWidth() {
        // 获取所有图片
        this.children = this.$refs.sliderGroup.children;

        // 初始化宽度
        let width = 0;
        // 初始化轮播图当的宽度为当前视图宽度
        let sliderWidth = this.$refs.slider.clientWidth;

        // 循环轮播图
        for (let i = 0; i < this.children.length; i++) {
          // 获取每个轮播图
          let child = this.children[i];
          // 添加类
          addClass(child, 'slider-item');
          // 设置轮播图的宽度
          child.style.width = sliderWidth + 'px';
          // 设置-每个轮播图-的宽度
          width += sliderWidth;
        }

        // 判断如果开启了轮播在当前容器的宽度上 *2 + 轮播图宽度
        if (this.loop) {
          width += 2 * sliderWidth;
        }

        // 设置整个轮播的宽度
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      // 初始化滑块
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          click: true,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          }
        });

        // 滑动结束触发的事件
        this.slider.on('scrollEnd', () => {
          // 获取页面的数量
          let pageIndex = this.slider.getCurrentPage.pageX;
          if (this.loop) {
            pageIndex -= 1
          }
          // 当前的页面的数量
          this.currentPageIndex = pageIndex;

          // 重复轮播
          if(this.autoPlay) {
            clearTimeout(this.timer);
            this._play()
          }
        })
      },
      // 自动轮播
      _play() {
        let pageIndex = this.currentPageIndex + 1;

        // 开启轮播
        if (this.loop) {
          pageIndex += 1
        }

        // 轮播动画时间
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .slider {
    min-height: 1px;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item {
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
  }
</style>
