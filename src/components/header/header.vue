<template>
  <div class="header-wrapper">
    <ul>
      <li class="header-li">
        <i class="iconfont icon-zhankai"></i>
      </li>
      <li class="header-li">
        <span class="myIndex">我的</span>
      </li>
      <li class="header-li">
        <span class="musician">音乐馆</span>
      </li>
      <li class="header-li">
        <span class="find">发现</span>
      </li>
      <li class="header-li">
        <i class="iconfont icon-sousuo2"></i>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {};
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/sass/fontColor";
  @import "../../common/sass/remAdaptive";

  .header-wrapper{
    display: flex;

    flex-wrap: nowrap;

    width: 100%;
    height: px2rem(88px);
    background: url("../../common/image/headerBg.jpg");
  }
  ul{
    display: flex;

    flex-wrap: nowrap;

    width: 100%;
  }
  .header-li{
    flex: 1;
    flex-basis: 20%;

    line-height: px2rem(88px);

    height: px2rem(88px);
    span{
      display: block;

      text-align: center;
      @include font-dpr(16px);

      color: $header-font-color;
    }
    .icon-zhankai{
      padding-left: px2rem(30px);

      display: block;
    }
    .icon-sousuo2{
      display: block;

      padding-right: px2rem(30px);
      text-align: right;
    }
  }
  .header-li:last-child{
    text-align: right;
  }
</style>
