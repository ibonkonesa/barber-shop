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
                        <button @click="doBooking" :disabled="!isFormValid()" class="button is-primary"
                                v-bind:class="{'is-loading': isBooking}">Make reservation
                        </button>
                    </div>
                </div>
            </b-modal>
            <h1 class="title">{{date.toLocaleDateString()}} schedule</h1>
            <div v-if="isOpenOnDate" class="columns is-multiline" style="margin: 2em">
                <div v-for="fixture in calendar" class="column is-2">
                    <div class="fixture" @click="showModal(fixture)"
                         v-bind:class="{ 'booked': fixture.isBooked, 'free': !fixture.isBooked}">
                        {{fixture.hour}}:{{ ('0'+fixture.minutes).slice(-2)}}
                    </div>
                </div>
            </div>
            <div v-else>
                <br><br>
                <h1 class="subtitle has-text-danger">We are closed this day. Please pick another one in the calendar</h1>
            </div>
        </div>
    </div>
</template>
<script>

    import {mapState, mapActions} from 'vuex';
    import DatePicker from 'vue2-datepicker'
    import schedule from "../config/schedule";

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
                schedule: schedule.hours,
                generatedCode: null,
                showGeneratedCode: false
            }
        },
        methods: {
            ...mapActions('bookings', ['create', 'getReservations']),
            doBooking: function () {
                this.isBooking = true;
                //CREATE BOOKING
                let date = new Date(this.date.toDateString() + ' 12:00:00');
                date.setHours(this.newBooking.fixture.hour, this.newBooking.fixture.minutes, 0);
                let payload = {
                    name: this.newBooking.name,
                    phone: this.newBooking.phone,
                    date: date
                };
                this.create(payload).then(code => {
                    this.generatedCode = code;
                    this.showBookingModal = false;
                    this.isBooking = false;
                    this.showGeneratedCode = true;

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
            isOpenOnDate() {
                return schedule.openingDays.includes(this.date.getDay());
            },
            calendar: function () {
                let calendar = [];
                this.schedule.forEach(hour => {
                    let date = new Date(this.date.toDateString() + ' 12:00:00');
                    date.setHours(hour.hour, hour.minutes, 0);

                    if (date >= new Date()) {
                        let reservation = this.reservations.filter(x => {
                            return x.date.seconds === (date.getTime() / 1000)
                        });
                        calendar.push({
                            hour: hour.hour,
                            minutes: hour.minutes,
                            isBooked: reservation.length === 1
                        });
                    }

                });
                return calendar;
            }
        },
        created() {
            this.getReservations();
        }
    }
</script>


<style>
    .fixture {
        padding: 2em;
        border-radius: 5px;
        font-weight: bolder;
    }
    .booked {
        background-color: #ffa8a8;
        cursor: not-allowed;

    }
    .free {
        cursor: pointer;
        background-color: #b0ecb0;
    }
</style>
