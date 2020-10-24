<template>
    <div v-if="!isUserAuth">
        <h1 class="title">Fill your reservation code</h1>
        <div style="width: 30%; margin: 0 auto">
            <b-field message=" ">
                <b-input required placeholder="Reservation code" v-model="code"></b-input>
            </b-field>
            <br><br>
            <button @click="checkCode" v-bind:class="{'is-loading': isChecking}" :disabled="code.length === 0"
                    class="button is-primary">Check
            </button>
            <br><br>
            <h2 class="subtitle" style="color: red" v-if="nonExistingCode">Unknown code</h2>
        </div>
    </div>
    <div v-else>
        <div style="border: 1px solid gainsboro; padding: 2em; width: 50%; margin: 0 auto; border-radius: 15px">
            <h2 class="title">
                <small>Reservation code:</small>
                {{booking.code}}
            </h2>
            <br>
            <h2 class="subtitle">
                <small>Name:</small>
                {{booking.name}}
            </h2>
            <h2 class="subtitle">
                <small>Phone:</small>
                {{booking.phone}}
            </h2>
            <h2 class="subtitle">
                <small>Date and time:</small>
                {{ new Date(booking.date.seconds * 1000).toLocaleDateString()}} {{ new Date(booking.date.seconds *
                1000).toLocaleTimeString()}}
            </h2>
            <br>
            <button @click="cancelBooking" class="button is-primary" v-bind:class="{'is-loading': isCancelling}">Cancel
                reservation
            </button>
        </div>
    </div>
</template>
<script>
    import {mapActions, mapState} from 'vuex';

    export default {
        name: "booking",
        data() {
            return {
                isChecking: false,
                isCancelling: false,
                code: '',
                nonExistingCode: false,
            }
        },
        computed: {
            ...mapState('user', {
                isUserAuth: 'isAuth',
                booking: 'data'
            })
        },
        methods: {
            ...mapActions('bookings', ['cancel']),
            ...mapActions('user', ['getToken', 'logout']),
            cancelBooking: function () {
                this.isCancelling = true;
                this.cancel(this.booking).then(() => {
                    this.isCancelling = true;
                    this.$router.push('/')
                });
            },
            checkCode: function () {
                this.nonExistingCode = false;
                this.isChecking = true;
                this.getToken(this.code).catch(error => {
                    this.nonExistingCode = true;
                }).then(() => {
                    this.isChecking = false;
                })
            }
        },
        beforeDestroy() {
            if (this.isUserAuth) {
                this.logout();
            }
        }
    }
</script>
<style lang="scss" scoped>

    .subtitle {
        font-weight: bolder;
    }
</style>