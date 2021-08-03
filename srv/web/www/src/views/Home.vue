<template>
  <v-container>

    <v-row>
      <NavHeader @searching="searchForPkgs"/>
    </v-row>

    <v-row v-for="pkg in pkgs" :key="pkg.name">
      <v-col>
        <PkgSummaryCard :pkg_name="pkg.name" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Api from '@/lib/api'
  import PkgSummaryCard from '@/components/PkgSummaryCard.vue'
  import NavHeader from '@/components/NavHeader.vue'


  export default {
    name: 'Home',


    data: () => ({
      pkgs: []
    }),


    methods: {
      async searchForPkgs(args) {
        const { search } = args

        this.pkgs = await Api
          .listPkgsWithNamePrefix({ prefix: search })
          .then(res => res.data.pkgs)
      },
    },


    components: {
      NavHeader,
      PkgSummaryCard
    }
  }
</script>
