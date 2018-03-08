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
            <!--信息弹框-->
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
        <transition name="alert-prompt">
            <!--警告弹框-->
            <v-alert color="error" icon="warning" v-show="warningPrompt" class="alert-Prompt">
                {{warningPromptTxt}}
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
                 * 信息弹框
                 * @type {Boolean}
                 * */
                infoPrompt: false,
                /*
                 * 成功弹框
                 * @type {Boolean}
                 * */
                successPrompt: false,
                /*
                 * 警告弹框
                 * @type {Boolean}
                 * */
                warningPrompt: false,
                /*
                * 设置暂时不能请求
                * @type {Boolean}
                * */
                noClickBtn: true,
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
                alertPromptTxt: '',
                /*
                 * 警告提示框文字
                 * @type {String}
                 * */
                warningPromptTxt: '',
                /*
                 * 记录按钮点击次数
                 * @type {Number}
                 * */
                btnClickNumber: -1,
                /*
                 * 设置按钮点击限制次数
                 * @type {Number}
                 * */
                btnClickRangeNumber: 10,
                /*
                 * 延迟时间
                 * @type {Number}
                 * */
                delayTime: 60000
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
                getShowLogin: 'showLogin',
                /**
                 * 获取当前收藏列表
                 * @type {Array}
                 */
                getFavoriteList: 'favoriteList',
                /**
                 * 获取播放历史
                 * @type {Array}
                 */
                getPlayHistory: 'playHistory'
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

                this.btnClickNumber = -1;
                this.btnClickRangeNumber = 10;
                this.delayTime = 60000;
                this.noClickBtn = true;
            },
            // 取消按钮
            back () {
                this.setShowLogin(false);

                // 一些初始化操作
                this._initSome();
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
            LoginUsername (username) {
                this.loginUsername = username;
            },
            // 获取登录密码输入框信息
            LoginPassword (password) {
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
                    // 获取延迟时间
                    let delayTime = parseInt((this.delayTime % (1000 * 60 * 60)) / (1000 * 60));
                    // 获取输入框数据
                    let loginUser = {'username': this.loginUsername, 'password': this.loginPassword};

                    if (this.noClickBtn) {
                        // 增加点击次数
                        this.btnClickNumber++;
                    }
                    if (this.btnClickNumber === this.btnClickRangeNumber && this.noClickBtn) {
                        this.noClickBtn = false;

                        // 弹出框
                        clearTimeout(alterTime);
                        this.warningPrompt = false;
                        this.warningPromptTxt = `请求过于频繁请${delayTime}分钟后再试`;
                        let alterTime = setTimeout(() => {
                            this.warningPrompt = true
                        }, 500);
                    }
                    if (!this.noClickBtn && this.btnClickNumber === this.btnClickRangeNumber) {
                        // 触发次数
                        this.number = 0;

                        clearTimeout(clearDelay);
                        // 延迟时间
                        let clearDelay = setTimeout(() => {
                            // 触发次数 > 0 直接return
                            if (this.number > 0) {
                                return;
                            }
                            this.number++;

                            // 设置可以点击
                            this.noClickBtn = true;

                            // 设置按钮点击限制次数 * 2
                            this.btnClickRangeNumber = this.btnClickRangeNumber * 2;

                            // 设置限制时间
                            this.delayTime = this.delayTime * 2
                        }, this.delayTime);

                        return;
                    }

                    // 获取用户是否登录成功
                    this.setSelectUser(loginUser);
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
                    clearTimeout(alterTime);

                    this.infoPrompt = true;
                    this.alertPromptTxt = '请勿输入特殊字符的账号或密码';

                    let alterTime = setTimeout(() => {
                        this.infoPrompt = false
                    }, 500);
                }
                else if (this.registeredPassword.length < 6) {
                    clearTimeout(alterTime);

                    this.infoPrompt = true;
                    this.alertPromptTxt = '请请输入长度大于6位的密码';

                    let alterTime = setTimeout(() => {
                        this.infoPrompt = false
                    }, 500);
                }
                else if (this.registeredPassword !== this.registeredAgainPassword) {
                    clearTimeout(alterTime);

                    this.infoPrompt = true;
                    this.alertPromptTxt = '请输入两个相同的密码';

                    let alterTime = setTimeout(() => {
                        this.infoPrompt = false
                    }, 500);
                }
                else {
                    // 获取延迟时间
                    let delayTime = parseInt((this.delayTime % (1000 * 60 * 60)) / (1000 * 60));
                    // 获取输入框数据
                    let registeredUser = {'username': this.registeredUsername, 'password': this.registeredPassword};


                    if (this.noClickBtn) {
                        // 增加点击次数
                        this.btnClickNumber++;
                    }
                    if (this.btnClickNumber === this.btnClickRangeNumber && this.noClickBtn) {
                        this.noClickBtn = false;

                        // 弹出框
                        clearTimeout(alterTime);
                        this.warningPrompt = false;
                        this.warningPromptTxt = `请求过于频繁请${delayTime}分钟后再试`;
                        let alterTime = setTimeout(() => {
                            this.warningPrompt = true
                        }, 500);
                    }

                    if (!this.noClickBtn && this.btnClickNumber === this.btnClickRangeNumber) {
                        // 触发次数
                        this.number = 0;

                        clearTimeout(clearDelay);
                        // 延迟时间
                        let clearDelay = setTimeout(() => {
                            // 触发次数 > 0 直接return
                            if (this.number > 0) {
                                return;
                            }
                            this.number++;

                            // 设置可以点击
                            this.noClickBtn = true;

                            // 设置按钮点击限制次数 * 2
                            this.btnClickRangeNumber = this.btnClickRangeNumber * 2;

                            // 设置限制时间
                            this.delayTime = this.delayTime * 2
                        }, this.delayTime);

                        return;
                    }

                    // 获取用户注册接口
                    this.setAddUser(registeredUser);
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
                 * @type {Object}
                 */
                setSelectUser: 'getSelectUser',
                /**
                 * 获取用户注册接口
                 * @type {Object}
                 */
                setAddUser: 'getAddUser',
                /**
                 * 同步用户收藏歌曲和最近播放歌曲到数据库接口
                 * @type {Object}
                 */
                setUserSongList: 'getUserSongList'
            })
        },
        watch: {
            // 监听用户是否登录成功
            getSelectUser (data) {
                if (data.code === 0) {
                    // 如果有喜欢列表 或者 播放历史才会去同步
                    if (this.getFavoriteList.length || this.getPlayHistory.length) {
                        // 同步用户收藏歌曲和最近播放歌曲到数据库接口
                        let setUserSongList = {'username': this.loginUsername, 'favorite': this.getFavoriteList, 'playHistory': this.getPlayHistory};
                        this.setUserSongList(setUserSongList);
                    }

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
                    // 如果有喜欢列表 或者 播放历史才会去同步
                    if (this.getFavoriteList.length || this.getPlayHistory.length) {
                        // 同步用户收藏歌曲和最近播放歌曲到数据库接口
                        let setUserSongList = {'username': this.loginUsername, 'favorite': this.getFavoriteList, 'playHistory': this.getPlayHistory};
                        this.setUserSongList(setUserSongList);
                    }

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
