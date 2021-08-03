<template>
  <v-container>

    <v-row v-if="$session && $session.exists()">
      <v-col>
        <router-link to="/logout">Sign out</router-link>
        <router-link to="/me/favorites">Favorites</router-link>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col>
        <router-link to="/login">Sign in</router-link>
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
        <PkgSummaryCard :pkg_name="pkg.name" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Api from '@/lib/api'
  import PkgSummaryCard from '@/components/PkgSummaryCard.vue'


  const TYPING_CHECK_WAIT_MS = 300


  export default {
    name: 'Home',


    data: () => ({
      pkgs: [],
      search: '',
      last_typed_at: null
    }),


    methods: {
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


    components: {
      PkgSummaryCard
    }
  }
</script>
