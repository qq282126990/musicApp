<template>
    <div class="tab-router">
        <!--标题列表-->
        <div class="teb-li" v-for="item in tebLi">
            <div class="tab" v-for="item in item.tab" @click="selectRouter(item)">
                <!--图标-->
                <i class="iconfont" :class="item.iconfont"></i>
                <!--导航名称-->
                <span class="name">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        props: {
            /*
             * 设置标签信息
             * */
            tebLi: {
                type: Array,
                default: []
            }
        },
        methods: {
            selectRouter(item) {
                this.$emit('selectRouter', item);
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    .tab-router {
        margin: 0 px2rem(20px);
        box-sizing: border-box;
        height: px2rem(160px);
        /*box-shadow: 0px 2px 6px #999;*/
        background: $tab-router-bgcolor;
        transition: all .2s;
        // transform: translate3d(0, px2rem(-10px), 0);
    }

    /*标题列表*/
    .teb-li {
        display: flex;
        overflow: hidden;
        justify-content: center;
        width: 100%;
        height: px2rem(160px);
    }

    .tab {
        position: relative;
        flex: 1;
        display: flex;
        text-align: center;
        flex-grow: 1;
        flex-wrap: wrap;
        align-items: flex-end;
        line-height: px2rem(80px);
        height: 100%;
        /*图标*/
        .iconfont {
            position: absolute;
            top: 10px;
            font-size: px2rem(56px);
            width: 100%;
            color: $IconColor;
        }
        /*导航名称*/
        .name {
            flex: 1;
            text-align: center;
            font-weight: normal;
            font-size: px2rem(24px);
            color: $textColor;
        }
    }
    .icon-shipincopy{
        font-size: px2rem(44px) !important;
        font-weight: bold;
    }
    .icon-paixingbang{
        font-size: px2rem(66px) !important;
    }
</style>
