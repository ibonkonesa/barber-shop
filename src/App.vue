<template>
    <div id="app">
        <h1 class="appTitle"> {{storeName}}</h1>
        <h2 v-if="description" class="appDescription">{{description}}</h2>

        <div id="nav">
            <router-link to="/">Calendar</router-link>
            |
            <router-link to="/check-booking">Check reservation</router-link>
        </div>
        <router-view/>
    </div>
</template>
<script>
    import config from '@/config/main.js';

    export default {
        name: 'app',
        data() {
            return {
                storeName: config.storeName,
                description: config.description
            }
        },
        mounted() {
            document.title = this.storeName;
        }
    }
</script>
<style lang="scss">
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        padding: 3em;

        .appTitle {
            font-weight: bold;
            font-size: 3em;
        }
    }

    #nav {
        padding: 30px;

        a {
            font-weight: bold;
            color: #2c3e50;

            &.router-link-exact-active {
                color: #42b983;
            }
        }
    }
</style>
