<template>
    <transition name="login-silder">
        <div class="login-wrapper" v-show="getShowLogin">
            <!--取消按钮-->
            <div class="exit" @click="exit">
                <p>取消</p>
            </div>
            <!--登录按钮-->
            <div class="login-content">
                <!--微信登录-->
                <div class="weChat-login">
                    <p>登录</p>
                </div>
                <!--QQ登录-->
                <div class="qq-login">
                    <p>注册登录</p>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';

    export default {
        data () {
            return {}
        },
        computed: {
            ...mapState('appStore', {
                /**
                 * 是否显示登录组件
                 * @type {Boolean}
                 */
                getShowLogin: 'showLogin'
            })
        },
        methods: {
            // 取消按钮
            exit () {
                this.setShowLogin(false);
            },
            ...mapActions('appStore', {
                /**
                 * 是否显示登录组件
                 * @type {Boolean}
                 */
                setShowLogin: 'showLogin'
            })
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*登录页面进入动画*/
    .login-silder-enter-active, .login-silder-leave-active {
        transition: all .3s;
    }

    .login-silder-enter, .login-silder-leave-to {
        transform: translate3d(0, 100%, 0);
    }

    .login-wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: url("../../common/img/login-bg.jpg") no-repeat;
        background-size: cover;
        z-index: 200;
    }

    /*取消按钮*/
    .exit {
        position: absolute;
        top: 0;
        padding-left: px2rem(40px);
        line-height: px2rem(120px);
        p {
            margin: 0;
            color: #fff;
            font-size: px2rem(32px);
        }
    }

    /*登录按钮*/
    .login-content {
        position: absolute;
        bottom: px2rem(100px);
        padding: 0 px2rem(80px);
        width: 100%;
        font-size: px2rem(28px);
    }

    /*微信登录*/
    .weChat-login{
        margin-bottom: px2rem(20px);
        width: 100%;
        height: px2rem(70px);
        line-height: px2rem(70px);
        color: #fff;
        background: $weChat-login-bgcolor;
        p{
            margin: 0;
        }
    }

    /*qq登录*/
    .qq-login{
        width: 100%;
        height: px2rem(70px);
        line-height: px2rem(70px);
        color: #fff;
        background: $qq-login-bgcolor;
        p{
            margin: 0;
        }
    }


</style>
