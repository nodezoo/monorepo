<template>
  <div>
    <div v-if="is_bookmarked">
      <v-icon class="mr-1" @click="$emit('bookmarkRemoved')">
        mdi-heart
      </v-icon>
      <span class="subheading mr-2">
        Liked
      </span>
    </div>
    <div v-else>
      <v-icon class="mr-1" @click="$emit('bookmarkAdded')">
        mdi-heart-outline
      </v-icon>
    </div>
  </div>
</template>


<script>
export default {
  methods: {
  },

  props: {
    is_bookmarked: {
      required: true
    }
  }
}
</script>


<style lang="scss">
</style>
