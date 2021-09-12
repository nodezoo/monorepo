<template>
  <div>
    <img src="@/assets/logo.png" alt="Node Zoo logo" width="136" height="76">

    <div>
      <router-link to="/sign-in">Sign in</router-link>
      <router-link to="/sign-up">Sign up</router-link>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'


export default {
  name: 'PublicHome'
}
</script>

<style lang="scss">
</style>
