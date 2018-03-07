<template>
    <transition name="silder-login">
        <div class="login-input-wrapper" v-if="setShowInput">
            <!--返回按钮-->
            <div class="back" @click="back">
                <!--图标-->
                <v-icon class="icon">keyboard_arrow_left</v-icon>
                <!--标题-->
                <p>返回</p>
            </div>
            <!--标题-->
            <div class="title-wrapper">
                <h1 class="tit">添加账号</h1>
                <p class="txt">添加用于登录的账号</p>
            </div>
            <!--输入框-->
            <div class="input-wrapper">
                <!--登录用户名-->
                <div class="user-name">
                    <!--输入框-->
                    <input class="input"
                           type="text"
                           placeholder="请输入账号"
                           spellcheck="false"
                           v-model="loginUsername"/>
                    <!--删除按钮-->
                    <v-icon class="icon-clear" v-show="loginUsername" @click="clearUsername">clear</v-icon>
                </div>
                <!--登录密码-->
                <div class="password">
                    <!--输入框-->
                    <input class="input"
                           type="password"
                           placeholder="密码"
                           spellcheck="false"
                           v-model="loginPassword"/>
                    <!--删除按钮-->
                    <v-icon class="icon-clear" v-show="loginPassword" @click="clearPassword">clear</v-icon>
                </div>
            </div>
            <!--确认按钮-->
            <v-btn block color="light-blue lighten-1" dark class="end-btn" @click="loginEndBtn">登录</v-btn>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    export default {
        data () {
            return {
                /*
                * 是否显示登录输入
                * @type {Boolean}
                * */
                setShowInput: false,
                /*
                * 登录用户名
                * @type {String}
                * */
                loginUsername: '',
                /*
                * 登录密码
                * @type {String}
                * */
                loginPassword: ''
            }
        },
        methods: {
            // 返回按钮
            back () {
                this.hide();
            },
            // 显示
            show () {
                // 初始化输入框
                this.loginUsername = '';
                this.loginPassword = '';

                this.setShowInput = true;
            },
            // 隐藏
            hide () {
                this.setShowInput = false;
            },
            // 清除用户名
            clearUsername () {
                this.loginUsername = ''
            },
            // 清除密码
            clearPassword () {
                this.loginPassword = ''
            },
            // 点击登录按钮
            loginEndBtn () {
                this.$emit('loginEndBtn', true);
            }
        },
        watch: {
            loginUsername (newUsername) {
                this.$emit('loginUsername', newUsername)
            },
            loginPassword (newPassword) {
                this.$emit('loginPassword', newPassword)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    // 登录出现动画
    .silder-login-enter-active, .silder-login-leave-active {
        transition: all 0.3s;
    }

    .silder-login-enter, .silder-login-leave-to {
        transform: translate3d(100%, 0, 0);
    }

    .login-input-wrapper {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 200;
        background: #fff;
    }

    /*返回按钮*/
    .back {
        position: relative;
        top: 0;
        text-align: left;
        line-height: px2rem(120px);
        /*图标*/
        .icon {
            display: inline-block;
            font-size: px2rem(80px);
            color: #787878;
            width: px2rem(50px);
        }
        p {
            display: inline-block;
            margin: 0;
            color: #787878;
            font-size: px2rem(32px);
        }
    }

    /*标题*/
    .title-wrapper {
        display: flex;
        flex-direction: column;
        padding: 0 px2rem(100px);
        text-align: left;
        .tit {
            margin-bottom: px2rem(20px);
            font-size: px2rem(60px);
        }
        .txt {
            margin: 0;
            font-size: px2rem(28px);
        }
    }

    /*输入框*/
    .input-wrapper {
        position: relative;
        margin-top: px2rem(40px);
        display: flex;
        flex-direction: column;
        padding: 0 px2rem(100px);
        width: 100%;
        .input::-webkit-input-placeholder {
            text-shadow: 0 0 0 #bbbbbb;
        }
        .input {
            padding-right: px2rem(80px);
            width: 100%;
            height: px2rem(90px);
            text-align: left;
            font-size: px2rem(36px);
            border-bottom: px2rem(2px) solid #c8c7cc;
            color: #0091dc !important;
            text-shadow: 0 0 0 #000;
            -webkit-text-fill-color: transparent;
        }
        /*删除按钮*/
        .icon-clear {
            position: absolute;
            right: px2rem(120px);
            margin: px2rem(-70px) 0;
            font-size: px2rem(36px);
            line-height: px2rem(50px);
            color: #c9c9c9;
        }
    }

    /*确认按钮*/
    .end-btn {
        margin: px2rem(40px) px2rem(100px) 0 px2rem(100px);
        height: px2rem(70px);
        width: px2rem(550px);
        color: #fff;
        box-shadow: none !important;
        border-radius: px2rem(5px);
    }
</style>
