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
                  <div v-if="isBookmarkedPkg({ name: pkg.name })">
                    <v-icon class="mr-1">
                      mdi-heart
                    </v-icon>
                    <span class="subheading mr-2">
                      Liked
                    </span>
                  </div>
                  <div v-else>
                    <v-icon class="mr-1" @click="doBookmarkPkg({ name: pkg.name })">
                      mdi-heart-outline
                    </v-icon>
                  </div>
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
