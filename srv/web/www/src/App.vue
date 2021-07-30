<template>
  <v-app>
    <v-navigation-drawer
      app
      class="pt-4"
      color="grey lighten-5"
      mini-variant
    >
      <v-avatar
        color="grey lighten-1"
        size="36"
        class="d-block text-center mx-auto mb-9"
      ></v-avatar>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
