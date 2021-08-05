<template>
  <h1>{{ pkg_name }}</h1>
</template>


<script>
  import Api from '@/lib/api'

  export default {
    name: 'ShowPkg',

    data: () => ({
      pkg_name: ''
    }),

    mounted() {
      // TODO: Implementation.
      // TODO: Redirect to the 404 page when the package does not exist.
      //

      const { params: { name: pkg_name } } = this.$route

      this.pkg_name = pkg_name
    }
  }
</script>

