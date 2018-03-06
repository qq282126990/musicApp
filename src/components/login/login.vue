<template>
    <div>
        <transition name="login-silder">
            <div class="login-wrapper" v-show="getShowLogin">
                <!--取消按钮-->
                <div class="back" @click="back">
                    <p>取消</p>
                </div>
                <!--登录按钮-->
                <div class="login-content">
                    <!--登录-->
                    <div class="login-btn" @click="loginBtn">
                        <p>登录</p>
                    </div>
                    <!--注册-->
                    <div class="registered-btn" @click="registeredBtn">
                        <p>注册登录</p>
                    </div>
                </div>
            </div>
        </transition>
        <!--用户登录输入框-->
        <login-input @loginUsername="LoginUsername"
                     @loginPassword="LoginPassword"
                     @loginEndBtn="loginEndBtn"
                     ref="loginInput"></login-input>
        <!--用户注册输入框-->
        <registered-input @registeredUsername="RegisteredUsername"
                          @registeredPassword="RegisteredPassword"
                          @registeredAgainPassword="RegisteredAgainPassword"
                          @registeredEndBtn="RegisteredEndBtn"
                          ref="registeredInput"></registered-input>
        <!--弹出提示框-->
        <transition name="alert-prompt">
            <!--警告弹框-->
            <v-alert color="info" icon="info" v-show="infoPrompt" class="alert-Prompt">
                {{alertPromptTxt}}
            </v-alert>
        </transition>
        <transition name="alert-prompt">
            <!--成功弹框-->
            <v-alert color="success" icon="check_circle" v-show="successPrompt" class="alert-Prompt">
                {{alertPromptTxt}}
            </v-alert>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapActions, mapState} from 'vuex';
    // 用户登录输入框
    import LoginInput from 'base/login-input/login-input';
    // 用户注册输入框
    import RegisteredInput from 'base/registered-input/registered-input';

    export default {
        data () {
            return {
                /*
                 * 警告弹框
                 * @type {String}
                 * */
                infoPrompt: false,
                /*
                 * 成功弹框
                 * @type {String}
                 * */
                successPrompt: false,
                /*
                * 登录用户名
                * @type {String}
                * */
                loginUsername: '',
                /*
                * 登录密码
                * @type {String}
                * */
                loginPassword: '',
                /*
               * 注册用户名
               * @type {String}
               * */
                registeredUsername: '',
                /*
                * 注册密码
                * @type {String}
                * */
                registeredPassword: '',
                /*
                * 再次输入注册密码
                * @type {String}
                * */
                registeredAgainPassword: '',
                /*
                * 弹出提示框文字
                * @type {String}
                * */
                alertPromptTxt: ''
            }
        },
        mounted () {
            this._initSome();
        },
        computed: {
            ...mapState('appStore', {
                /**
                 * 是否显示登录组件
                 * @type {Boolean}
                 */
                getShowLogin: 'showLogin'
            }),
            ...mapState('asyncAjax', {
                /**
                 * 获取用户是否登录成功
                 * @type {String}
                 */
                getSelectUser: 'selectUser',
                /**
                 * 获取用户是否注册成功
                 * @type {String}
                 */
                getAddUser: 'addUser'
            })
        },
        methods: {
            // 一些初始化操作
            _initSome () {
                this.loginUsername = '';
                this.loginPassword = '';
                this.registeredUsername = '';
                this.registeredPassword = '';
                this.registeredAgainPassword = '';
            },
            // 取消按钮
            back () {
                this.setShowLogin(false);
            },
            // 登录按钮
            loginBtn () {
                this.$refs.loginInput.show();
            },
            // 注册登录按钮
            registeredBtn () {
                this.$refs.registeredInput.show();
            },
            // 获取登录用户名输入框信息
            LoginPassword (username) {
                this.loginUsername = username;
            },
            // 获取登录密码输入框信息
            LoginUsername (password) {
                this.loginPassword = password;
            },
            // 点击登录按钮
            loginEndBtn () {
                if (!this.loginUsername.length || !this.loginPassword.length) {
                    clearTimeout(alterTime);

                    this.infoPrompt = true;
                    this.alertPromptTxt = '请输入用户名或密码';

                    let alterTime = setTimeout(() => {
                        this.infoPrompt = false
                    }, 500);
                }
                else {
                    let data = {'username': this.loginUsername, 'password': this.loginPassword};

                    // 获取用户是否登录成功
                    this.setSelectUser(data);
                }
            },
            // 获取注册用户名
            RegisteredUsername (username) {
                this.registeredUsername = username;
            },
            // 获取注册密码
            RegisteredPassword (password) {
                this.registeredPassword = password;
            },
            // 获取再次输入的密码
            RegisteredAgainPassword (againPassword) {
                this.registeredAgainPassword = againPassword;
            },
            // 注册确认按钮
            RegisteredEndBtn () {
                // 用户名正则匹配
                let userNameReg = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
                if (!this.registeredUsername.length || !this.registeredPassword.length) {
                    clearTimeout(alterTime);

                    this.infoPrompt = true;
                    this.alertPromptTxt = '请先输入账号或密码';

                    let alterTime = setTimeout(() => {
                        this.infoPrompt = false
                    }, 500);
                }
                else if (!userNameReg.test(this.registeredUsername)) {
                    this.infoPrompt = true;
                    this.alertPromptTxt = '请勿输入特殊字符的账号或密码';

                    let alterTime = setTimeout(() => {
                        this.infoPrompt = false
                    }, 500);
                }
                else if (this.registeredPassword !== this.registeredAgainPassword) {
                    this.infoPrompt = true;
                    this.alertPromptTxt = '请输入两个相同的密码';

                    let alterTime = setTimeout(() => {
                        this.infoPrompt = false
                    }, 500);
                }
                else {
                    let data = {'username': this.registeredUsername, 'password': this.registeredPassword};

                    // 获取用户注册接口
                    this.setAddUser(data);
                }
            },
            ...mapActions('appStore', {
                /**
                 * 是否显示登录组件
                 * @type {Boolean}
                 */
                setShowLogin: 'showLogin'
            }),
            ...mapActions('asyncAjax', {
                /**
                 * 获取用户登录接口
                 * @type {String}
                 */
                setSelectUser: 'getSelectUser',
                /**
                 * 获取用户注册接口
                 * @type {String}
                 */
                setAddUser: 'getAddUser'
            })
        },
        watch: {
            // 监听用户是否登录成功
            getSelectUser (data) {
                if (data.code === 0) {
                    this.successPrompt = true;
                    this.setShowLogin(false);
                    this.alertPromptTxt = '登录成功';

                    setTimeout(() => {
                        this.successPrompt = false;
                        // 登录成功返回页面
                        this.$refs.loginInput.hide();
                        // 初始化
                        this._initSome();
                    }, 500);
                }
                else {
                    this.infoPrompt = true;
                    this.alertPromptTxt = '请输入正确的账号或密码';

                    setTimeout(() => {
                        this.infoPrompt = false;
                    }, 1000);
                }
            },
            // 监听用户是否注册成功
            getAddUser (data) {
                if (data.code === 0) {
                    this.successPrompt = true;
                    this.setShowLogin(false);
                    this.alertPromptTxt = '注册成功';

                    setTimeout(() => {
                        this.successPrompt = false;
                        // 注册成功返回页面
                        this.$refs.registeredInput.hide();
                        // 初始化
                        this._initSome();
                    }, 1000);
                }
                else {
                    this.infoPrompt = true;
                    this.alertPromptTxt = '账号已被注册，请重新输入';

                    setTimeout(() => {
                        this.infoPrompt = false;
                    }, 1000);
                }
            }
        },
        components: {
            LoginInput,
            RegisteredInput
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

    /*弹出框动画*/
    .alert-prompt-enter-active, .alert-prompt-leave-active {
        transition: all .5s;
    }

    .alert-prompt-enter, .alert-prompt-leave-to {
        opacity: 0;
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

    /*返回按钮*/
    .back {
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

    /*登录*/
    .login-btn {
        margin-bottom: px2rem(20px);
        width: 100%;
        height: px2rem(70px);
        line-height: px2rem(70px);
        color: #fff;
        background: $weChat-login-bgcolor;
        p {
            margin: 0;
        }
    }

    /*注册*/
    .registered-btn {
        width: 100%;
        height: px2rem(70px);
        line-height: px2rem(70px);
        color: #fff;
        background: $qq-login-bgcolor;
        p {
            margin: 0;
        }
    }

    /*弹出提示框*/
    .alert-Prompt {
        position: absolute;
        top: px2rem(30px);
        left: 0;
        right: 0;
        margin: 0 px2rem(60px);
        padding: px2rem(20px);
        font-size: px2rem(30px);
        z-index: 200;
        border: none;
        border-radius: px2rem(10px);
    }

</style>
