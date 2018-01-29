<template>
    <div class="tab-Router">
        <div class="teb-li" v-for="item in tebLi">
            <div class="tab" v-for="item in item.tab">
                <i class="iconfont" :class="item.iconfont"></i>
                <span class="name">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        data() {
            return {
                tebLi: [{
                    tab: [{'name': '歌手', 'iconfont': 'icon-maikefeng'},
                        {'name': '排行', 'iconfont': 'icon-paixingbang1'},
                        {'name': '主播电台', 'iconfont': 'icon-erji3'},
                        {'name': '数字专辑', 'iconfont': 'icon-zhuanjiguangpan'}
                    ]
                }]
            };
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .tab-Router {
        margin: 0 px2rem(20px);
        box-sizing: border-box;
        height: px2rem(160px);
        /*box-shadow: 0px 2px 6px #999;*/
        background: $tab-router-bgcolor;
        transition: all .2s;
       // transform: translate3d(0, px2rem(-10px), 0);
    }

    .teb-li {
        display: flex;
        overflow: hidden;
        justify-content: center;
        width: 100%;
        height: px2rem(160px);
    }

    .tab {
        flex: 1;
        display: flex;
        text-align: center;
        flex-grow: 1;
        flex-wrap: wrap;
        align-items: flex-end;
        line-height: px2rem(80px);
        height: 100%;
        i {
            position: relative;
            top: 10px;
            font-size: px2rem(50px);
            width: 100%;
            color: $IconColor;
        }
        .name {
            flex: 1;
            text-align: center;
            font-weight: normal;
            font-size: px2rem(24px);
            color: $textColor;
        }
    }
</style>
