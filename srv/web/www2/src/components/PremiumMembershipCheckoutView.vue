<template>
  <div>
    <h1>PremiumMembershipCheckoutView</h1>
    <PremiumMembershipCheckoutForm />
  </div>
</template>


<script>
import Api from '@/lib/api'
import PremiumMembershipCheckoutForm from '@/components/PremiumMembershipCheckoutForm.vue'


export default {
  name: 'PremiumMembershipCheckoutView',

  data: () => ({
  }),

  components: {
    PremiumMembershipCheckoutForm
  }
}
</script>


<style lang="scss">
</style>

