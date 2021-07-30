<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <img src="@/assets/logo.png" alt="Node Zoo logo">
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form @submit.prevent="onSubmitSearch">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Search" v-model="search" @input="onSearchInput">
                  </v-text-field>
                </v-col>

                <v-col>
                  <v-btn type="submit" fab plain>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-col>
      </v-row>
      <v-row v-for="pkg in pkgs">
        <v-col>
          <v-card
            elevation="1"
            tile
          >
            <v-card-title>{{ pkg.name }}</v-card-title>
            <v-card-subtitle>{{ pkg.version }}</v-card-subtitle>
            <v-card-text>{{ pkg.desc }}</v-card-text>
            <v-card-actions>
              <v-btn fab plain @click.prevent="onToggleBookmarkPkg($event, pkg.name)">
                <v-icon>mdi-heart-plus-outline</v-icon>
              </v-btn>
            </v-card-actions>
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
      pkgs: [],
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
