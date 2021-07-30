<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col class="text-center">
          <img src="@/assets/logo.png" alt="Node Zoo logo">
          <p>Search <a href="#">Node.js</a> packages</p>
        </v-col>
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
            <v-card-title>{{ pkg.name }}</v-card-title>
            <v-card-subtitle>{{ pkg.version }}</v-card-subtitle>
            <v-card-text>{{ pkg.desc }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  import Api from '@/lib/api'


  const TYPING_CHECK_WAIT_MS = 300


  export default {
    name: 'Home',


    data: () => ({
      pkgs: [
        {
          name: 'fakename1',
          version: '0.0.0',
          desc: 'fakedesc1'
        },
        {
          name: 'fakename2',
          version: '0.0.0',
          desc: 'fakedesc2'
        }
      ],
      search: '',
      last_typed_at: null
    }),


    methods: {
      async onToggleBookmarkPkg(_event, pkg_name) {
        await Api.bookmarkPkg(pkg_name)
      },


      async searchForPackages() {
        this.pkgs = await Api.pkgsWithNameStartingWith(this.search)
          .then(res => res.data.pkgs)
      },


      async onSubmitSearch() {
        await this.searchForPackages()
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

          await self.searchForPackages()
        }, 300)
      }
    },


    components: {}
  }
</script>
