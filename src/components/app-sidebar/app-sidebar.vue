<template>
    <sidebar v-model="sidebarStatus">
        <!-- sidebar 内容部分 -->
        <div class="sidebar">
            <ul class="one">
                <li class="item-list">
                    <!--标题-->
                    <p class="item-title">个性装扮</p>
                    <!--名称-->
                    <p class="name">默认套装</p>
                </li>
                <li class="item-list">
                    <!--标题-->
                    <p class="item-title">消息中心</p>
                </li>
                <li class="item-list">
                    <!--标题-->
                    <p class="item-title">免流量服务</p>
                    <!--icon-->
                    <v-icon class="server-icon">fiber_manual_record</v-icon>
                </li>
            </ul>
            <ul class="two">
                <li class="item-list">
                    <!--标题-->
                    <p class="item-title">定时开关</p>
                    <v-app>
                        <v-switch v-model="ex11"
                                  color="success"
                                  hide-details></v-switch>
                    </v-app>
                </li>
            </ul>
        </div>
    </sidebar>
</template>

<script>
    import {mapState} from 'vuex';
    import Sidebar from './Sidebar';

    export default {
        data () {
            return {
                ex11: ['success']
            }
        },
        computed: {
            ...mapState('appShell/appSidebar', [
                'show',
            ]),
            sidebarStatus: {
                get() {
                    return this.show;
                },
                set(val) {
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
            Sidebar
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .application.theme--light{
        background: none;
    }

    .sidebar {
        position: absolute;
        top: px2rem(88px);
        bottom: px2rem(120px);
        width: 100%;
        ul {
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
        /*第二组列表*/
        .two {
            margin-top: px2rem(40px);
        }
    }
</style>
