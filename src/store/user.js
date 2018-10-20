import firebase from 'firebase/app';
import 'firebase/auth'
import axios from 'axios';
import config from '@/config/firebase'

let location = 'us-central';

export default {
    namespaced: true,
    state: {
        isAuth: false,
        data: null
    },
    getters: {},
    mutations: {
        setData: function (state, data) {
            state.isAuth = true;
            state.data = data;
        },
        logout: function (state) {
            state.isAuth = false;
            state.data = null;
        }
    },
    actions: {
        getToken({commit}, code) {
            return new Promise((resolve, reject) => {
                axios.post('https://'+location+'1-'+config.projectId+'.cloudfunctions.net/createToken', {data: {code: code}}).then(response => {
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

                    }
                    else reject();
                })
            });
        },
        logout({commit}) {
            return new Promise(resolve => {
                firebase.auth().signOut().then(() => {
                    commit('logout');
                    resolve();
                });
            });
        }
    }
}
