<template>
  <form @submit.prevent="onSubmitSearch">
    <div class="grid grid-cols-5">
      <div class="col-span-4">
        <input type="text" v-model="search" @input="onSearchInput" placeholder="Search packages" class="form-input pl-12 pt-3 pb-3 border-l-0 border-r-0 border-t-0 bg-gray-50" style="width: 100%;background-image: url(https://senecajs.org/images/icon-search.svg);background-repeat: no-repeat;background-position: 13px center;">
      </div>
      <div>
        <button type="submit" style="background-color: rgb(38, 142, 196);width: 100%;height: 100%;color: white;">Search</button>
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
