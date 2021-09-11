<template>
  <div class="pt-10 px-20">
    <div v-if="pkg_name">
      <PackageSummaryCard
        :pkg_name="pkg_name"
        :pkg_version="pkg_version"
        :pkg_desc="pkg_desc"
      >
        <template v-slot:actions>
          <v-list-item class="grow">
            <v-row align="center" justify="end">
              <BookmarkPackageAction
                :is_bookmarked="isBookmarkedPkg"
                @bookmarkAdded="doBookmarkPkg"
                @bookmarkRemoved="removeBookmark" />

            </v-row>
          </v-list-item>
        </template>
      </PackageSummaryCard>
    </div>

    <div v-show="pkg_name" class="mt-10">
      <div v-if="is_premium">
        <div v-if="isBookmarkedPkg">
          <PackageHistoryChart :pkg_name="pkg_name" />
        </div>
        <div v-else>
          <h1>*Like this package to start tracking its performance through time</h1>
        </div>
      </div>
      <div v-else>
        <h1>*See package performance through time by upgrading to Premium</h1>
      </div>
    </div>
  </div>
</template>


<script>
import Api from '@/lib/api'
import PackageHistoryChart from '@/components/PackageHistoryChart.vue'
import PackageSummaryCard from '@/components/PackageSummaryCard.vue'
import BookmarkPackageAction from '@/components/BookmarkPackageAction.vue'


export default {
  name: 'PackageDetailsView',


  data: () => ({
    pkg_name: null,
    pkg_version: null,
    pkg_desc: null,
    is_premium: null,
    bookmarks: null
  }),


  computed: {
    isBookmarkedPkg() {
      if (null == this.bookmarks) {
        return
      }

      return Boolean(this.bookmarks.find(b => b.name === this.pkg_name))
    }
  },


  methods: {
    async fetchBookmarks() {
      const bookmarksResponse = await Api.listMyBookmarkedPkgs()

      if (bookmarksResponse.data.ok) {
        this.bookmarks = bookmarksResponse.data.pkgs
      }
    },


    async doBookmarkPkg() {
      await Api.doBookmarkPkg({ name: this.pkg_name })

      await this.fetchBookmarks()
    },


    async removeBookmark() {
      await Api.removeBookmark({ name: this.pkg_name })

      await this.fetchBookmarks()
    },
  },


  async mounted() {
    const { params: { packageName } } = this.$route

    const packageResponse = await Api.showPkg({ name: packageName })

    if (packageResponse.data.ok) {
      const { data: { pkg } } = packageResponse.data

      this.pkg_name = pkg.name
      this.pkg_version = pkg.npm.version
      this.pkg_desc = pkg.npm.desc
    }


    const premiumResponse = await Api.isPremiumUser()

    if (premiumResponse.data.ok) {
      const { data: { is_premium } } = premiumResponse.data
      this.is_premium = is_premium
    }


    await this.fetchBookmarks()
  },

  components: {
    PackageHistoryChart,
    PackageSummaryCard,
    BookmarkPackageAction
  }
}
</script>

