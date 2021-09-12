<template>
  <form @submit.prevent="onSubmitSearch">
    <div class="grid grid-cols-5">
      <div class="col-span-4">
        <input type="text" v-model="search" @input="onSearchInput" placeholder="Search packages" class="form-input pl-12 pt-3 pb-3 border-l-0 border-r-0 border-t-0 bg-gray-50 w-full nodezoo-search-input">
      </div>
      <div>
        <input type="submit" value="Search" class="w-full h-full nodezoo-bg-blue text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"></input>
      </div>
    </div>
  </form>
</template>


<script>
  const DEFAULT_TYPING_CHECK_WAIT_MS = 300


  export default {
    name: 'PublicPackageSearchForm',


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

<style lang="scss">
</style>
