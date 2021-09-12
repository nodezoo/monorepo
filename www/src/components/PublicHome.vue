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
        <PublicPackageSearchForm />
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
    pkgs: [
      {
        name: 'seneca',
        version: '4.0.0',
        desc: 'A Microservices Framework for Node.js'
      },
      {
        name: 'seneca-mem-store',
        version: '6.0.3',
        desc: 'Seneca in-memory data storage plugin.'
      },
      {
        name: 'seneca-mongo-store',
        version: '5.0.1',
        desc: 'Seneca data store plugin for MongoDB'
      }
    ]
  }),

  components: {
    PublicPackageSearchForm,
    PublicPackageSummaryCard
  }
}
</script>

<style lang="scss">
</style>
