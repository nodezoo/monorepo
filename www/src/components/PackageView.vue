<template>
  <div>
    <v-container>
      <v-row v-for="pkg in pkgs" :key="pkg.name">
        <v-col>
          <PackageSummaryCard
            :pkg_name="pkg.name"
            :pkg_version="pkg.version"
            :pkg_desc="pkg.desc"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Api from '@/lib/api'
import PackageSummaryCard from '@/components/PackageSummaryCard.vue'


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
      /*
      const auth_token = this.$store.state.auth?.token
      */


      const bookmarksResponse = await Api.listMyBookmarkedPkgs({
        auth_token: 'd2dd8fc5-b962-4a3d-a899-639962cbbb00'
      })

      if (!bookmarksResponse.data.ok) {
        return
      }

      const { pkgs } = bookmarksResponse.data
      this.pkgs = pkgs
    }
  },


  components: {
    PackageSummaryCard
  }
}
</script>

<style lang="scss">
</style>
