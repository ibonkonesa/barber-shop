<template>
    <div>
        <h1 class="subtitle">Choose a date</h1>
        <date-picker @change="updateDate" :value="date" lang="es" :first-day-of-week="1"
                     :not-before="new Date()"></date-picker>
        <div v-if="date !== null">
            <br><br>
            <b-modal :active.sync="showGeneratedCode">
                <div class="card">
                    <div class="card-content">
                        <h2 class="subtitle">Use this code to check or modify your reservation</h2>
                        <br>
                        <h1 class="title">{{generatedCode}}</h1>
                    </div>
                </div>
            </b-modal>
            <b-modal :active.sync="showBookingModal">
                <div class="card">
                    <div class="card-content">
                        <p>We need some data to make a reservation </p>
                        <br>
                        <b-field message=" ">
                            <b-input required placeholder="Name" v-model="newBooking.name"></b-input>
                        </b-field>
                        <b-field message=" ">
                            <b-input required type="text" placeholder="Phone"
                                     v-model="newBooking.phone"></b-input>
                        </b-field>
                        <button @click="doBooking" :disabled="!isFormValid()" class="button is-primary" v-bind:class="{'is-loading': isBooking}" >Make reservation
                        </button>
                    </div>
                </div>
            </b-modal>
            <h1 class="title">Calendar {{date.toLocaleDateString()}}</h1>
            <div class="columns is-multiline" style="margin: 2em">
                <div v-for="fixture in calendar" class="column is-2">
                    <div class="fixture" @click="showModal(fixture)"
                         v-bind:class="{ 'booked': fixture.isBooked, 'free': !fixture.isBooked}">
                        {{fixture.hour}}:{{ ('0'+fixture.minutes).slice(-2)}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import {mapState, mapActions} from 'vuex';
    import DatePicker from 'vue2-datepicker'
    export default {
        name: 'home',
        components: {
            DatePicker
        },
        data() {
            let date = new Date();
            date.setHours(12, 0, 0);
            return {
                newBooking: {
                    name: '',
                    phone: '',
                    fixture: {}
                },
                isBooking: false,
                showBookingModal: false,
                date: date,
                schedule: [
                    {hour: 9, minutes: 0},
                    {hour: 9, minutes: 30},
                    {hour: 10, minutes: 0},
                    {hour: 10, minutes: 30},
                    {hour: 11, minutes: 0},
                    {hour: 11, minutes: 30},
                    {hour: 12, minutes: 0},
                    {hour: 12, minutes: 30},
                    {hour: 13, minutes: 0},
                    {hour: 13, minutes: 30},
                    {hour: 16, minutes: 30},
                    {hour: 17, minutes: 0},
                    {hour: 17, minutes: 30},
                    {hour: 18, minutes: 0},
                    {hour: 18, minutes: 30},
                    {hour: 19, minutes: 0},
                    {hour: 19, minutes: 30},
                    {hour: 20, minutes: 0},
                    {hour: 20, minutes: 30},
                ],
                generatedCode: null,
                showGeneratedCode: false
            }
        },
        methods: {
            ...mapActions('bookings', ['create']),
            doBooking: function () {
                this.isBooking = true;
                //CREATE BOOKING
                let date = new Date(this.date.toDateString() + ' 12:00:00');
                date.setUTCHours(this.newBooking.fixture.hour, this.newBooking.fixture.minutes, 0);
                let payload = {
                    name: this.newBooking.name,
                    phone: this.newBooking.phone,
                    date: date
                };
                this.create(payload).then(code => {
                    this.generatedCode = code;
                    this.showBookingModal = false;
                    this.isBooking = false;
                });
            },
            showModal: function (fixture) {
                if (fixture.isBooked) return;
                this.newBooking = {
                    name: '',
                    phone: '',
                    fixture: fixture
                };
                this.showBookingModal = true;
                this.showGeneratedCode = true;
            },

            isFormValid: function () {
                return this.newBooking.name.length > 0 &&
                    this.newBooking.phone.length
            },
            updateDate: function (date) {
                let newDate = new Date(date);
                newDate.setHours(12);
                this.date = newDate;
            }
        },
        computed: {
            ...mapState('bookings', ['reservations']),
            calendar: function () {
                let calendar = [];
                this.schedule.forEach(hour => {
                    let date = new Date(this.date.toDateString() + ' 12:00:00');
                    date.setUTCHours(hour.hour, hour.minutes, 0);
                    let reservation = this.reservations.filter(x => {
                        return x.date.seconds === (date.getTime() / 1000)
                    });
                    calendar.push({
                        hour: hour.hour,
                        minutes: hour.minutes,
                        isBooked: reservation.length === 1
                    });
                });
                return calendar;
            }
        }
    }
</script>


<style>
    .fixture {
        padding: 2em
    }
    .booked {
        background-color: red;
    }
    .free {
        cursor: pointer;
        background-color: green;
    }
</style>
