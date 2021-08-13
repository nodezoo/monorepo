<template>
  <v-card
    elevation="0"
    tile
    color="grey lighten-5"
  >
    <v-card-title>
      <router-link :to="'/pkgs/' + pkg_name">
        {{ pkg_name }}
      </router-link>
    </v-card-title>
    <v-card-subtitle>0.0.0_VER_PLAC</v-card-subtitle>
    <v-card-text>lorem_DESC_PLAC</v-card-text>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>


<script>
  export default {
    name: 'PackageSummaryCard',

    props: {
      pkg_name: {
        type: String,
        required: true
      }
    }
  }
</script>
