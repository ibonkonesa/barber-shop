import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Booking from './views/Booking.vue'
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/comprobar-cita',
            name: 'check-booking',
            component: Booking
        },
    ]
})
