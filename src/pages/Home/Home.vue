<template>
    <div>
        <!--轮播图-->
        <div class="silder-wrapper">
            <div v-if="homeSlider.length">
                <slider>
                    <div v-for="item in homeSlider">
                        <a>
                            <img :alt="item.pic_info.url" :src="item.pic_info.url">
                        </a>
                    </div>
                </slider>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex';
    // 轮播图组件
    import Slider from 'base/homeSlider/homeSlider.vue';

    export default {
        async asyncData({store}) {
            // 调用 vuex action，在异步操作完成之前有顶部进度条提示
            await store.dispatch('asyncAjax/getHomeMessage'); // 轮播图请求
        },
        computed: {
            ...mapState('asyncAjax', [
              'homeSlider'
            ])
        },
        mounted () {
        },
        methods: {
            ...mapActions('asyncAjax', [
            ])
        },
        components: {
            Slider
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/sass/remAdaptive";
    @import "../../assets/sass/variables";

    /*轮播图*/
    .silder-wrapper {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: px2rem(300px);
    }
</style>
