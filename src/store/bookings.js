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
                booking.code = code;
                rootState.db.collection('details').add(booking).then(() => resolve(code));
            })
        },
        cancel({rootState, dispatch}, booking) {
            //GET BOOKING FROM DATABASE
            return new Promise(resolve=> {
                firebase.firestore().collection('details').where('code', '==', booking.code).get().then(query => {
                    if (!query.empty) {
                        let id = query.docs[0].id;
                        firebase.firestore().collection('details').doc(id).delete().then(() => {
                            //LOGOUT USER
                            dispatch('user/logout', {}, {root: true}).then(() => {
                                resolve();
                            })
                        })
                    }
                })
            })
        }
    }
}
