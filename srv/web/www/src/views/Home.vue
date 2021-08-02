<template>
  <v-container>
    <v-row>
      <router-link to="/me/favorites">Favorites</router-link>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-form @submit.prevent="onSubmitSearch">
          <v-text-field label="Search" v-model="search" @input="onSearchInput" />
        </v-form>
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


  const TYPING_CHECK_WAIT_MS = 300


  export default {
    name: 'Home',


    data: () => ({
      pkgs: [],
      search: '',
      last_typed_at: null
    }),


    methods: {
      async doBookmarkPkg(_event, args) {
        const { name } = args
        await Api.doBookmarkPkg({ name })
      },


      async searchForPkgs() {
        this.pkgs = await Api
          .listPkgsWithNamePrefix({ prefix: this.search })
          .then(res => res.data.pkgs)
      },


      async onSubmitSearch() {
        await this.searchForPkgs()
      },


      isCurrentlyTyping() {
        if (!this.last_typed_at) {
          return false
        }

        const now = new Date()
        const last_typed = now.getTime() - this.last_typed_at.getTime()

        return last_typed < TYPING_CHECK_WAIT_MS
      },


      async onSearchInput() {
        const self = this
        self.last_typed_at = new Date()

        setTimeout(async () => {
          if (self.isCurrentlyTyping()) {
            return
          }

          await self.searchForPkgs()
        }, 300)
      }
    },


    components: {}
  }
</script>
