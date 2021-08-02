<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Favorites</h1>
      </v-col>
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


  export default {
    name: 'MyFavorites',


    data: () => ({
      pkgs: []
    }),


    async mounted() {
      await this.listMyBookmarks()
    },


    methods: {
      async listMyBookmarks() {
        const { data: { pkgs } } = await Api.listMyBookmarkedPkgs()
        this.pkgs = pkgs
      }
    },


    components: {
      PkgSummaryCard
    }
  }
</script>

