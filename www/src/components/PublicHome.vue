<template>
  <div>
    <div>
      <img src="@/assets/logo.png" alt="Node Zoo logo" width="136" height="76">
    </div>

    <div>
      <PublicPackageSearchForm />
    </div>

    <div>
      <div v-for="pkg in pkgs" :key="pkg.name">
        <PublicPackageSummaryCard
          :pkg_name="pkg.name"
          :pkg_version="pkg.version"
          :pkg_desc="pkg.desc"
        />
      </div>
    </div>

    <div>
      <router-link to="/sign-in">Sign in</router-link>
      <router-link to="/sign-up">Sign up</router-link>
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
