<template>
  <div>
    <HeaderWrapper></HeaderWrapper>
    <router-view></router-view>
  </div>
</template>

<script>
  import Header from 'components/header/header';

  export default {
    components: {
      'HeaderWrapper': Header
    }
  };
</script>

<style>

</style>
