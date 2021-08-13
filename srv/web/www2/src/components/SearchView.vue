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
import PackageSummaryCard from '@/components/PackageSummaryCard.vue'
import PackageSearchForm from '@/components/PackageSearchForm.vue'


export default {
  name: 'SearchView',


  data: () => ({
    pkgs: [],
    bookmarks: []
  }),


  methods: {
    async doBookmarkPkg(args) {
      // TODO
    },


    isBookmarkedPkg(args) {
      // TODO

      return false
    },


    async searchForPkgs(args) {
      // TODO
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
