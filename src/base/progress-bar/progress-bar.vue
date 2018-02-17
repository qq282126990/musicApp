<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <!--内层-->
        <div class="bar-inner">
            <!--播放进度-->
            <div class="progress" ref="progress"></div>
            <!--进度条点-->
            <div class="progress-btn-wrapper"
                 ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {prefixStyle} from 'common/js/dom';

    const progressBtnWidth = 16;
    const transform = prefixStyle('transform');

    export default {
        props: {
            /*
             * 获取进度条百分比进度
             * */
            progressBar: {
                type: Number,
                default: 0
            }
        },
        created() {
            // 创建手指触摸事件
            this.touch = {};
        },
        methods: {
            // 设置进度条拖动开始事件
            progressTouchStart (e) {
                // 设置是否有触发拖动开始时间
                this.touch.initiated = true;
                // 记录第一次手指触摸的位置
                this.touch.startX = e.touches[0].pageX;
                // 记录进度条当前的宽度
                this.touch.left = this.$refs.progress.clientWidth;
            },
            // 设置进度条拖动中的事件
            progressTouchMove (e) {
                // 如果没有拖动就不触发以下事件
                if (!this.touch.initiated) {
                    return;
                }
                // 获取要偏移的宽度
                const deltaX = e.touches[0].pageX - this.touch.startX;
                // 获取偏移量
                const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX));
                // 调用进度条偏移方法
                this._offset(offsetWidth);
            },
            // 设置进度条拖动结束的事件
            progressTouchEnd () {
                // 设置拖动结束
                this.touch.initiated = false;
                // 拖动结束后派发事件当前进度条的百分比
                this._percentChange();
            },
            // 点击进度条事件
            progressClick (e) {
                // 获取页面元素的位置
                const rect = this.$refs.progressBar.getBoundingClientRect();
                // 获取当前点击的进度条偏移的长度
                const offsetWidth = e.pageX - rect.left;
                // 调用进度条偏移方法
                this._offset(offsetWidth);
                // 点击结束后派发事件当前进度条的百分比
                this._percentChange();
            },
            // 进度条偏移方法
            _offset (offterWidth) {
                if (offterWidth < 0) {
                    return;
                }
                // 设置小球偏移位置
                this.$refs.progressBtn.style[transform] = `translate3d(${offterWidth}px,0,0)`;
                // 设置进度条偏移的宽度
                this.$refs.progress.style.width = `${offterWidth}px`;
            },
            // 拖动结束后派发事件当前进度条的百分比
            _percentChange () {
                // 获取进度条宽度
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                // 偏移的位置
                const percent = this.$refs.progress.clientWidth / barWidth;

                if (!percent) {
                    return;
                }

                // 派发当前进度条的百分比事件
                this.$emit('percentChange', percent);
            }
        },
        watch: {
            // 监听播放进度 对进度条进行操作
            progressBar (newProgressBar) {
                if (newProgressBar >= 0 && !this.touch.initiated) {
                    // 设置进度条宽度 - 去进度条点的宽度
                    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                    // 计算出进度条偏移的宽度
                    const offterWidth = newProgressBar * barWidth;
                    // 设置进度条偏移
                    this._offset(offterWidth);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*外层*/
    .progress-bar {
        height: px2rem(60px);
    }

    /*内层*/
    .bar-inner {
        position: relative;
        top: px2rem(26px);
        height: px2rem(8px);
        border-radius: px2rem(10px);
        background: $bar-inner-color;
    }

    /*播放进度*/
    .progress {
        position: absolute;
        height: 100%;
        background: $progress-color;
    }

    /*进度条点*/
    .progress-btn-wrapper {
        position: absolute;
        left: px2rem(-16px);
        top: px2rem(-26px);
        width: px2rem(60px);
        height: px2rem(60px);
        .progress-btn {
            position: relative;
            top: px2rem(14px);
            left: px2rem(14px);
            box-sizing: border-box;
            width: px2rem(32px);
            height: px2rem(32px);
            border-radius: 50%;
            background: $progress-color;
        }
    }
</style>
