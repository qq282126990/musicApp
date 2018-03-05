<template>
    <sidebar v-model="sidebarStatus">
        <!-- sidebar 内容部分 -->
        <scroll class="sidebar-scroll">
            <div class="sidebar">
                <ul>
                    <li class="item-list" v-for="item in ulData.one">
                        <!--标题-->
                        <p class="item-title">{{item.title}}</p>
                        <!--名称-->
                        <p class="name">{{item.name}}</p>
                        <!--icon-->
                        <v-icon class="server-icon" v-if="item.icon">fiber_manual_record</v-icon>
                    </li>
                </ul>
                <ul>
                    <li class="item-list">
                        <!--标题-->
                        <p class="item-title">定时开关</p>
                        <!--切换按钮-->
                        <v-app :key="1">
                            <v-switch v-model="switchOne"
                                      value="Jacob"
                                      color="green accent-4"
                                      hide-details></v-switch>
                        </v-app>
                    </li>
                    <li class="item-list">
                        <!--标题-->
                        <p class="item-title">仅Wi-Fi联网</p>
                        <!--切换按钮-->
                        <v-app :key="2">
                            <v-switch v-model="switchTwo"
                                      value="Jacob"
                                      color="green accent-4"
                                      hide-details></v-switch>
                        </v-app>
                    </li>
                    <li class="item-list">
                        <!--标题-->
                        <p class="item-title">流量提示</p>
                        <!--切换按钮-->
                        <v-app :key="3">
                            <v-switch v-model="switchThree"
                                      color="green accent-4"
                                      value="Jacob"></v-switch>
                        </v-app>
                    </li>
                    <li class="item-list">
                        <!--标题-->
                        <p class="item-title">听歌偏好</p>
                        <!--名称-->
                        <p class="name">未开放</p>
                    </li>
                </ul>
                <ul>
                    <li class="item-list" v-for="item in ulData.three">
                        <!--标题-->
                        <p class="item-title">{{item.title}}</p>
                        <!--名称-->
                        <p class="name">{{item.name}}</p>
                    </li>
                </ul>
            </div>
        </scroll>
        <!--底部-->
        <div class="sidebar-footer">
            <!--设置-->
            <div class="footer-set-up">
                <!--图标-->
                <v-icon class="icon-set">settings</v-icon>
                <!--名称-->
                <span class="name">设置</span>
            </div>
            <!--退出登录-->
            <div class="footer-exit-login">
                <!--图标-->
                <v-icon class="icon-exit">exit_to_app</v-icon>
                <!--名称-->
                <span class="name">退出登录/关闭</span>
            </div>
        </div>
    </sidebar>
</template>

<script>
    import {mapState} from 'vuex';
    import Sidebar from './Sidebar';
    // 滚动组件
    import Scroll from 'base/scroll/scroll';

    export default {
        data () {
            return {
                switchOne: ['switchOne'],
                switchTwo: ['switchTwo'],
                switchThree: ['switchThree'],
                ulData: {
                    one: [{title: '个性装扮', name: '未开放'},
                        {title: '消息中心', name: '未开放'},
                        {title: '免流量服务', icon: 'fiber_manual_record'}],
                    three: [{title: '微云音乐网盘', name: '未开放'},
                        {title: '导入外部歌单', name: '未开放'},
                        {title: '清理空间', name: '未开放'},
                        {title: '帮助与返馈', name: '未开放'},
                        {title: '关于QQ音乐破解版'}]
                }
            }
        },
        computed: {
            ...mapState('appShell/appSidebar', [
                'show',
            ]),
            sidebarStatus: {
                get () {
                    return this.show;
                },
                set (val) {
                    if (val) {
                        this.$emit('show-sidebar');
                    }
                    else {
                        this.$emit('hide-sidebar');
                    }
                }
            }
        },
        components: {
            Sidebar,
            Scroll
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .application.theme--light {
        background: none;
    }

    /*滚动组件*/
    .sidebar-scroll {
        margin-top: px2rem(88px);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: px2rem(120px);
        overflow: hidden;
    }

    .sidebar {
        height: max-content;
        ul {
            margin-bottom: px2rem(40px);
            padding: 0 px2rem(40px);
            display: flex;
            flex-direction: column;
            .item-list {
                flex: 1;
                display: flex;
                justify-content: space-between;
                font-size: px2rem(24px);
                line-height: px2rem(70px);
                height: px2rem(70px);
                p {
                    display: inline-block;
                    margin: 0;
                }
                /*标题*/
                .item-title {
                    flex: 1;
                    text-align: left;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                /*名称*/
                .name {
                    flex: 1;
                    text-align: right;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: #999;
                }
                /*服务icon*/
                .server-icon {
                    font-size: px2rem(24px);
                    color: red;
                }
            }
        }
    }

    /*底部*/
    .sidebar-footer {
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 0;
        padding: 0 px2rem(40px);
        width: 100%;
        height: px2rem(110px);
        box-shadow: 0 0 10px rgba(0, 0, 0, .1);
        /*设置*/
        .footer-set-up {
            flex: 1;
            display: flex;
            line-height: px2rem(110px);
            text-align: left;
        }
        /*退出登录*/
        .footer-exit-login {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            line-height: px2rem(110px);
            text-align: right;
        }
        /*名称*/
        .name {
            margin: 0 0 0 px2rem(10px);
            font-size: px2rem(28px);
        }
        /*设置图标*/
        .icon-set {
            font-size: px2rem(40px);
            color: #1ad27c;
        }
        /*退出图标*/
        .icon-exit {
            transform: rotateY(180deg);
            font-size: px2rem(40px);
            color: #1ad27c;
        }
    }
</style>
