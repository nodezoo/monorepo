<template>
  <v-card
    elevation="0"
    tile
    color="grey lighten-5"
  >
    <v-card-title>
      <router-link :to="'/package/' + encodeURIComponent(pkg_name)">
        <h3 class="font-extrabold text-xl">
          {{ pkg_name }}
        </h3>
      </router-link>
    </v-card-title>
    <v-card-subtitle>
      {{ pkg_version }}
    </v-card-subtitle>
    <v-card-text>
      {{ pkg_desc }}
    </v-card-text>
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
      },

      pkg_version: {
        type: String,
        required: true
      },

      pkg_desc: {
        type: String,
        required: true
      }
    }
  }
</script>
