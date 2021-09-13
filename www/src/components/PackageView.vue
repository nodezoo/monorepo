<template>
  <div class="pt-10 px-20">
    <div v-if="null == pkgs || pkgs.length === 0">
      <h1>Your favorite packages will appear here.</h1>
    </div>
    <div>
      <v-container class="pt-10 px-20">
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
                      :is_bookmarked="true"
                      @bookmarkRemoved="removeBookmark({ name: pkg.name })" />

                  </v-row>
                </v-list-item>
              </template>
            </PackageSummaryCard>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'
import PackageSummaryCard from '@/components/PackageSummaryCard.vue'
import BookmarkPackageAction from '@/components/BookmarkPackageAction.vue'


export default {
  name: 'PackageView',


  data: () => ({
    pkgs: []
  }),


  async mounted() {
    await this.listMyBookmarks()
  },


  methods: {
    async listMyBookmarks() {
      const bookmarksResponse = await Api.listMyBookmarkedPkgs()

      if (!bookmarksResponse.data.ok) {
        return
      }

      const { pkgs } = bookmarksResponse.data
      this.pkgs = pkgs
    },

    async removeBookmark(args) {
      const { name } = args
      await Api.removeBookmark({ name })

      await this.listMyBookmarks()
    }
  },


  components: {
    PackageSummaryCard,
    BookmarkPackageAction
  }
}
</script>

<style lang="scss">
</style>
