<template>
  <v-main>
    <v-container>
      <v-row>
        <v-col>
          <img src="@/assets/logo.png" alt="Node Zoo logo">
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form @submit.prevent="onSubmitSearch">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Search" v-model="search">
                  </v-text-field>
                </v-col>

                <v-col>
                  <v-btn type="submit" fab plain>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-col>
      </v-row>
      <v-row v-for="pkg in pkgs">
        <v-col>
          <v-card
            elevation="1"
            tile
          >
            <v-card-title>{{ pkg.name }}</v-card-title>
            <v-card-subtitle>{{ pkg.version }}</v-card-subtitle>
            <v-card-text>{{ pkg.desc }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  import Api from '@/lib/api'


  export default {
    name: 'Home',

    data: () => ({
      pkgs: [],
      search: ''
    }),

    methods: {
      async onSubmitSearch() {
        this.pkgs = await Api.pkgsWithNameStartingWith(this.search)
          .then(res => res.data.pkgs)
      }
    },

    components: {}
  }
</script>
