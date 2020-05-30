<template>
    <div v-if="isAuth">

        <button
                @click="logout" class="button is-danger">Log Out
        </button>

        <br><br>

        <h2 class="subtitle">Next reservations</h2>

        <b-table v-if="nextReservations.length > 0" :data="nextReservations">
            <template slot-scope="props">
                <b-table-column label="Name">
                    {{ props.row.name }}
                </b-table-column>
                <b-table-column label="Phone">
                    {{ props.row.phone }}
                </b-table-column>
                <b-table-column label="Date Time">
                    {{ props.row.date }}
                </b-table-column>
                <b-table-column label="Actions">
                    <button
                            @click="cancelReservation(props.row)" class="button is-danger">Cancel
                    </button>
                </b-table-column>
            </template>
        </b-table>
        <h1 v-else>There are not reservations</h1>
    </div>
    <div v-else style="width: 30%; margin: 0 auto">
        <b-field message=" ">
            <b-input required placeholder="Username" v-model="username"></b-input>
        </b-field>
        <b-field message=" ">
            <b-input required type="password" placeholder="Password" v-model="password"></b-input>
        </b-field>
        <br><br>
        <button @click="logIn" v-bind:class="{'is-loading': isLogin}"
                class="button is-primary">Log In
        </button>
        <br><br>
        <h2 class="subtitle" style="color: red" v-if="loginError">Wrong user or password</h2>
    </div>
</template>
<script>
    import {mapActions, mapState} from 'vuex';

    export default {
        name: "admin",
        data() {
            return {
                username: null,
                password: null,
                isLogin: false,
                loginError: false,
                columns: [
                    {
                        field: 'name',
                        label: 'Name'

                    },
                    {
                        field: 'phone',
                        label: 'Phone'
                    },
                    {
                        field: 'date',
                        label: 'Date'
                    },
                ]
            }
        },
        computed: {
            ...mapState('user', {
                isAuth: 'isAuthAdmin',
            }),
            ...mapState('bookings', ['nextReservations'])
        },
        methods: {
            ...mapActions('user', ['adminLogin', 'checkAdminAuth', 'logout']),
            ...mapActions('bookings', ['cancel', 'getNextReservations']),

            cancelReservation(booking) {
                this.cancel(booking);
            },
            logIn() {
                this.isLogin = true;
                this.loginError = false;
                this.adminLogin({username: this.username, password: this.password}).then(() => {

                }).catch(() => {
                    this.loginError = true;

                }).finally(() => {
                    this.isLogin = false;
                })
            }
        },
        created() {
            this.checkAdminAuth();
        }
    }
</script>
<style lang="scss" scoped>

    .subtitle {
        font-weight: bolder;
    }
</style>