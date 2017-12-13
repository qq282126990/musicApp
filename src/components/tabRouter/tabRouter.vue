<template>
    <div class="tab-Router">
        <ul>
            <li class="teb-li">
                <div class="tab" v-for="item in tebLi">
                    <i class="iconfont" :class="item.iconfont"></i>
                    <span class="name">{{item.name}}</span>
                </div>
            </li>
            <li class="teb-li"></li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                tebLi: [
                    {'name': '歌手',
                        'iconfont': 'icon-morengeshoutu'},
                    {"name": "排行",
                        'iconfont': 'icon-zhuanjiguangpan'},
                    {"name": "电台",
                        'iconfont': 'icon-ziyuan'}]
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .tab-Router {
        position: relative;
        ul {
            padding: 0;
            width: 100%;
        }
    }

    .teb-li {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: px2rem(80px);
    }

    .tab {
        flex: 1;
        display: flex;
        justify-content: center;
        text-align: center;
        line-height: px2rem(80px);
        height: 100%;
        i{
            float: left;
            font-size: 25px;
            color: rgba(49,194,124,0.95);
        }
        .name{
            text-align: center;
            margin-left: 10px;
            font-weight: normal;
            @include font-dpr(16px);
        }
    }
</style>