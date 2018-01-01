<template>
    <div class="mask-layer" v-show="maskLayer"></div>
</template>

<script type="text/ecmascript-6">
    import {mapState} from 'vuex';

    export default {
        computed: {
            ...mapState('appStore', [
                'maskLayer'
            ])
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/variables";

    .mask-layer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: $mask-layer-bgcolor;
        z-index: 200;
    }
</style>