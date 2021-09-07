<template>
<vxg-basic-admin
  @action="action"
  />
</v-app>
</template>

<style lang="scss">
</style>

<script>
export default {
  methods: {
    action(details) {
      console.log('Account action', details)
      if('BasicHead'===details.part && 'avatar'===details.event) {
        this.$router.push('profile')
      }
    }
  }
}
</script>
