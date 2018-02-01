<template>
    <div class="new-song-wrapper">
        <div class="header-router">
            {{newSongList}}
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {mapState} from 'vuex';

    export default {
        computed: {
            ...mapState('appStore', [
                'newSongList'
            ])
        }
    };
</script>

<style scoped lang="scss">

    .new-song-wrapper {
        width: 100%;
        background: red;
        height: 100%;
        z-index: 100000;
    }
</style>
