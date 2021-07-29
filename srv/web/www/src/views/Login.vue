<template>
  <v-form>
    <v-text-field
      v-model="email"
      type="email"
      label="Email"
    ></v-text-field>

    <v-text-field
      v-model="password"
      type="password"
      label="Password"
    ></v-text-field>

    <v-btn>Sign in</v-btn>

  </v-form>
</template>

<script>
  export default {
    name: 'Login',

    components: {}
  }
</script>
