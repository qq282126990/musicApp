<template>
    <div class="search-box-header">
        <transition name="slice-left">
            <!--返回按钮-->
            <v-icon class="icon-back" @click="back">arrow_back</v-icon>
        </transition>
        <!--输入框-->
        <input class="box"
               spellcheck="true"
               :placeholder="placeholder"
               v-show="getShowSearch"
               v-model="query"
               ref="query"
        />
        <!--删除按钮-->
        <v-icon class="icon-cancel"
                v-show="query"
                @click="clear">close</v-icon>
    </div>
</template>

<script type="text/ecmascript-6">
    // debounce 函数节流
    import {debounce} from 'common/js/util'
    import {mapActions, mapState} from 'vuex';

    export default {
        props: {
            placeholder: {
                type: String,
                default: '搜索音乐、MV、歌单、用户'
            }
        },
        data() {
            return {
                query: ''
            }
        },
        created() {
            this.$watch('query', debounce((newQuery) => {
                this.$emit('query', newQuery)
            }, 200))
        },
        computed: {
            ...mapState('appStore', {
                getShowSearch: 'showSearch'
            })
        },
        methods: {
            // 返回按钮
            back() {
                this.setShowSeach(false);
            },
            // 请求输入框数据
            clear() {
                this.query = ''
            },
            setQuery(query) {
                this.query = query
            },
            blur() {
                this.$refs.query.blur()
            },
            ...mapActions('appStore', {
                /*
                 * 设置显示搜索框
                 * */
                setShowSeach: 'showSearch'
            })
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/sass/variables";
    @import "../../assets/sass/remAdaptive";

    .slice-left-enter-active, .slice-left-leave-active {
        transition: all .5s;
    }
    .slice-left-enter, .slice-left-leave-to {
        transform: translate(-100%, 0);
    }

    /*头部*/
    .search-box-header {
        padding: 0 px2rem(20px);
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        background: $search-box-header-bgcolor;
        /*返回按钮*/
        .icon-back {
            line-height: px2rem(72px);
            font-size: px2rem(50px);
            color: #fff;
        }
        /*删除按钮*/
        .icon-cancel {
            font-size: px2rem(40px);
            line-height: px2rem(50px);
            color: #fff;
        }
        /*输入框*/
        .box {
            flex: 1;
            font-size: px2rem(28px);
            margin: 0 px2rem(10px);
            height: px2rem(50px);
            line-height: px2rem(50px);
            color: #fff;
            &::placeholder {
                color: rgba(255, 255, 255, .6);
            }
        }
        .box:focus {
            color: #fff
        }
    }

</style>
