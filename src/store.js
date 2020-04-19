import Vue from 'vue'
import Vuex from 'vuex'
import 'babel-polyfill'
import firebase from 'firebase/app'
import 'firebase/firestore'
import config from './config/firebase';
import bookings from "./store/bookings";
import user from "./store/user";
firebase.initializeApp(config);
Vue.use(Vuex);
const state = {
    db: firebase.firestore()
};
export default new Vuex.Store({
    state,
    modules: {
        bookings: bookings,
        user: user
    },
    actions: {
        init: function (context) {
            return new Promise(resolve => {
                context.dispatch('bookings/getReservations').then(() => resolve());
            })
        }
    }
})
