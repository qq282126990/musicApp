<template>
    <div class="search-wrapper">
        <div class="search">
            <div class="search-input">
                <i class="iconfont icon-sousuo2 search-icon"></i>
                <span>搜索</span>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {};
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "../../common/sass/remAdaptive";
    @import "../../common/sass/variables";

    .search-wrapper {
        width: 100%;
        height: px2rem(66px);

        background: $search-wrapper-bgcolor;
    }

    .search {
        padding: 0 px2rem(10px);
        box-sizing: content-box;
    }

    .search-input {
        display: block;

        text-align: center;
        line-height: px2rem(50px);
        font-size: px2rem(26px);

        width: 100%;
        height: px2rem(50px);

        border: none;
        border-radius: px2rem(6px);
        background: rgba(0, 0, 0, .2);
        color: $search-font-color;
        .search-icon {
            margin-left: px2rem(-10px);
            font-size: px2rem(26px);
        }
    }

</style>
