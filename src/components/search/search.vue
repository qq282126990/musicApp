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
  @import "../../common/sass/fontColor";

  .search-wrapper{
    width: 100%;
    height: 33px;

    background: url("../../common/image/headerBg.jpg");
  }
  .search{
    padding: 0 5px;
    box-sizing: content-box;
  }
  .search-input{
    display: block;

    text-align: center;
    line-height: 25px;
    font-size: 13px;

    width: 100%;
    height: 25px;

    border: none;
    border-radius: 3px;
    background: rgba(0,0,0,.2);
    color: $search-font-color;
  }
  .search-icon{
    margin-left: -5px;
  }
</style>
