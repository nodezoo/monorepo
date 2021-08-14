<template>
  <div>
    <v-form @submit.prevent="submitCheckout">
      <h1>Payment method</h1>


      <v-select
        required
        label="Please select a payment method"
        v-model="payment_method"
        :items="paymentMethods">
      </v-select>


      <v-text-field
        required
        v-model="card_number"
        label="Card number"
      ></v-text-field>


      <v-select
        required
        label="Expiration month"
        v-model="exp_month"
        :items="months">
      </v-select>


      <v-select
        required
        label="Expiration year"
        v-model="exp_year"
        :items="nNextYears(25)">
      </v-select>


      <v-text-field
        required
        v-model="sec_code"
        label="Security code"
      ></v-text-field>


      <h1>Billing information</h1>


      <v-text-field
        required
        v-model="first_name"
        label="First name"
      ></v-text-field>


      <v-text-field
        required
        v-model="last_name"
        label="Last name"
      ></v-text-field>


      <v-text-field
        required
        v-model="city"
        label="City"
      ></v-text-field>


      <v-text-field
        required
        v-model="billing_address"
        label="Billing address"
      ></v-text-field>


      <v-text-field
        required
        v-model="zip"
        label="Zip or postal code"
      ></v-text-field>


      <v-text-field
        required
        v-model="country"
        label="Country"
      ></v-text-field>


      <v-text-field
        required
        v-model="phone_number"
        label="Phone number"
      ></v-text-field>


      <v-btn type="submit">Submit</v-btn>
    </v-form>
  </div>
</template>


<script>
import Api from '@/lib/api'


export default {
  name: 'TestBedView',


  data: () => ({
    payment_method: null,
    card_number: null,
    exp_month: null,
    exp_year: null,
    sec_code: null,
    first_name: null,
    last_name: null,
    city: null,
    billing_address: null,
    zip: null,
    country: null,
    phone_number: null
  }),


  methods: {
    async submitCheckout() {
      const submitArgs = {
        payment_method: this.payment_method,
        card_number: this.card_number,
        exp_month: this.exp_month,
        exp_year: this.exp_year,
        sec_code: this.sec_code,
        first_name: this.first_name,
        last_name: this.last_name,
        city: this.city,
        billing_address: this.billing_address,
        zip: this.zip,
        country: this.country,
        phone_number: this.phone_number
      }

      await Api.submitPremiumMembershipCheckout(submitArgs)
    },

    nNextYears(num_years) {
      const year_now = new Date().getFullYear()
      return Array.from({ length: num_years + 1 }, (_, i) => year_now + i)
    }
  },


  computed: {
    paymentMethods() {
      return [
        'American Express',
        'Visa',
        'MasterCard'
      ]
    },


    months() {
      return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    }
  }
}
</script>


<style lang="scss">
</style>
