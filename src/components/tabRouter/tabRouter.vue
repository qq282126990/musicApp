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
        height: px2rem(160px);
        background: rgba(20, 22, 34, 0.95);
    }

    .teb-li {
        display: flex;
        overflow: hidden;
        justify-content: center;
        width: 100%;
        height: px2rem(160px);
        background: rgba(20, 22, 34, 0.95);
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
            font-size: px2rem(30px);
            color: $textColor;
        }
    }
</style>