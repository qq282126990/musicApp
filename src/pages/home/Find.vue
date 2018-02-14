<template>
    <div>
        <transition name="fade" appear>
            <div class="find-wrapper">
                工程师努力开发中....
            </div>
        </transition>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'Find'
    }
</script>

<style lang="scss" scoped>
    .find-wrapper{
        width: 100%;
        height: 500px;
    }
</style>
