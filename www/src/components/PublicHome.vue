<template>
  <div>
    <div class="container mx-auto mt-10 text-center">
      <img class="mx-auto" src="@/assets/logo.png" alt="Node Zoo logo" width="136" height="76">
      <p>Search Node.js packages</p>

      <div class="text-center mt-2">
        <router-link to="/sign-in" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Sign in</router-link>
        <span class="mr-4"></span>
        <router-link to="/sign-up" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Sign up</router-link>
      </div>
    </div>

    <div class="container mx-auto mt-8 w-2/5">
      <div>
        <PublicPackageSearchForm @searching="searchForPkgs" />
      </div>
    </div>

    <div class="container mx-auto mt-10">
      <div v-for="pkg in pkgs" :key="pkg.name" class="mb-4">
        <PublicPackageSummaryCard
          :pkg_name="pkg.name"
          :pkg_version="pkg.version"
          :pkg_desc="pkg.desc"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/lib/api'
import PublicPackageSearchForm from '@/components/PublicPackageSearchForm.vue'
import PublicPackageSummaryCard from '@/components/PublicPackageSummaryCard.vue'


export default {
  name: 'PublicHome',

  data: () => ({
    pkgs: []
  }),

  methods: {
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
    PublicPackageSearchForm,
    PublicPackageSummaryCard
  }
}
</script>

<style lang="scss">
</style>
