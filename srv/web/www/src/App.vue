<template>
  <v-app>
    <v-navigation-drawer
      app
      class="pt-5 text-center"
      color="grey lighten-5"
      mini-variant
      mini-variant-width="66"
    >
      <v-badge
        icon="mdi-menu-down"
        color="none"
        overlap
        bottom
      >
        <v-avatar
          color="green"
          size="46"
          class="text-center mx-auto"
        >
          <span class="white--text text-h7">RR</span>
        </v-avatar>
      </v-badge>
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
