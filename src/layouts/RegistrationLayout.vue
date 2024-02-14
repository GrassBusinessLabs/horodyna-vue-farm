<template>
   <v-layout>
      <app-header />

      <v-main class='d-flex align-center justify-center app-bg-color-form'>
         <slot />
      </v-main>
   </v-layout>
</template>
<script setup lang="ts">

import AppHeader from '@/components/AppHeader.vue'
</script>