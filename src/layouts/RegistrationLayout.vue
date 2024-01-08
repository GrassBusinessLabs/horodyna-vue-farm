<template>
  <home-layout :header-title="'Реєстрація'" >
    <v-main class='d-flex align-center justify-center app-bg-color-form'>
      <slot />
    </v-main>
  </home-layout>
</template>
<script setup lang="ts">
import HomeLayout from "@/layouts/HomeLayout.vue"
</script>