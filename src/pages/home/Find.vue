<template>
    <div>
        <transition name="fade" appear>
            <div class="find-wrapper">
                <iframe src="https://y.qq.com/m/client/music_headline/magazine.html" height="100%" width="100%">
                </iframe>
            </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'find',
    }
</script>

<style lang="scss" scoped>
    .find-wrapper{
        width: 100%;
        height: 100%;
    }
</style>
