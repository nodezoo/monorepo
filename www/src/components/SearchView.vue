<template>
  <div>
    <v-container class="pt-10 px-20">

      <v-row>
        <PackageSearchForm @searching="searchForPkgs" />
      </v-row>

      <v-row v-for="pkg in pkgs" :key="pkg.name">
        <v-col>
          <PackageSummaryCard
            :pkg_name="pkg.name"
            :pkg_version="pkg.version"
            :pkg_desc="pkg.desc"
          >
            <template v-slot:actions>
              <v-list-item class="grow">
                <v-row align="center" justify="end">
                  <BookmarkPackageAction
                    :is_bookmarked="isBookmarkedPkg({ name: pkg.name })"
                    @bookmarkAdded="doBookmarkPkg({ name: pkg.name })"
                    @bookmarkRemoved="removeBookmark({ name: pkg.name })" />

                </v-row>
              </v-list-item>
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
import BookmarkPackageAction from '@/components/BookmarkPackageAction.vue'


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


    async removeBookmark(args) {
      const { name } = args
      await Api.removeBookmark({ name })

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
    PackageSummaryCard,
    BookmarkPackageAction
  }
}
</script>


<style lang="scss">
</style>
