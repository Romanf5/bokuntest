<template>
  <div id="app">
    <div class="container">
      <div class="app-form">
        <div class="app-form__row">
          <div class="app-form__item">
            <span>Count:</span>
          </div>
          <div class="app-form__item">
            <input @input="validateCount" type="number" min="1" :max="kayaksCount" step="1" v-model="kayaksCountRental">
          </div>
        </div>
        <div class="app-form__row">
          <div class="app-form__item">
            <span>Date from:</span>
          </div>
          <div class="app-form__item">
            <datetime type="datetime"
                      v-model="date.from"
                      :hour-step="1"
                      :minute-step="60"></datetime>
          </div>
        </div>
        <div class="app-form__row">
          <div class="app-form__item">
            <span>Date to:</span>
          </div>
          <div class="app-form__item">
            <datetime type="datetime"
                      v-model="date.to"
                      :hour-step="1"
                      :minute-step="60"
                      :min-datetime="minDateTo"></datetime>
          </div>
        </div>
        <div class="app-form__row">
          <div class="app-form__item">
            <span>Location:</span>
          </div>
          <div class="app-form__item">
            <span>{{location.address}}</span>
          </div>
        </div>
        <div class="app-form__row">
          <div class="app-form__item">
            <span>Total Price:</span>
          </div>
          <div class="app-form__item">
            <span>{{rentalPrice}} {{payment.currency}}</span>
          </div>
        </div>
        <div class="app-form__row--map">
          <app-map ref="map"
            :lon="location.lon"
            :lat="location.lat"
            :zoom="location.zoom">
          </app-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from './services/http';
import map from './components/Map';
import moment from 'moment';

export default {
  name: 'app',
  components: {
    'app-map': map
  },
  data() {
    return {
      date: {
        from: moment().add(1, 'hours').startOf('hour').toISOString(),
        to: moment().add(2, 'hours').startOf('hour').toISOString(),
        minDateFrom: moment().toISOString()
      },
      payment: {
        priceOnHouer: 10,
        currency: 'USD'
      },
      kayaksCountRental: "1",
      kayaksCount: 5,
      location: {
        work: {
          from: null,
          to: null,
          minHouerRental: 1
        },
        address: null,
        lon: null,
        lat: null,
        zoom: null
      }
    }
  },
  computed: {
    rentalHours() {
      return moment(this.date.to).diff(this.date.from, 'hours');
    },
    rentalPrice() {
      return this.payment.priceOnHouer * this.rentalHours * Number(this.kayaksCountRental);
    },
    minDateTo() {
      return moment(this.date.from).add(1, 'hours').toISOString();
    }
  },
  methods: {
    validateCount() {
      let count = Number(this.kayaksCountRental);
      if(count > this.kayaksCount) this.kayaksCountRental = 5;
      else if (count < 1) this.kayaksCountRental = 1;
    },
    setParams(data) {
      // variables
      let location = data.dropoffLocations[0];
      // set params
      this.location.address = location.location.wholeAddress;
      this.location.lon = location.location.longitude;
      this.location.lat = location.location.latitude;
      this.location.zoom = location.location.zoomLevel;
      this.location.work.from = location.openingHour;
      this.location.work.to = location.closingHour;
    }
  },
  mounted() {
    http.get('', { params: {slug: '/car-rental.json/342'} }).then((response) => {
      this.setParams(response.data);
      this.$nextTick(() => {this.$refs.map.init()});
    }).catch((e) => {
      // eslint-disable-next-line
      console.log(e);
    });
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  outline: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 20px;
}

.container {
  position: relative;
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

.app-form  {
  width: 100%;
  max-width: 600px;
  margin: auto;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0,0,0,0.5);

  &__row {
    width: 100%;
    padding: 0 10px;
    display: flex;
    border-bottom: 1px solid #e3e3e3;

    &--map {
      border-bottom: 0;
      height: 300px;
    }
  }

  &__item {
    padding: 10px;
    flex-shrink: 0;
    flex-grow: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &:first-child {
      flex-grow: 0;
      flex-basis: 150px;
      border-right: 1px solid #e3e3e3;
    }
  }
}

.calender-div {
  z-index: 1;
}

select, input {
  width: 100%;
  padding: 3px 7px;
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 10px;
  cursor: pointer;
}
</style>
