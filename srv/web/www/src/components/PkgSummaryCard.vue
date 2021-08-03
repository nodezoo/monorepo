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
    <v-card-text>{{ is_pkg_bookmarked ? 'Unlike' : 'Like' }}</v-card-text>
  </v-card>
</template>

<script>
  import Api from '@/lib/api'

  export default {
    name: 'PkgSummaryCard',

    data: () => ({
      is_pkg_bookmarked: false
    }),

    async mounted() {
      const auth_token = this.$session?.get('AUTH_TOKEN')

      this.is_pkg_bookmarked = await Api
        .isPkgBookmarkedByMe({ name: this.pkg_name, auth_token })
        .then(res => res.data.is_bookmarked)
    },

    props: {
      pkg_name: {
        type: String,
        required: true
      }
    }
  }
</script>
