import firebase from 'firebase/app';
import 'firebase/auth'
import axios from 'axios';
import config from '@/config/firebase'

let location = 'us-central';

export default {
    namespaced: true,
    state: {
        isAuth: false,
        data: null,
        isAuthAdmin: false
    },
    getters: {},
    mutations: {
        setAdminAuth: function (state, isAuth) {
            state.isAuthAdmin = isAuth;
        },
        setData: function (state, data) {
            state.isAuth = true;
            state.data = data;
        },
        logout: function (state) {
            state.isAuth = false;
            state.isAuthAdmin = false;
            state.data = null;
        }
    },
    actions: {
        getToken({commit}, code) {
            return new Promise((resolve, reject) => {
                axios.post('https://' + location + '1-' + config.projectId + '.cloudfunctions.net/createToken', {data: {code: code}}).then(response => {
                    let data = response.data;
                    if (data.success) {
                        firebase.auth().signInWithCustomToken(data.customToken)
                            .then(() => {
                                //GET DETAILS
                                firebase.firestore().collection('details').where('code', '==', code).get().then(query => {
                                    if (!query.empty) {
                                        let info = query.docs[0];
                                        commit('setData', info.data());
                                        resolve();
                                    } else reject();
                                })
                            });

                    } else reject();
                })
            });
        },
        adminLogin({commit, dispatch}, {username, password}) {
            return new Promise((resolve, reject) => {
                firebase.auth().signInWithEmailAndPassword(username, password).then(() => {
                    dispatch('bookings/getNextReservations', null, {root: true});
                    commit('setAdminAuth', true);
                    resolve();
                }).catch(error => {
                    console.log(error)
                    reject(error.message);
                })
            })
        },
        checkAdminAuth({commit, dispatch}) {
            if (firebase.auth().currentUser) {
                dispatch('bookings/getNextReservations', null, {root: true});
                commit('setAdminAuth', true);
            }
        },
        logout({commit}) {
            return new Promise(resolve => {
                let currentUser = firebase.auth().currentUser;
                firebase.auth().signOut().then(() => {
                    if (currentUser.email) window.location.reload();
                    else {
                        commit('logout');
                        resolve();
                    }
                });
            });
        }
    }
}
