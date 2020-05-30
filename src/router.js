import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Booking from './views/Booking.vue'
import Admin from "./views/Admin";
Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/check-booking',
            name: 'check-booking',
            component: Booking
        },
        {
            path: '/admin',
            name: 'admin',
            component: Admin
        },
    ]
})
