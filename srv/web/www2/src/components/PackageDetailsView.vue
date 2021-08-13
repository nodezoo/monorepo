<template>
  <div>
    <h1>{{ pkg_name }}</h1>
    <h2>{{ pkg_version }}</h2>
    <p>{{ pkg_desc }}</p>
  </div>
</template>


<script>
import Api from '@/lib/api'


export default {
  name: 'PackageDetailsView',


  data: () => ({
    pkg_name: null,
    pkg_version: null,
    pkg_desc: null
  }),


  async mounted() {
    const { params: { packageName } } = this.$route

    const packageResponse = await Api.showPkg({ name: packageName })

    if (packageResponse.data.ok) {
      const { data: { pkg } } = packageResponse.data

      this.pkg_name = pkg.name
      this.pkg_version = pkg.npm.version
      this.pkg_desc = pkg.npm.desc
    }
  }
}
</script>
