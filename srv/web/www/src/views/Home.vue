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
          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field label="Search">
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
      pkgs: []
    }),

    async mounted() {
      this.pkgs = await Api.list_pkgs()
        .then(res => res.data.pkgs)
    },

    components: {}
  }
</script>
