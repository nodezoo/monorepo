<template>
  <div>
    <v-container>

      <v-row>
        <PackageSearchForm @searching="searchForPkgs" />
      </v-row>

      <v-row v-for="pkg in pkgs" :key="pkg.name">
        <v-col>
          <PackageSummaryCard :pkg_name="pkg.name">
            <template v-slot:actions>
              <v-btn
                :disabled="isBookmarkedPkg({ name: pkg.name })"
                @click="doBookmarkPkg({ name: pkg.name })">
                Like
              </v-btn>
            </template>
          </PackageSummaryCard>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>


<script>
import Api from '@/lib/api'
import PackageSummaryCard from '@/components/PackageSummaryCard.vue'
import PackageSearchForm from '@/components/PackageSearchForm.vue'


export default {
  name: 'SearchView',


  data: () => ({
    pkgs: [],
    bookmarks: []
  }),


  async mounted() {
    await this.fetchBookmarks()
  },


  methods: {
    async fetchBookmarks() {
      const bookmarksResponse = await Api.listMyBookmarkedPkgs()

      if (bookmarksResponse.data.ok) {
        this.bookmarks = bookmarksResponse.data.pkgs
      }
    },

    async doBookmarkPkg(args) {
      const { name } = args
      await Api.doBookmarkPkg({ name })

      await this.fetchBookmarks()
    },


    isBookmarkedPkg(args) {
      const { name } = args
      return Boolean(this.bookmarks.find(b => b.name === name))
    },


    async searchForPkgs(args) {
      const { search } = args
      const searchResponse = await Api.listPkgsWithNamePrefix({ prefix: search })

      if (searchResponse.data.ok) {
        const { data: { pkgs } } = searchResponse.data
        this.pkgs = pkgs
      }
    }
  },


  components: {
    PackageSearchForm,
    PackageSummaryCard
  }
}
</script>


<style lang="scss">
</style>
