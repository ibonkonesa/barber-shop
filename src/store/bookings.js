import {firebaseAction} from 'vuexfire'
import firebase from 'firebase/app'

export default {
    namespaced: true,
    state: {
        reservations: [],
    },
    getters: {},
    mutations: {
        setReservations: function (state, data) {
            state.reservations = data;
        }
    },
    actions: {
        getReservations({rootState, commit}) {
            return new Promise(resolve => {
                rootState.db.collection("bookings").onSnapshot(function (querySnapshot) {
                    let reservations = [];
                    querySnapshot.forEach(function (doc) {
                        reservations.push(doc.data());
                    });
                    commit('setReservations', reservations);
                    resolve();
                })
            });
        },
        create({rootState}, booking) {
            return new Promise(resolve => {
                let code = (booking.date.getTime() / 1000) + Math.floor((Math.random() * 10) + 1).toString();
                let minimal = {date: booking.date, code: code};
                rootState.db.collection('bookings').add(minimal);
                booking.code = code;
                rootState.db.collection('details').add(booking).then(() => resolve(code));
            })
        },
        cancel({rootState, dispatch}, booking) {
            //GET BOOKING FROM DATABASE
            return new Promise(async resolve => {
                let bookingRef = await firebase.firestore().collection('bookings').where('code', '==', booking.code).get();
                let idBooking = bookingRef.docs[0].id;
                await firebase.firestore().collection('bookings').doc(idBooking).delete()
                let detailRef = await firebase.firestore().collection('details').where('code', '==', booking.code).get();
                let id = detailRef.docs[0].id;
                await firebase.firestore().collection('details').doc(id).delete()
                await dispatch('user/logout', {}, {root: true})
                resolve();
            })
        }
    }
}
