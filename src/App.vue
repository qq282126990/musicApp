<template>
  <div>
    <HeaderWrapper></HeaderWrapper>
    <Search></Search>
    <router-view/>
  </div>
</template>

<script>
  import Header from 'components/header/header';
  import Search from 'components/search/search';

  export default {
    components: {
      'HeaderWrapper': Header,
      'Search': Search
    }
  };
</script>

<style>

</style>
