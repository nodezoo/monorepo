<template>
  <div class="panel bg-gray-50 p-3">
    <div class="flex">
      <h3 class="font-extrabold text-xl">
        {{ pkg_name }}
      </h3>
    </div>

    <p class="mt-5 font-light">
      {{ pkg_version }}
    </p>
    <p class="font-light">
      {{ pkg_desc }}
    </p>
  </div>
</template>


<script>
  export default {
    name: 'PublicPackageSummaryCard',

    props: {
      pkg_name: {
        type: String,
        required: true
      },

      pkg_version: {
        type: String,
        required: true
      },

      pkg_desc: {
        type: String,
        required: true
      }
    }
  }
</script>
