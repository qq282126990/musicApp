<template>
  <div>
    <Search></Search>
    <div v-if="slider.length" class="silder-wrapper">
      <Silder>
        <div v-for="item in slider">
          <a :href="item.linkUrl">
            <img :src="item.picUrl">
          </a>
        </div>
      </Silder>
    </div>
    <div class="tabRouter">
      asdsad
    </div>
  </div>
</template>

<script>
  import {getMusician} from 'api/musician';
  import {ERR_OK} from 'common/js/config';

  import Search from 'components/search/search';
  import Silder from 'base/slider/slider';

  export default {
    data() {
      return {
        slider: []
      };
    },
    created() {
      this._getMusician();
    },
    methods: {
      _getMusician() {
        getMusician().then((res) => {
          if (res.code === ERR_OK) {
            this.slider = res.data.slider;
          }
        });
      }
    },
    components: {
      'Search': Search,
      'Silder': Silder
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../common/sass/remAdaptive";

  .silder-wrapper{
    position: relative;

    overflow: hidden;

    width: 100%;
    height: px2rem(300px);
  }
</style>
