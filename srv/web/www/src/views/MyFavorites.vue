<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Favorites</h1>
      </v-col>
    </v-row>
    <v-row v-for="pkg in pkgs" :key="pkg.name">
      <v-col>
        <v-card
          elevation="0"
          tile
          color="grey lighten-5"
        >
          <router-link :to="'/pkgs/' + pkg.name">
            <v-card-title>{{ pkg.name }}</v-card-title>
          </router-link>
          <v-card-subtitle>0.0.0_VER_PLAC</v-card-subtitle>
          <v-card-text><lorem_DESC_PLAC</v-card-text>
          <v-card-actions>
            <v-btn @click="doBookmarkPkg($event, { name: pkg.name })">Like</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Api from '@/lib/api'


  export default {
    name: 'ListMyBookmarks',

    data: () => ({
      pkgs: []
    }),

    async mounted() {
      await this.listMyBookmarks()
    },

    methods: {
      async doBookmarkPkg(_event, args) {
        const { name } = args
        await Api.doBookmarkPkg({ name })
      },


      async listMyBookmarks() {
        const { data: { pkgs } } = await Api.listMyBookmarkedPkgs()
        this.pkgs = pkgs
      }
    }
  }
</script>

