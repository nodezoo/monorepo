<template>
  <v-container>

    <v-row>
      <NavHeader @searching="searchForPkgs"/>
    </v-row>

    <v-row v-for="pkg in pkgs" :key="pkg.name">
      <v-col>
        <PkgSummaryCard :pkg_name="pkg.name">
          <template v-slot:actions v-if="$session.exists()">
            <v-btn
              :disabled="isBookmarkedPkg({ name: pkg.name })"
              @click="doBookmarkPkg({ name: pkg.name })">
              Like
            </v-btn>
          </template>
        </PkgSummaryCard>
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
      pkgs: [],
      bookmarks: []
    }),


    methods: {
      async doBookmarkPkg(args) {
        const { name } = args

        if (!this.$session?.exists()) {
          return
        }


        const auth_token = this.$session?.get('AUTH_TOKEN')


        await Api.doBookmarkPkg({ name, auth_token })


        this.bookmarks = await Api.listMyBookmarkedPkgs({
          auth_token
        })
          .then(res => res.data.pkgs)
      },


      isBookmarkedPkg(args) {
        const { name } = args

        return this.bookmarks.find(b => b.name === name)
      },


      async searchForPkgs(args) {
        const { search } = args
        const pkgs_res = await Api.listPkgsWithNamePrefix({ prefix: search })

        if (200 === pkgs_res.status && pkgs_res.data.ok) {
          const { data: { pkgs } } = pkgs_res.data
          this.pkgs = pkgs
        }


        if (this.$session.exists()) {
          const auth_token = this.$session?.get('AUTH_TOKEN')

          this.bookmarks = await Api.listMyBookmarkedPkgs({
            auth_token
          })
            .then(res => res.data.pkgs)
        }
      },
    },


    components: {
      NavHeader,
      PkgSummaryCard
    }
  }
</script>
