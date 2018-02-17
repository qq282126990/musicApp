<template>
    <transition name="confirm-fade">
        <div class="confirm-wrapper" @click.stop v-show="showFlag">
            <div class="confirm">
                <!--内容-->
                <div class="confirm-content">
                    <!--标题-->
                    <p class="title">提示</p>
                    <!--文字-->
                    <p class="text">{{text}}</p>
                    <!--按钮-->
                    <div class="operate">
                        <div class="operate-btn exit"
                             @click="exit">{{exitText}}</div>
                        <div class="operate-btn left"
                             @click="end" >{{endBtnText}}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            /*
            * 文本内容
            * @type {String}
            * */
            text: {
                type: String,
                default: ''
            },
            /*
             * 确定按钮文字
             * @type {String}
             * */
            endBtnText: {
                type: String,
                default: '确定'
            },
            /*
             * 取消按钮文字
             * @type {String}
             * */
            exitText: {
                type: String,
                default: '取消'
            }
        },
        data() {
            return {
                // 设置弹出框显示隐藏
                showFlag: false
            };
        },
        methods: {
            // 显示弹出框
            show() {
                this.showFlag = true;
            },
            // 隐藏弹出框
            hide() {
                this.showFlag = false;
            },
            // 发送取消事件
            exit() {
                this.hide();
                this.$emit('exit');
            },
            // 发送确定事件
            end() {
                this.hide();
                this.$emit('end');
            }
        }
    };
</script>

<style scoped lang="scss">
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .confirm-fade-enter-active, .confirm-fade-leave-active {
        transition: all .5s;
        .confirm-content{
            transition: all .5s;
        }
    }
    .confirm-fade-enter, .confirm-fade-leave-to{
        opacity: 0;
        .confirm-content{
            transform: scale(.9);
        }
    }

    /*.confirm-fade-enter-active {*/
        /*animation: confirm-fadein 0.3s;*/
        /*.confirm-content {*/
            /*animation: confirm-zoom 0.3s;*/
        /*}*/
    /*}*/

    .confirm-wrapper {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 998;
        background-color: rgba(0, 0, 0, .5);
        .confirm {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            z-index: 999;
        }
    }

    /*内容*/
    .confirm-content {
        width: px2rem(540px);
        border-radius: px2rem(10px);
        border-top: 5px solid #16c975;
        background: #fff;
        /*提示*/
        .title {
            margin-top: px2rem(20px);
            line-height: px2rem(50px);
            font-size: px2rem(34px);
        }
        /*文本*/
        .text {
            padding: 0 px2rem(40px);
            line-height: px2rem(100px);
            box-sizing: border-box;
            text-align: left;
            font-size: px2rem(30px);
            color: #999;
        }
        /*按钮*/
        .operate {
            display: flex;
            align-items: center;
            text-align: center;
            font-size: px2rem(34px);
            height: px2rem(100px);
            .operate-btn {
                flex: 1;
                padding: px2rem(20px) 0;
                line-height: px2rem(50px);
                border-top: 1px solid rgba(117, 117, 117, .2);
                &.exit {
                    color: #16c975;
                }
                &.left {
                    border-left: 1px solid rgba(117, 117, 117, .2);
                }
            }
        }
    }

    @keyframes confirm-fadein {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    @keyframes confirm-zoom {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
</style>
