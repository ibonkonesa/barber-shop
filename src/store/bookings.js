import {firebaseAction} from 'vuexfire'
import firebase from 'firebase/app'

export default {
    namespaced: true,
    state: {
        reservations: [],
        nextReservations: [],
    },
    getters: {},
    mutations: {
        setReservations: function (state, data) {
            state.reservations = data;
        },
        setNextReservations: function (state, data) {
            state.nextReservations = data;
        }
    },
    actions: {
        async getReservations({rootState, commit}) {
            let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
            let bookingsRef = rootState.db.collection("bookings").where('date', '>', yesterday);
            let bookings = await bookingsRef.get();
            let reservations = [];
            bookings.docs.forEach(function (doc) {
                reservations.push(doc.data());
            });
            commit('setReservations', reservations);
        },
        async getNextReservations({rootState, commit}) {
            let bookingsRef = rootState.db.collection("details").where('date', '>', new Date());
            let bookings = await bookingsRef.get();
            let reservations = [];
            bookings.docs.forEach(function (doc) {
                let detail = doc.data();
                reservations.push({
                    name: detail.name,
                    phone: detail.phone,
                    date: new Date(detail.date.seconds * 1000).toLocaleString(),
                    code: detail.code
                });
            });
            commit('setNextReservations', reservations);
        },
        async create({rootState}, booking) {
            let code = (booking.date.getTime() / 1000) + Math.floor((Math.random() * 10) + 1).toString();
            let minimal = {date: booking.date, code: code};
            await rootState.db.collection('bookings').add(minimal);
            booking.code = code;
            await rootState.db.collection('details').add(booking);
            return code;
        },
        async cancel({rootState, dispatch}, booking) {
            let bookingRef = await firebase.firestore().collection('bookings').where('code', '==', booking.code).get();
            let idBooking = bookingRef.docs[0].id;
            await firebase.firestore().collection('bookings').doc(idBooking).delete()
            let detailRef = await firebase.firestore().collection('details').where('code', '==', booking.code).get();
            let id = detailRef.docs[0].id;
            await firebase.firestore().collection('details').doc(id).delete()
            if (!firebase.auth().currentUser.email) {
                await dispatch('user/logout', {}, {root: true})
            }
        }
    }
}
