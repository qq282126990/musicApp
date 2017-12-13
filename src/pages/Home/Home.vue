<template>
    <div>
        <!--轮播图-->
        <div class="silder-wrapper">
            <div v-if="slider.length">
                <Silder>
                    <div v-for="item in slider">
                        <a :href="item.linkUrl">
                            <img :src="item.picUrl">
                        </a>
                    </div>
                </Silder>
            </div>
        </div>
        <!--主页导航-->
        <tab-router></tab-router>
    </div>
</template>

<script>
    import {getMusician} from 'api/musician';
    import {ERR_OK} from 'common/js/config';


    import Silder from 'base/slider/slider';
    import tabRouter from 'components/tabRouter/tabRouter';

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
            Silder,
            tabRouter
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../common/sass/remAdaptive";

    .silder-wrapper {
        position: relative;

        overflow: hidden;

        width: 100%;
        height: px2rem(300px);
    }
</style>
