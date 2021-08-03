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
  </v-container>
</template>


<script>
  const DEFAULT_TYPING_CHECK_WAIT_MS = 300


  export default {
    name: 'NavHeader',


    data: () => ({
      search: '',
      last_typed_at: null
    }),


    methods: {
      async emitSearchEvent() {
        this.$emit('searching', { search: this.search })
      },


      async onSubmitSearch() {
        await this.emitSearchEvent()
      },


      isCurrentlyTyping() {
        if (!this.last_typed_at) {
          return false
        }

        const now = new Date()
        const last_typed = now.getTime() - this.last_typed_at.getTime()

        return last_typed < DEFAULT_TYPING_CHECK_WAIT_MS
      },


      async onSearchInput() {
        const self = this
        self.last_typed_at = new Date()

        setTimeout(async () => {
          if (self.isCurrentlyTyping()) {
            return
          }

          await self.emitSearchEvent()
        }, DEFAULT_TYPING_CHECK_WAIT_MS)
      }
    }
  }
</script>
