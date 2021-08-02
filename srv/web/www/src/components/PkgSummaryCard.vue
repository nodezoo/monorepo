<template>
  <v-card
    elevation="0"
    tile
    color="grey lighten-5"
  >
    <router-link :to="'/pkgs/' + pkg_name">
      <v-card-title>{{ pkg_name }}</v-card-title>
    </router-link>
    <v-card-subtitle>0.0.0_VER_PLAC</v-card-subtitle>
    <v-card-text>lorem_DESC_PLAC</v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'PkgSummaryCard',

    props: {
      pkg_name: {
        type: String,
        required: true
      }
    }
  }
</script>
